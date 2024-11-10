import { Router } from 'express'
import { getUsuarios, getUsuariosxid, postUsuarios, putUsuarios,loginUsuarios } from '../controladores/usuariosCtrl.js';
import { verifyToken } from '../middleware/auth.middleware.js'

const router = Router()
// armar nuestras rutas
router.get('/usuarios', verifyToken, getUsuarios)// select
router.get('/usuarios/:id', verifyToken, getUsuariosxid)//select x id 
router.post('/usuarios', postUsuarios); // Insert
router.put('/usuarios/:id', verifyToken, putUsuarios)//update
router.post('/login', loginUsuarios); // login


export default router