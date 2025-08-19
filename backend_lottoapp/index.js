// Seguridad y utilidades
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const basicAuth = require('express-basic-auth');
// const jwt = require('jsonwebtoken');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// CORS
if (isProd) {
  const allowed = new Set([process.env.FRONTEND_ORIGIN].filter(Boolean));
  app.use(cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);              // Postman/cURL
      if (allowed.has(origin)) return cb(null, true);  // Frontend permitido
      return cb(new Error('Origen no permitido por CORS'));
    },
    credentials: false
  }));
} else {
  // Dev: más permisivo para Expo/localhost
  app.use(cors());
}

// Helmet (desactiva CSP para Swagger UI si estuviera activo)
app.use(helmet({ contentSecurityPolicy: false }));

// Solo confía en 1 proxy en prod (nginx/traefik). En dev: no confíes.
app.set('trust proxy', isProd ? 1 : false);

// Rate limiting: usa la misma política explícitamente
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  trustProxy: isProd ? 1 : false,  // 👈 clave
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(['/api', '/auth'], apiLimiter);

// === SOLO LOCALHOST para Swagger (en desarrollo) ===
function allowLocalOnly(req, res, next) {
  const ip = req.ip || req.connection?.remoteAddress || '';
  const localIps = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);
  if (localIps.has(ip)) return next();

  const xff = (req.headers['x-forwarded-for'] || '').toString().split(',')[0]?.trim();
  if (localIps.has(xff)) return next();

  return res.status(403).send('Forbidden: Available only on server');
}

// Config DB
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // OJO: tu .env usa DB_PASSWORD
  database: process.env.DB_NAME,
  // ssl: { rejectUnauthorized: true }, // ← descomenta si tu proveedor de DB lo requiere
};

// Pool para mejor performance
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  enableKeepAlive: true,
});

// Helpers
function bitToBool(val) {
  if (val === null || val === undefined) return false;
  if (Buffer.isBuffer(val)) return val[0] === 1;
  if (typeof val === 'number') return val === 1;
  if (typeof val === 'boolean') return val;
  return String(val) === '1';
}

let bcrypt;
try { bcrypt = require('bcryptjs'); } catch { bcrypt = null; }
const allowPlain = String(process.env.PLAIN_ALLOWED || '').toLowerCase() === 'true';

async function verifyPassword(inputPassword, stored) {
  
  // 1) bcrypt si hay hash
  if (bcrypt && stored && typeof stored === 'string' && stored.startsWith('$2')) {
    try {
      return await bcrypt.compare(inputPassword, stored);
    } catch { /* ignore */ }
  }
  
  // 2) fallback en claro si está habilitado
  if (allowPlain) return inputPassword === stored;
  
  return false;
}

