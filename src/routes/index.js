/* ************************************************************************** */
/* /src/routes - Contiene las definiciones de rutas para los productos y
carritos de compra.
/* ************************************************************************** */

/* Importar el módulo 'productsApi' desde el directorio '../components/products' */
const productsApi = require('../components/products');

/* Importar el módulo 'cartsApi' desde el directorio '../components/carts' */
const cartsApi = require('../components/carts');

/* Exportar una función que recibe una instancia de la aplicación 'app' */
module.exports = (app) => {
  /* Llamar a la función 'productsApi' pasando la instancia de la aplicación 'app' */
  productsApi(app);

  /* Llamar a la función 'cartsApi' pasando la instancia de la aplicación 'app' */
  cartsApi(app);
};
