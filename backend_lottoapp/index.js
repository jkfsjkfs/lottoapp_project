require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

app.post('/api/registros', async (req, res) => {
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

// Ruta para verificar si un número ya fue registrado
app.get('/api/registros/:numero', async (req, res) => {
  const { numero } = req.params;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM registros WHERE numero = ?', [numero]);
    await connection.end();

    if (rows.length > 0) {
      res.json(rows); // Número ya existe
    } else {
      res.json(null); // Número libre
    }
  } catch (error) {
    console.error('Error al verificar número:', error);
    res.status(500).json({ error: 'Error al consultar el número' });
  }
});




app.listen(port, () => {
  console.log(`Servidor backend en http://localhost:${port}`);
});