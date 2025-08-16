// Seguridad y utilidades
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const basicAuth = require('express-basic-auth');
const jwt = require('jsonwebtoken');

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
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // ssl: { rejectUnauthorized: true }, // ← descomenta si tu proveedor de DB lo requiere
};

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
      servers: [{ url: baseUrl, description: isProd ? 'Prod' : 'Local/Dev' }],
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
          appKeyHeader: { type: 'apiKey', in: 'header', name: 'x-app-key' },
        },
      },
      security: [{ bearerAuth: [] }, { appKeyHeader: [] }],
    },
    apis: ['./index.js'],
  });

  // Proteger /docs (solo accesible desde localhost en dev)
  const docsAuth = basicAuth({
    users: { [process.env.DOCS_USER || 'admin']: process.env.DOCS_PASS || 'changeme' },
    challenge: true,
  });

  app.use('/docs',
    allowLocalOnly,          // ← solo localhost (dev)
    docsAuth,                // ← además con Basic Auth
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

// ======= Auth =======

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Autenticación de usuario para obtener un JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user, pass]
 *             properties:
 *               user: { type: string, example: "rifa" }
 *               pass: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: Token generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string, example: "eyJhbGciOi..." }
 *       401: { description: Credenciales inválidas }
 */
app.post('/auth/login', (req, res) => {
  const { user, pass } = req.body;
  const VALID_USER = process.env.API_USER || 'rifa';
  const VALID_PASS = process.env.API_PASS || '123456';
  if (user !== VALID_USER || pass !== VALID_PASS) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const payload = { sub: user, role: 'app' };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Middleware JWT
function authJWT(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

// Middleware x-app-key (opcional)
function appKeyGuard(req, res, next) {
  const key = req.headers['x-app-key'];
  if (!key || key !== process.env.APP_KEY) {
    return res.status(401).json({ error: 'x-app-key inválida' });
  }
  next();
}

// ======= Rutas API =======

/**
 * @openapi
 * /api/registros:
 *   post:
 *     summary: Crea un registro de número de rifa
 *     tags: [Registros]
 *     security: [ { bearerAuth: [] }, { appKeyHeader: [] } ]
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
app.post('/api/registros', authJWT, appKeyGuard, async (req, res) => {
  const { numero, nombre, telefono } = req.body;
  if (!numero || !nombre || !telefono) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'INSERT INTO registros (numero, nombre, telefono) VALUES (?, ?, ?)',
      [numero, nombre, telefono]
    );
    await connection.end();
    res.status(200).json({ message: 'Registro exitoso' });
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
 *     security: [ { bearerAuth: [] }, { appKeyHeader: [] } ]
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
app.get('/api/registros/:numero', authJWT, appKeyGuard, async (req, res) => {
  const { numero } = req.params;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM registros WHERE numero = ?', [numero]);
    await connection.end();

    if (rows.length > 0) res.json(rows);
    else res.json(null);
  } catch (error) {
    console.error('Error al verificar número:', error);
    res.status(500).json({ error: 'Error al consultar el número' });
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
