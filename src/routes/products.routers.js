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

/////////////////////////////////////////////////////
/* La ruta raíz GET /  */
// Obtener todos los productos (Incluyendo la limitación ?limit)
router.get('/', (req, res) => {
  try {
    const limit = req.query.limit; // Obtener el valor del parámetro 'limit' de la consulta (si existe)

    // Leer el archivo JSON de productos
    const productosData = fs.readFileSync(productosFilePath, 'utf8');
    const products = JSON.parse(productosData);

    // Obtener productos limitados según el parámetro 'limit' o todos los productos si no se especifica el parámetro
    const limitedProducts = limit ? products.slice(0, parseInt(limit)) : products;

    return res.status(200).json(limitedProducts);
  } catch (error) {
    return res.status(500).send({ status: 'error', error: 'Error al obtener los productos' });
  }
});

/////////////////////////////////////////////////////
/* La ruta GET /:pid /  */
// Obtener producto con el id proporcionado
router.get('/:pid', (req, res) => {
  try {
    const { pid } = req.params;

    // Leer el archivo JSON de productos
    const productosData = fs.readFileSync(productosFilePath, 'utf8');
    const products = JSON.parse(productosData);

    // Buscar el producto por su ID
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
/* La ruta raíz POST /  */
// Agregar un nuevo producto
router.post('/', (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    // Verificar campos obligatorios
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(500).send({ status: 'error', error: 'Faltan campos obligatorios' });
    }

    // Leer el archivo JSON de productos
    const productosData = fs.readFileSync(productosFilePath, 'utf8');
    const products = JSON.parse(productosData);

    // Generar un ID único para el nuevo producto
    const newProductId = uuidv4().substring(0, 4);

    // Crear el nuevo producto con los campos proporcionados
    const newProduct = {
      id: newProductId,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || 'Sin imagen', // Asignar el string "Sin imagen" si no se proporciona thumbnails
    };

    // Agregar el nuevo producto al array de productos
    products.push(newProduct);

    // Guardar los productos actualizados en el archivo JSON
    fs.writeFileSync(productosFilePath, JSON.stringify(products, null, 2));
    return res.status(201).send({ status: 'created', message: 'Producto agregado correctamente' });
  } catch (error) {
    return res.status(500).send({ status: 'error', error: 'Error al agregar el producto' });
  }
});
/////////////////////////////////////////////////////
/* La ruta raíz PUT /  */
// Modificar un producto desde el id / no deja enviar el id del producto.
router.put('/:pid', (req, res) => {
  try {
    const { pid } = req.params;
    const updateFields = req.body;

    // Verificar si se intenta modificar el ID del producto
    if ('id' in updateFields) {
      return res.status(400).send({ status: 'error', error: 'No se puede modificar el ID del producto' });
    }

    // Leer el archivo JSON de productos
    const productosData = fs.readFileSync(productosFilePath, 'utf8');
    const products = JSON.parse(productosData);

    // Encontrar el índice del producto a actualizar
    const productIndex = products.findIndex((p) => p.id === pid);

    // Verificar si el producto no existe
    if (productIndex === -1) {
      return res.status(404).send({ status: 'error', error: 'Producto no encontrado' });
    }

    // Obtener el producto actual
    const product = products[productIndex];

    // Actualizar los campos proporcionados sin eliminar los campos no proporcionados
    const updatedProduct = {
      ...product,
      ...updateFields,
    };

    // Actualizar el producto en la lista de productos
    products[productIndex] = updatedProduct;

    // Guardar los productos actualizados en el archivo JSON
    fs.writeFileSync(productosFilePath, JSON.stringify(products, null, 2));

    return res.status(200).send({ status: 'success', message: 'Producto actualizado correctamente' });
  } catch (error) {
    return res.status(500).send({ status: 'error', error: 'Error al actualizar el producto' });
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
