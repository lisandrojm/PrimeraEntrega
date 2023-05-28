const express = require('express');
const fs = require('fs').promises;

const router = express.Router();

// Ruta del archivo JSON para respaldar los carritos
const cartsFilePath = './carrito.json';
const productsFilePath = './productos.json';

// Función para generar IDs aleatorios de 4 dígitos
function generateCartId(carts) {
  let id;
  const existingIds = carts.map((cart) => cart.id);

  do {
    id = Math.floor(1000 + Math.random() * 9000).toString();
  } while (existingIds.includes(id));

  return id;
}

// Verificar y crear el archivo "carrito.json" si no existe o está vacío
(async () => {
  try {
    await fs.access(cartsFilePath); // Check if the file exists

    const cartsData = await fs.readFile(cartsFilePath, 'utf8');
    if (cartsData.trim() === '') {
      // Empty file, initialize with empty array
      await fs.writeFile(cartsFilePath, '[]');
    }
  } catch (error) {
    // File does not exist, create with empty array
    await fs.writeFile(cartsFilePath, '[]');
  }
})();

/////////////////////////////////////////////////////
/* La ruta raíz POST / - Crear un nuevo carrito */
router.post('/', async (req, res) => {
  try {
    // Leer el archivo JSON de carritos
    const cartsData = await fs.readFile(cartsFilePath, 'utf8');
    const carts = JSON.parse(cartsData);

    const newCartId = generateCartId(carts); // Generar un nuevo ID para el carrito

    const newCart = {
      id: newCartId,
      products: [], // Inicialmente, el carrito no contiene productos
    };

    // Agregar el nuevo carrito al archivo de carritos
    carts.push(newCart);

    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));

    return res.status(201).send({ status: 'created', message: 'Nuevo carrito creado', cart: newCart });
  } catch (error) {
    return res.status(500).send({ status: 'error', error: 'Error al crear el carrito' });
  }
});

/////////////////////////////////////////////////////
/* La ruta GET /:cid - Listar los productos de un carrito */
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    // Leer el archivo JSON de carritos
    const cartsData = await fs.readFile(cartsFilePath, 'utf8');
    const carts = JSON.parse(cartsData);

    // Buscar el carrito por su ID
    const cart = carts.find((c) => c.id === cid);

    if (!cart) {
      return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });
    }

    return res.status(200).json(cart.products);
  } catch (error) {
    return res.status(500).send({ status: 'error', error: 'Error al obtener los productos del carrito' });
  }
});

/////////////////////////////////////////////////////
/* La ruta POST  /:cid/product/:pid - Agregar un producto al carrito */
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    // Leer el archivo JSON de carritos
    const cartsData = await fs.readFile(cartsFilePath, 'utf8');
    const carts = JSON.parse(cartsData);

    // Buscar el carrito por su ID
    const cartIndex = carts.findIndex((c) => c.id === cid);

    if (cartIndex === -1) {
      return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });
    }

    // Obtener el carrito actual
    const cart = carts[cartIndex];

    // Leer el archivo JSON de productos
    const productsData = await fs.readFile(productsFilePath, 'utf8');
    const products = JSON.parse(productsData);

    // Buscar el producto por su ID
    const product = products.find((p) => p.id === pid);

    if (!product) {
      return res.status(404).send({ status: 'error', error: 'ID de Producto no encontrado en el archivo productos.json. Debe ingresar el ID de un producto existente.' });
    }

    // Buscar el producto en el carrito
    const productIndex = cart.products.findIndex((p) => p.product === pid);

    if (productIndex === -1) {
      // El producto no existe en el carrito, agregarlo como un nuevo objeto
      const newProduct = {
        product: pid,
        quantity: quantity || 1, // Si no se proporciona la cantidad, se establece en 1
      };

      cart.products.push(newProduct);
    } else {
      // El producto ya existe en el carrito, incrementar la cantidad
      cart.products[productIndex].quantity += quantity || 1;
    }

    // Actualizar el carrito en la lista de carritos
    carts[cartIndex] = cart;

    // Guardar los carritos actualizados en el archivo JSON
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));

    return res.status(200).send({ status: 'success', message: 'Producto agregado al carrito correctamente' });
  } catch (error) {
    return res.status(500).send({ status: 'error', error: 'Error al agregar el producto al carrito' });
  }
});

/////////////////////////////////////////////////////
/* La ruta DELETE /:cid/product/:pid - Eliminar un producto del carrito */
router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    // Leer el archivo JSON de carritos
    const cartsData = await fs.readFile(cartsFilePath, 'utf8');
    const carts = JSON.parse(cartsData);

    // Buscar el carrito por su ID
    const cartIndex = carts.findIndex((c) => c.id === cid);

    if (cartIndex === -1) {
      return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });
    }

    // Obtener el carrito actual
    const cart = carts[cartIndex];

    // Buscar el producto en el carrito
    const productIndex = cart.products.findIndex((p) => p.product === pid);

    if (productIndex === -1) {
      return res.status(404).send({ status: 'error', error: 'Producto no encontrado en el carrito' });
    }

    // Eliminar el producto del carrito
    cart.products.splice(productIndex, 1);

    // Actualizar el carrito en la lista de carritos
    carts[cartIndex] = cart;

    // Guardar los carritos actualizados en el archivo JSON
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));

    return res.status(200).send({ status: 'success', message: 'Producto eliminado del carrito correctamente' });
  } catch (error) {
    return res.status(500).send({ status: 'error', error: 'Error al eliminar el producto del carrito' });
  }
});

module.exports = router;
