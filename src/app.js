////////////////////////////////////////////////////////////////////////////////
/* ENTREGA DEL PROYECTO FINAL - Primera entrega */
////////////////////////////////////////////////////////////////////////////////

/* ************************************************************************** */
/* APP (principal) */
/* ************************************************************************** */

/* Importamos el módulo 'express' y lo asignamos a la variable 'express' */
const express = require('express');

// Importar los routers
const usersRouter = require('./routes/carts.routers');
const petsRouter = require('./routes/products.routers');

/* Creamos una instancia de la aplicación Express */
const app = express();

/* Definimos el número de puerto en el que se ejecutará el servidor */
const PORT = 8080;
/* 
/* Configuramos el middleware de 'json' para analizar los datos JSON en las
solicitudes entrantes y los convertimos en un objeto JavaScript accesible en 'req.body' */
app.use(express.json());
/* Configuramos el middleware de 'urlencoded' para analizar los datos de URL
codificados y los convertimos en un objeto JavaScript accesible en 'req.body' */
app.use(express.urlencoded({ extended: true }));

// Rutas principales con los routers
app.use('/api/carts', usersRouter);
app.use('/api/products', petsRouter);

/* Iniciamos el servidor */
app.listen(PORT, () => {
  /* Mostramos un mensaje en la consola indicando que el servidor se está ejecutando
  en el puerto especificado */
  console.log(`Server is running on port ${PORT}`);
});

////////////////////////////////////////////////////////////////////////////////
/* Comandos de ejecución: npm start / npm run dev */
