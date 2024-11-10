import express from 'express';
import cors from 'cors'; // Importa los paquetes cors-- permisos de acceso
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
import clientesRoutes from './routes/clientes.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import productosRoutes from './routes/productos.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';
import pedidos_detalleRoutes from './routes/pedidos_detalle.routes.js';

dotenv.config(); // Configuración de dotenv

// Definir módulo de ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Corrige el guion bajo

const app = express();
const corsOptions = {
    origin: '*', // La dirección IP/dominio del servidor
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
};


app.use(cors(corsOptions));
app.use(express.json()); // Para que interprete los objetos JSON
app.use(express.urlencoded({ extended: true })); // Se añade para poder receptar formularios
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Ruta estática para las imágenes

// Rutas
app.use('/api', clientesRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', productosRoutes);
app.use('/api', pedidosRoutes);
app.use('/api', pedidos_detalleRoutes);

app.use((req, res, next) => {
    res.status(400).json({
        message: 'Endpoint not found'
    });
});

export default app;
