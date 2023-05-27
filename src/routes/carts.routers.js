const express = require('express');
const router = express.Router();

// Array para almacenar carritos
let carts = [];

// Obtener todos los carritos
router.get('/', (req, res) => {
  try {
    return res.status(201).json(carts);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// Agregar un nuevo carrito
router.post('/', (req, res) => {
  try {
    const newCart = req.body;
    carts.push(newCart);
    return res.send({ status: 'success', message: 'User created' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al agregar el carrito' });
  }
});

module.exports = router;
