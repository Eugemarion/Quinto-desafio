const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const expressHandlebars = require('express-handlebars');
const productsRouter = require('./api/productsRouter');
const cartsRouter = require('./api/cartsRouter');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);  // Inicializa el servidor de Socket.io
const PORT = 8080;

// Configuración de Handlebars
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Middleware para manejar archivos estáticos
app.use(express.static('public'));

// Middleware para manejar JSON
app.use(express.json());

// Rutas para productos y carritos
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Rutas para vistas
app.get('/', (req, res) => {
    // Renderiza la vista home.handlebars con la lista de productos
    res.render('home', { products: productManager.getProducts() });
});

app.get('/realtimeproducts', (req, res) => {
    // Renderiza la vista realtimeproducts.handlebars con la lista de productos
    res.render('realtimeproducts', { products: productManager.getProducts() });
});

// Conexión de Socket.io
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Evento para enviar la lista de productos a través de websockets
    socket.emit('products', productManager.getProducts());
});

// Comparte el objeto io con otros archivos (por ejemplo, productsRouter.js)
app.set('io', io);

// Inicia el servidor
server.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

// Exporta el objeto io para que pueda ser utilizado en otros archivos
module.exports = { app, io };
