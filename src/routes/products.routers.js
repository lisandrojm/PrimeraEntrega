const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Ruta del archivo JSON para respaldar los productos
const productosFilePath = './productos.json';

// Verificar y crear el archivo "productos.json" si no existe o está vacío
if (!fs.existsSync(productosFilePath) || fs.readFileSync(productosFilePath, 'utf8').trim() === '') {
  fs.writeFileSync(productosFilePath, '[]');
}

// Obtener todos los productos
router.get('/', (req, res) => {
  try {
    // Leer el archivo JSON de productos
    const productosData = fs.readFileSync(productosFilePath, 'utf8');
    const products = JSON.parse(productosData);
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Agregar un nuevo producto
router.post('/', (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    // Leer el archivo JSON de productos
    const productosData = fs.readFileSync(productosFilePath, 'utf8');
    const products = JSON.parse(productosData);

    // Generar un ID único para el nuevo producto
    const newProductId = uuidv4();

    // Crear el nuevo producto con los campos proporcionados
    const newProduct = {
      id: newProductId,
      title,
      description,
      code,
      price,
      status: true, // Por defecto, el estado es true
      stock,
      category,
      thumbnails: thumbnails || [], // Si no se proporciona thumbnails, se asigna un array vacío
    };

    // Agregar el nuevo producto al array de productos
    products.push(newProduct);

    // Guardar los productos actualizados en el archivo JSON
    fs.writeFileSync(productosFilePath, JSON.stringify(products, null, 2));

    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

module.exports = router;
