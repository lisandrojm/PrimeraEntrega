# ENTREGA DEL PROYECTO FINAL - Primera pre entrega - Coderhouse/Backend

Este repositorio contiene la primera entrega del proyecto final del curso de Backend de Coderhouse. El proyecto utiliza Node.js y Express.js para crear una API RESTful que permite administrar productos y carritos de compras.

## Estructura de Carpetas y Archivos

El código está organizado en las siguientes carpetas y archivos:

- `/data`: Contiene los archivos JSON utilizados para almacenar los datos de productos (`productos.json`) y carritos de compra (`carrito.json`).
- `/src/components/carts`: Contiene el controlador de los carritos de compra (`cartsController.js`).
- `/src/components/products`: Contiene el controlador de los productos (`productsController.js`).
- `/src/routes`: Contiene las definiciones de rutas para los productos y carritos de compra.
- `/src`: Contiene el archivo principal de la aplicación (`index.js`) que inicia el servidor y configura las rutas.
- `/index.js`: Archivo principal de la aplicación.

## Controlador de Productos (`productsController.js`)

El controlador de productos se encarga de manejar las operaciones relacionadas con los productos, como obtener todos los productos, obtener un producto por ID, agregar un nuevo producto, actualizar un producto y eliminar un producto.

El controlador utiliza el archivo JSON `productos.json` para almacenar y recuperar los datos de los productos. Algunas de las funciones clave en el controlador de productos son:

- `getAllProducts`: Obtiene todos los productos almacenados en el archivo `productos.json`.
- `getProductById`: Obtiene un producto específico por su ID.
- `addProduct`: Agrega un nuevo producto al archivo `productos.json`.
- `updateProduct`: Actualiza un producto existente en el archivo `productos.json`.
- `deleteProduct`: Elimina un producto del archivo `productos.json`.

## Controlador de Carritos de Compra (`cartsController.js`)

El controlador de carritos de compra se encarga de manejar las operaciones relacionadas con los carritos de compra, como crear un nuevo carrito, obtener un carrito por su ID, agregar un producto al carrito y eliminar un producto del carrito.

El controlador utiliza los archivos JSON `carrito.json` y `productos.json` para almacenar y recuperar los datos de los carritos y productos, respectivamente. Algunas de las funciones clave en el controlador de carritos de compra son:

- `addCart`: Crea un nuevo carrito y lo agrega al archivo `carrito.json`.
- `getCartById`: Obtiene un carrito específico por su ID.
- `addProductToCart`: Agrega un producto al carrito especificado.
- `deleteProductToCart`: Elimina un producto del carrito especificado.
- `deleteCart`: Elimina un carrito del archivo `carrito.json`.

## Rutas disponibles

La aplicación expone las siguientes rutas:

- `GET /api/products`: Obtiene la lista de productos.
- `GET /api/products?limit=`: Obtiene la lista de productos con un límite determinado.
- `GET /api/products/:pid`: Obtiene un producto específico por su ID.
- `POST /api/products`: Agrega un nuevo producto.
- `PUT /api/products/:pid`: Actualiza un producto existente.
- `DELETE /api/products/:pid`: Elimina un producto existente.

- `POST /api/carts`: Crea un nuevo carrito.
- `GET /api/carts/:cid`: Obtiene los productos de un carrito específico.
- `POST /api/carts/:cid/product/:pid`: Agrega un producto al carrito.
- `DELETE /api/carts/:cid/product/:pid`: Elimina un producto del carrito.
- `DELETE /api/carts/:cid`: Elimina un carrito.
-

## Video Postman Test

https://github.com/lisandrojm/primera_entrega/assets/35199683/11f1e158-98c2-4dbf-8fca-098d0075f0dd

## Instalación

1. Clona este repositorio en tu máquina local:

   ```shell
   git clone https://github.com/lisandrojm/primera_pre-entrega
   ```

2. Navega al directorio del proyecto:

   ```shell
   cd primera_pre-entrega

   ```

3. Instala las dependencias del proyecto:

   ```shell
   npm install
   ```

## Uso

### Ejecutar la aplicación

Para iniciar la aplicación, ejecuta el siguiente comando:

```shell
npm start
```

Esto iniciará el servidor en el puerto 8080.

### Ejecutar en modo de desarrollo

Si deseas ejecutar la aplicación en modo de desarrollo, puedes utilizar el siguiente comando:

```shell
npm run dev
```

Esto iniciará el servidor utilizando Nodemon, lo que significa que la aplicación se reiniciará automáticamente cuando detecte cambios en los archivos.

## Dependencias

El proyecto utiliza las siguientes dependencias:

- Express.js (v4.18.2): Framework de Node.js para construir aplicaciones web.
- UUID (v9.0.0): Biblioteca para generar identificadores únicos.

## DevDependencies

El proyecto utiliza las siguientes devDependencies:

- Nodemon (v2.0.22): Utilidad que monitoriza cambios en los archivos y reinicia automáticamente la aplicación.

## Postman Collections

- En la carpeta `postman_collections`, encontrarás los archivos necesarios para importar las colecciones en Postman y realizar pruebas en el proyecto. Las colecciones proporcionan ejemplos de solicitudes HTTP para interactuar con la API y probar su funcionalidad.
