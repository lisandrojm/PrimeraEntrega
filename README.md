# ENTREGA DEL PROYECTO FINAL - Primera entrega - Coderhouse/Backend

Este repositorio contiene la primera entrega del proyecto final del curso de backend de Coderhouse. El proyecto utiliza Node.js y Express.js para crear una API RESTful que permite administrar productos y carritos de compras.

## Descripción del código

- El archivo `app.js` es el punto de entrada de la aplicación. En este archivo, se configura el servidor Express, se establecen middlewares para el manejo de solicitudes JSON y URL codificadas, y se definen las rutas para los endpoints relacionados con productos y carritos.

- El archivo `products.routers.js` define las rutas y controladores relacionados con los productos. Este archivo maneja las operaciones de obtener todos los productos, obtener un producto específico por su ID, agregar un nuevo producto, actualizar un producto existente y eliminar un producto.

- El archivo `carts.routers.js` define las rutas y controladores relacionados con los carritos. Este archivo maneja las operaciones de crear un nuevo carrito, obtener los productos de un carrito específico, agregar un producto a un carrito, eliminar un producto de un carrito y eliminar un carrito completo.

- Los archivos `productos.json` y `carrito.json`se utilizan para almacenar los productos y los carritos de compras respectivamente.

## Instalación

1. Clona este repositorio en tu máquina local:

   ```shell
   git clone https://github.com/lisandrojm/primera_entrega
   ```

2. Navega al directorio del proyecto:

   ```shell
   cd primera_entrega

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

### Rutas disponibles

La aplicación expone las siguientes rutas:

- `GET /api/products`: Obtiene la lista de productos.
- `GET /api/products/:pid`: Obtiene un producto específico por su ID.
- `POST /api/products`: Agrega un nuevo producto.
- `PUT /api/products/:pid`: Actualiza un producto existente.
- `DELETE /api/products/:pid`: Elimina un producto existente.

- `POST /api/carts`: Crea un nuevo carrito.
- `GET /api/carts/:cid`: Obtiene los productos de un carrito específico.
- `POST /api/carts/:cid/product/:pid`: Agrega un producto al carrito.
- `DELETE /api/carts/:cid/product/:pid`: Elimina un producto del carrito.
- `DELETE /api/carts/:cid`: Elimina un carrito.

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
