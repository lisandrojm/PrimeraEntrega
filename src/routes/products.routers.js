const express = require('express');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const productosFilePath = './productos.json';

// Verificar y crear el archivo "productos.json" si no existe o está vacío
(async () => {
  try {
    await fs.access(productosFilePath);
    const fileContent = await fs.readFile(productosFilePath, 'utf8');
    if (fileContent.trim() === '') {
      await fs.writeFile(productosFilePath, '[]');
    }
  } catch (error) {
    console.error('Error al verificar y crear el archivo productos.json:', error);
  }
})();

/////////////////////////////////////////////////////
/* La ruta raíz GET / */
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit;

    const productosData = await fs.readFile(productosFilePath, 'utf8');
    const products = JSON.parse(productosData);

    const limitedProducts = limit ? products.slice(0, parseInt(limit)) : products;

    return res.status(200).json(limitedProducts);
  } catch (error) {
    return res.status(500).send({ status: 'error', error: 'Error al obtener los productos' });
  }
});

/////////////////////////////////////////////////////
/* La ruta GET /:pid */
router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;

    const productosData = await fs.readFile(productosFilePath, 'utf8');
    const products = JSON.parse(productosData);

    const product = products.find((p) => p.id === pid);

    if (!product) {
      return res.status(404).send({ status: 'error', error: 'Producto no encontrado' });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).send({ status: 'error', error: 'Error al obtener el producto' });
  }
});

/////////////////////////////////////////////////////
/* La ruta raíz POST / */
router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(500).send({ status: 'error', error: 'Faltan campos obligatorios' });
    }

    const productosData = await fs.readFile(productosFilePath, 'utf8');
    const products = JSON.parse(productosData);

    const newProductId = uuidv4().substring(0, 4);

    const newProduct = {
      id: newProductId,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || ['Sin imágenes'],
    };

    products.push(newProduct);

    await fs.writeFile(productosFilePath, JSON.stringify(products, null, 2));
    return res.status(201).send({ status: 'created', message: 'Producto agregado correctamente' });
  } catch (error) {
    return res.status(500).send({ status: 'error', error: 'Error al agregar el producto' });
  }
});

module.exports = router;

/////////////////////////////////////////////////////
/* Postman Testing */

/////////////////////////////////////////////////////
/* La ruta raíz GET /  */
// Obtener todos los productos */
/* http://localhost:8080/api/products/ */
// Retorna todos los productos

/////////////////////////////////////////////////////
/* La ruta raíz GET (Incluyendo la limitación ?limit)  */
// Obtener todos los productos */
/* http://localhost:8080/api/products?limit=2 */
// Retorna los dos primeros productos

/////////////////////////////////////////////////////
/* La ruta GET /:pid /  */
// Obtener producto con el id proporcionado */
/* http://localhost:8080/api/products/b4de */
// Retorna el producto con el id seleccionado

/////////////////////////////////////////////////////
/* La ruta raíz POST /  */
// Agregar un nuevo producto
/* http://localhost:8080/api/products/ */
// Templates de productos para el Body de Postman

// Sin campo thumbnails
/* {
  "title": "Producto Postman",
  "description": "Este es un producto de Postman",
  "code": "a1",
  "price": 100,
  "stock": 10,
  "category": "Categoría Postman"
} */
// Retorna : created : Producto agregado correctamente y "thumbnails":['Sin imagenes']

// Con campo  "thumbnails"
/* {
  "title": "Producto Postman",
  "description": "Este es un producto de Postman",
  "code": "a1",
  "price": 100,
  "stock": 10,
  "category": "Categoría Postman",
  "thumbnails": [
    "/ruta/de/image1.jpg",
    "/ruta/de/image2.jpg",
    "/ruta/de/image3.jpg"
  ]
} */

// Con campo  "thumbnails", pero sin el campo "price"
/* {
  "title": "Producto Postman",
  "description": "Este es un producto de Postman",
  "code": "a1",
  "stock": 10,
  "category": "Categoría Postman",
  "thumbnails": [
    "/ruta/de/image1.jpg",
    "/ruta/de/image2.jpg",
    "/ruta/de/image3.jpg"
  ]
} */
// Retorna : error: Faltan campos obligatorios
