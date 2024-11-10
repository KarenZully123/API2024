import { Router } from 'express';
import { getPedidos, getPedidosxid, postPedidos, putPedidos, patchPedidos, deletePedidos } from '../controladores/pedidosCtrl.js';

const router = Router();

// Armar nuestras rutas
router.get('/pedidos', getPedidos); // Select
router.get('/pedidos/:id', getPedidosxid); // Select por ID
router.post('/pedidos', postPedidos); // Insert
router.put('/pedidos/:id', putPedidos); // Update completo
router.patch('/pedidos/:id', patchPedidos); // Update parcial
router.delete('/pedidos/:id', deletePedidos); // Delete

export default router;
