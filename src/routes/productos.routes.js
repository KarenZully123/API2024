import { Router } from 'express'
import multer from 'multer'
import {getProductos,getProductosxid,postProductos,putProductos,patchProductos,deleteProductos} from '../controladores/productosCtrl.js'

// Configuración de Multer para almacenar imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  
  const upload = multer({ storage });
  
  // Definición de las rutas
  const router = Router();
  
  // Rutas para productos
  router.get('/productos', getProductos); // Obtener todos los productos
  router.get('/productos/:id', getProductosxid); // Obtener un producto por ID
  router.post('/productos', upload.single('image'), postProductos); // Crear un nuevo producto
  router.put('/productos/:id', upload.single('image'), putProductos); // Actualizar un producto
  router.patch('/productos/:id', patchProductos); // Actualizar parcialmente un producto
  router.delete('/productos/:id', deleteProductos); // Eliminar un producto
  
  export default router;