// Swagger Spec (solo se construye si NO estás en producción)
let swaggerSpec;
if (!isProd) {
  const baseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${port}`;
  swaggerSpec = swaggerJSDoc({
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Lotto API',
        version: '1.0.0',
        description: 'API para gestionar registros de la rifa/lotto',
      },
      servers: [{ url: baseUrl, description: 'Local/Dev' }],
      components: {
        securitySchemes: {
          // 👇 Solo apiKey por header
          appKeyHeader: { type: 'apiKey', in: 'header', name: 'x-app-key' },
        },
      },
      // 👇 Seguridad global: solo x-app-key en /api/* (no para /auth)
      security: [{ appKeyHeader: [] }],
    },
    apis: ['./index.js'],
  });

  // Proteger /docs (solo accesible desde localhost en dev)
  const docsAuth = basicAuth({
    users: { [process.env.DOCS_USER || 'admin']: process.env.DOCS_PASS || 'changeme' },
    challenge: true,
  });

  app.use(
    '/docs',
    allowLocalOnly,   // solo localhost
    docsAuth,         // basic auth adicional
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
}

// Home
app.get('/', (req, res) => {
  if (!isProd) {
    return allowLocalOnly(req, res, () => res.redirect('/docs'));
  }
  res.send('Lotto API');
});


// Middleware x-app-key (opcional) — solo para /api/*
function appKeyGuard(req, res, next) {

  const key = req.headers['x-app-key'];
  
  if (!key || key !== process.env.APP_KEY) {
    return res.status(401).json({ error: 'x-app-key inválida' });
  }
  
  next();
}






// ======= Auth (contra tabla usuario) =======
/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Autenticación de usuario 
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [login, password]
 *             properties:
 *               login: { type: string, example: "rifa" }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idusuario: { type: integer }
 *                 idperfil: { type: integer }
 *                 nombre: { type: string }
 *                 login: { type: string }
 *       401: { description: Credenciales inválidas o usuario inactivo }
 *       400: { description: Faltan credenciales }
 */
app.post('/auth/login', appKeyGuard, async (req, res) => {
  try {
    const { login, password } = req.body || {};
    if (!login || !password) {
      return res.status(400).json({ message: 'Faltan credenciales' });
    }

    const [rows] = await pool.query(
      `SELECT idusuario, idperfil, nombre, login, password, activo
         FROM usuario
        WHERE login = ?
        LIMIT 1`,
      [login]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const row = rows[0];
    if (!bitToBool(row.activo)) {
      return res.status(401).json({ message: 'Usuario inactivo' });
    }

    const ok = await verifyPassword(password, row.password || '');
    
    if (!ok) {
      return res.status(401).json({ message: 'Credenciales NO válidas' });
    }
    

    // Éxito: devolvemos perfil mínimo para frontend
    return res.json({
      idusuario: row.idusuario,
      idperfil: row.idperfil,
      nombre: row.nombre,
      login: row.login,
    });
    
  } catch (err) {
    console.error('auth/login error', err);
    return res.status(500).json({ message: 'Error interno' });
  }
});

// ======= Rutas API =======

/**
 * @openapi
 * /api/registros:
 *   post:
 *     summary: Crea un registro de número de rifa
 *     tags: [Registros]
 *     security: [ { appKeyHeader: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [numero, nombre, telefono]
 *             properties:
 *               numero: { type: string, example: "1234" }
 *               nombre: { type: string, example: "Juan Pérez" }
 *               telefono: { type: string, example: "3001234567" }
 *     responses:
 *       200: { description: Registro exitoso }
 *       400: { description: Datos incompletos }
 *       401: { description: No autorizado }
 *       500: { description: Error en el servidor }
 */
app.post('/api/registros', appKeyGuard, async (req, res) => {
  const { numero, nombre, telefono } = req.body;
  if (!numero || !nombre || !telefono) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.execute(
        // NOTA: tu BD dump usa tabla `registro` (singular). Aquí mantengo `registros` porque así estaba tu código.
        // Si tu tabla real es `registro`, cambia a:
        // 'INSERT INTO registro (numero, nombre, telefono) VALUES (?, ?, ?)'
        'INSERT INTO registros (numero, nombre, telefono) VALUES (?, ?, ?)',
        [numero, nombre, telefono]
      );
      res.status(200).json({ message: 'Registro exitoso' });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error al guardar registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

/**
 * @openapi
 * /api/registros/{numero}:
 *   get:
 *     summary: Obtiene un registro por número
 *     tags: [Registros]
 *     security: [ { appKeyHeader: [] } ]
 *     parameters:
 *       - in: path
 *         name: numero
 *         required: true
 *         schema: { type: string }
 *         description: Número de rifa (p. ej. "1234")
 *     responses:
 *       200:
 *         description: OK (array con registros o null)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer }
 *                       numero: { type: string }
 *                       nombre: { type: string }
 *                       telefono: { type: string }
 *                       fecha: { type: string, format: date-time }
 *                 - type: "null"
 *       401: { description: No autorizado }
 *       500: { description: Error en el servidor }
 */
app.get('/api/registros/:numero', appKeyGuard, async (req, res) => {
  const { numero } = req.params;
  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute('SELECT * FROM registros WHERE numero = ?', [numero]);
      if (rows.length > 0) res.json(rows);
      else res.json(null);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error al verificar número:', error);
    res.status(500).json({ error: 'Error al consultar el número' });
  }
});

/**
 * @openapi
 * /api/loterias:
 *   get:
 *     summary: Lista de loterías activas
 *     tags: [Loterias]
 *     security: [ { appKeyHeader: [] } ]
 *     responses:
 *       200:
 *         description: Lista de loterías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idloteria: { type: integer }
 *                   nombre: { type: string }
 *       401: { description: No autorizado }
 *       500: { description: Error en el servidor }
 */
app.get('/api/loterias', appKeyGuard, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute(
        'SELECT idloteria, descrip FROM loteria WHERE activa'
      );
      res.json(rows);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error al consultar loterías:', error);
    res.status(500).json({ error: 'Error al obtener las loterías' });
  }
});



// Arranque
app.listen(port, () => {
  console.log(`Servidor backend en http://localhost:${port}`);
  if (!isProd) {
    console.log(`Swagger UI (solo localhost) en http://localhost:${port}/docs`);
  } else {
    console.log('Swagger deshabilitado en producción');
  }
});
