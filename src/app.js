////////////////////////////////////////////////////////////////////////////////
/* ENTREGA DEL PROYECTO FINAL - Primera entrega */
////////////////////////////////////////////////////////////////////////////////

/* ************************************************************************** */
/* APP */
/* ************************************************************************** */

/* Importar el módulo 'express' y lo asignamos a la variable 'express' */
const express = require('express');

/* Importar los routers */
const cartsRouter = require('./routes/carts.routers');
const productsRouter = require('./routes/products.routers');

/* Crear una instancia de la aplicación Express */
const app = express();

/* Definir el número de puerto en el que se ejecutará el servidor */
const PORT = 8080;

/* Configurar el middleware de 'json' para analizar los datos JSON en las
solicitudes entrantes y los convertimos en un objeto JavaScript accesible en 'req.body' */
app.use(express.json());

/* Configurar el middleware de 'urlencoded' para analizar los datos de URL
codificados y convertirlos en un objeto JavaScript accesible en 'req.body' */
app.use(express.urlencoded({ extended: true }));

/* Rutas principales con los routers */
/* Establecer la ruta base "/api/carts" para el cartsRouter */
app.use('/api/carts', cartsRouter);
/* Establecer la ruta base "/api/products" para el productsRouter */
app.use('/api/products', productsRouter);

/* Iniciar el servidor */
app.listen(PORT, () => {
  /* Mostrar un mensaje en la consola indicando que el servidor se está ejecutando
  en el puerto especificado */
  console.log(`Server is running on port ${PORT}`);
});

////////////////////////////////////////////////////////////////////////////////
/* Comandos de ejecución: npm start / npm run dev */
