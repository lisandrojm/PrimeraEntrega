/* ************************************************************************** */
/* /src/components/carts/cartsController/cartsController.js -  controlador de
 los carritos de compra. */
/* ************************************************************************** */

/* Importar el módulo 'express' para crear y configurar el enrutador */
const express = require('express');

/* Importar el módulo 'fs' para trabajar con el sistema de archivos */
const fs = require('fs').promises;

/* Importar el módulo 'uuid' para generar identificadores únicos */
const { v4: uuidv4 } = require('uuid');

/* Definir la clase 'CartsRouter' */
class CartsRouter {
  constructor() {
    /* Crear una instancia del enrutador de Express */
    this.router = express.Router();

    /* Definir la ruta de los archivos de almacenamiento carrito.json y productos.json */
    this.carritoFilePath = './data/carrito.json';
    this.productsFilePath = './data/productos.json';

    /* Verificar y crear el archivo "carrito.json" si no existe o está vacío */
    this.initializeCarritoFile();

    /* Definir las rutas */
    this.router.post('/', this.addCart);
    this.router.get('/:cid', this.getCartById);
    this.router.post('/:cid/product/:pid', this.addProductToCart);
    this.router.delete('/:cid/product/:pid', this.deleteProductToCart);
    this.router.delete('/:cid', this.deleteCart);
  }

  /* Verificar y crear el archivo "carrito.json" si no existe o está vacío */
  async initializeCarritoFile() {
    try {
      await fs.access(this.carritoFilePath);

      const carritoData = await fs.readFile(this.carritoFilePath, 'utf8');
      if (carritoData.trim() === '') {
        await fs.writeFile(this.carritoFilePath, '[]');
      }
    } catch (error) {
      await fs.writeFile(this.carritoFilePath, '[]');
    }
  }

  /* Agregar un carrito nuevo */
  addCart = async (req, res) => {
    try {
      /* Leer el archivo JSON de carritos */
      const cartsData = await fs.readFile(this.carritoFilePath, 'utf8');
      const carts = JSON.parse(cartsData);

      /* Generar un nuevo ID único para el carrito */
      const newCartId = 'cid' + uuidv4().substring(0, 4);

      /* Crear el nuevo carrito con el ID generado y un array vacío de productos */
      const newCart = {
        id: newCartId,
        products: [],
      };

      /* Agregar el nuevo carrito al array de carritos */
      carts.push(newCart);

      /* Guardar los carritos actualizados en el archivo JSON */
      await fs.writeFile(this.carritoFilePath, JSON.stringify(carts, null, 2));

      /* Responder con el estado 201 (Creado) y enviar el nuevo carrito en la respuesta */
      return res.status(201).json({ status: 'created', message: 'Nuevo carrito creado', cart: newCart });
    } catch (error) {
      /* Responder con el estado 500 (Error del servidor) en caso de error */
      return res.status(500).json({ status: 'error', error: 'Error al crear el carrito' });
    }
  };

  /* Obtener un carrito por su ID */
  getCartById = async (req, res) => {
    try {
      const { cid } = req.params;

      /* Leer el archivo JSON de carritos */
      const cartsData = await fs.readFile(this.carritoFilePath, 'utf8');
      const carts = JSON.parse(cartsData);

      /* Buscar el carrito por su ID */
      const cart = carts.find((c) => c.id === cid);

      if (!cart) {
        /* Si no se encuentra el carrito, responder con el estado 404 (No encontrado) y un mensaje de error */
        return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
      }

      /* Responder con el estado 200 (Éxito) y enviar los productos del carrito en la respuesta */
      return res.status(200).json({ status: 'success', payload: cart.products });
    } catch (error) {
      /* En caso de error, responder con el estado 500 (Error del servidor) y un mensaje de error */
      return res.status(500).json({ status: 'error', error: 'Error al obtener los productos del carrito' });
    }
  };

