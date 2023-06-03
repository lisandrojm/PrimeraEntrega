const express = require('express');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class ProductRouter {
  constructor() {
    this.router = express.Router();
    this.productosFilePath = './data/productos.json';

    // Verificar y crear el archivo "productos.json" si no existe o está vacío
    this.initializeProductsFile();

    // Definir las rutas
    this.router.get('/', this.getAllProducts);
    this.router.get('/:pid', this.getProductById);
    this.router.post('/', this.addProduct);
    this.router.put('/:pid', this.updateProduct);
    this.router.delete('/:pid', this.deleteProduct);
  }

  // Verificar y crear el archivo "productos.json" si no existe o está vacío
  async initializeProductsFile() {
    try {
      await fs.access(this.productosFilePath);

      const productosData = await fs.readFile(this.productosFilePath, 'utf8');
      if (productosData.trim() === '') {
        await fs.writeFile(this.productosFilePath, '[]');
      }
    } catch (error) {
      await fs.writeFile(this.productosFilePath, '[]');
    }
  }

  // Obtener todos los productos
  getAllProducts = async (req, res) => {
    try {
      const limit = req.query.limit;

      const productosData = await fs.readFile(this.productosFilePath, 'utf8');
      const products = JSON.parse(productosData);

      const limitedProducts = limit ? products.slice(0, parseInt(limit)) : { status: 'success', payload: products };

      return res.status(200).json(limitedProducts);
    } catch (error) {
      return res.status(500).json({ status: 'error', error: 'Error al obtener los productos' });
    }
  };

  // Obtener un producto por ID
  getProductById = async (req, res) => {
    try {
      const { pid } = req.params;

      const productosData = await fs.readFile(this.productosFilePath, 'utf8');
      const products = JSON.parse(productosData);

      const product = products.find((p) => p.id === pid);

      if (!product) {
        return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
      }

      return res.status(200).json({ status: 'success', payload: product });
    } catch (error) {
      return res.status(500).json({ status: 'error', error: 'Error al obtener el producto' });
    }
  };

  // Agregar un nuevo producto
  addProduct = async (req, res) => {
    try {
      const { id, title, description, code, price, stock, category, thumbnails } = req.body;

      if (id) {
        return res.status(400).json({ status: 'error', error: 'No envíe el ID del producto. Se genera automáticamente para que sea único e irrepetible' });
      }

      if (!title || !description || !code || !price || !stock || !category) {
        return res.status(500).json({ status: 'error', error: 'Faltan campos obligatorios' });
      }

      const productosData = await fs.readFile(this.productosFilePath, 'utf8');
      const products = JSON.parse(productosData);

      const existingProduct = products.find((p) => p.code === code);

      if (existingProduct) {
        return res.status(400).json({ status: 'error', error: 'Ya existe un producto con el mismo código' });
      }

      const newProductId = 'pid' + uuidv4().substring(0, 4);

      const newProduct = {
        id: newProductId,
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || 'Sin imagen',
      };

      products.push(newProduct);

      await fs.writeFile(this.productosFilePath, JSON.stringify(products, null, 2));

      return res.status(201).json({ status: 'created', message: 'Producto agregado correctamente' });
    } catch (error) {
      return res.status(500).json({ status: 'error', error: 'Error al agregar el producto' });
    }
  };

  // Actualizar un producto
  updateProduct = async (req, res) => {
    try {
      const { pid } = req.params;
      const updateFields = req.body;

      if ('id' in updateFields) {
        return res.status(400).json({ status: 'error', error: 'No se puede modificar el ID del producto' });
      }

      const allowedFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
      const invalidFields = Object.keys(updateFields).filter((field) => !allowedFields.includes(field));

      if (invalidFields.length > 0) {
        return res.status(400).json({ status: 'error', error: `Los siguientes campos no se pueden modificar: ${invalidFields.join(', ')}` });
      }

      const productosData = await fs.readFile(this.productosFilePath, 'utf8');
      const products = JSON.parse(productosData);

      const productIndex = products.findIndex((p) => p.id === pid);

      if (productIndex === -1) {
        return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
      }

      const product = products[productIndex];

      const updatedProduct = {
        ...product,
        ...updateFields,
      };

      products[productIndex] = updatedProduct;

      await fs.writeFile(this.productosFilePath, JSON.stringify(products, null, 2));

      return res.status(200).json({ status: 'success', message: 'Producto actualizado correctamente' });
    } catch (error) {
      return res.status(500).json({ status: 'error', error: 'Error al actualizar el producto' });
    }
  };

  // Eliminar un producto
  deleteProduct = async (req, res) => {
    try {
      const { pid } = req.params;

      const productosData = await fs.readFile(this.productosFilePath, 'utf8');
      const products = JSON.parse(productosData);

      const productIndex = products.findIndex((p) => p.id === pid);

      if (productIndex === -1) {
        return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
      }

      products.splice(productIndex, 1);

      await fs.writeFile(this.productosFilePath, JSON.stringify(products, null, 2));

      return res.status(200).json({ status: 'success', message: 'Producto eliminado correctamente' });
    } catch (error) {
      return res.status(500).json({ status: 'error', error: 'Error al eliminar el producto' });
    }
  };
}

module.exports = new ProductRouter();