  /* Agregar un producto a un carrito */
  addProductToCart = async (req, res) => {
    try {
      /* Desestructurar los parámetros de la solicitud */
      const { cid, pid } = req.params;
      /* Desestructurar el cuerpo de la solicitud */
      const { quantity } = req.body;

      /* Leer el archivo JSON de carritos */
      const cartsData = await fs.readFile(this.carritoFilePath, 'utf8');
      const carts = JSON.parse(cartsData);

      /* Buscar el carrito por su ID */
      const cartIndex = carts.findIndex((c) => c.id === cid);

      if (cartIndex === -1) {
        /* Si no se encuentra el carrito, responder con el estado 404 (No encontrado) y un mensaje de error */
        return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
      }

      /* Obtener el carrito actual */
      const cart = carts[cartIndex];

      /* Leer el archivo JSON de productos */
      const productsData = await fs.readFile(this.productsFilePath, 'utf8');
      const products = JSON.parse(productsData);

      /* Buscar el producto por su ID */
      const product = products.find((p) => p.id === pid);

      if (!product) {
        /* Si no se encuentra el producto, responder con el estado 404 (No encontrado) y un mensaje de error */
        return res.status(404).json({ status: 'error', error: 'ID de Producto no encontrado. Debe ingresar el ID de un producto existente en el archivo productos.json' });
      }

      /* Buscar el producto en el carrito */
      const productIndex = cart.products.findIndex((p) => p.productId === pid);

      if (productIndex === -1) {
        /* El producto no existe en el carrito, agregarlo como un nuevo objeto */
        const newProduct = {
          productId: pid,
          quantity: quantity || 1, // Si no se proporciona la cantidad, se establece en 1
        };

        cart.products.push(newProduct);
      } else {
        /* El producto ya existe en el carrito, incrementar la cantidad */
        cart.products[productIndex].quantity += quantity || 1;
      }

      /* Actualizar el carrito en la lista de carritos */
      carts[cartIndex] = cart;

      /* Guardar los carritos actualizados en el archivo JSON */
      await fs.writeFile(this.carritoFilePath, JSON.stringify(carts, null, 2));

      /* Responder con el estado 200 (Éxito) y un mensaje de éxito */
      return res.status(200).json({ status: 'success', message: 'Producto agregado al carrito correctamente' });
    } catch (error) {
      /* En caso de error, responder con el estado 500 (Error del servidor) y un mensaje de error */
      return res.status(500).json({ status: 'error', error: 'Error al agregar el producto al carrito' });
    }
  };

  /* Eliminar un producto del carrito */
  deleteProductToCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;

      /* Leer el archivo JSON de carritos */
      const cartsData = await fs.readFile(this.carritoFilePath, 'utf8');
      const carts = JSON.parse(cartsData);

      /* Buscar el carrito por su ID */
      const cartIndex = carts.findIndex((c) => c.id === cid);

      if (cartIndex === -1) {
        return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
      }

      /* Obtener el carrito actual */
      const cart = carts[cartIndex];

      /* Buscar el producto en el carrito */
      const productIndex = cart.products.findIndex((p) => p.productId === pid);

      if (productIndex === -1) {
        return res.status(404).json({ status: 'error', error: 'Producto no encontrado en el carrito' });
      }

      /* Eliminar el producto del carrito */
      cart.products.splice(productIndex, 1);

      /* Actualizar el carrito en la lista de carritos */
      carts[cartIndex] = cart;

      /* Guardar los carritos actualizados en el archivo JSON */
      await fs.writeFile(this.carritoFilePath, JSON.stringify(carts, null, 2));

      return res.status(200).json({ status: 'success', message: 'Producto eliminado del carrito correctamente' });
    } catch (error) {
      return res.status(500).json({ status: 'error', error: 'Error al eliminar el producto del carrito' });
    }
  };

  /* Eliminar un carrito */
  deleteCart = async (req, res) => {
    try {
      const { cid } = req.params;

      /* Leer el archivo JSON de carritos */
      const cartsData = await fs.readFile(this.carritoFilePath, 'utf8');
      const carts = JSON.parse(cartsData);

      /* Buscar el carrito por su ID */
      const cartIndex = carts.findIndex((c) => c.id === cid);

      if (cartIndex === -1) {
        return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
      }

      /* Eliminar el carrito de la lista de carritos */
      carts.splice(cartIndex, 1);

      /* Guardar los carritos actualizados en el archivo JSON */
      await fs.writeFile(this.carritoFilePath, JSON.stringify(carts, null, 2));

      return res.status(200).json({ status: 'success', message: 'Carrito eliminado correctamente' });
    } catch (error) {
      return res.status(500).json({ status: 'error', error: 'Error al eliminar el carrito' });
    }
  };
}

module.exports = new CartsRouter();
