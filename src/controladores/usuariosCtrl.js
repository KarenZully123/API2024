import { conmysql } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const getUsuarios = 
    async (req, res) => {
      try {
        const [result] = await conmysql.query('SELECT * FROM usuarios')
        res.json(result)
      } catch (error) {
        console.error(error); // Imprime cualquier error
        return res.status(500).json({ message: "Error al consultar usuarios" });
      }
    }

    export const getUsuariosxid = 
    async(req, res) => {
      try {
        const [result] = await conmysql.query('SELECT * FROM usuarios WHERE usr_id = ?', [req.params.id])

        if(result.length<=0)return res.status(404).json({
          
          usr_id:0,
            message: "Usuario no encontrado"
            
          })
          res.json(result[0])
        } catch (error) {

          return res.status(500).json({message:'error del lado del servidor'})
        }
      }
      
      export const postUsuarios = async (req, res) => {
        console.log('Headers:', req.headers); // Verifica el encabezado
        console.log('Cuerpo de la solicitud:', req.body); // Depuración del cuerpo
        
        try {
            const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo } = req.body;
            
            // Validación de campos
            if (!usr_usuario || !usr_clave || !usr_nombre || !usr_telefono || !usr_correo || usr_activo === undefined) {
                return res.status(400).json({ message: 'Todos los campos son requeridos' });
            }
    
            // Encriptar la contraseña
            const saltRounds = 10; // Define el número de rondas de salt
            const hashedPassword = await bcrypt.hash(usr_clave, saltRounds);
    
            // Realizar la inserción en la base de datos con la contraseña encriptada
            const [result] = await conmysql.query(
                `INSERT INTO usuarios (usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo) VALUES (?, ?, ?, ?, ?, ?)`,
                [usr_usuario, hashedPassword, usr_nombre, usr_telefono, usr_correo, usr_activo]
            );
            const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Responder con éxito
            res.status(201).json({ message: 'Usuario creado correctamente', usuarioId: result.insertId, token });
          } catch (error) {
            console.error('Error al crear usuario:', error);
            return res.status(500).json({ message: 'Error al crear usuario', error: error.message });
        }
    };
    
    export const putUsuarios = 
    async (req, res) => {
      try {
        const { id } = req.params;
        const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo } = req.body;

        // Realizar la actualización del usuario
        const [result] = await conmysql.query(
          'UPDATE usuarios SET usr_usuario=?, usr_clave=?, usr_nombre=?, usr_telefono=?, usr_correo=?, usr_activo=? WHERE usr_id=?',
          [usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo, id]
        );

        if (result.affectedRows <= 0) {
          return res.status(404).json({
            message: "Usuario no encontrado"
          });
        }

        // Obtener y devolver el usuario actualizado
        const [rows] = await conmysql.query('SELECT * FROM usuarios WHERE usr_id=?', [id])
        res.json(rows[0]);

      } catch (error) {
        return res.status(500).json({ message: 'Error del lado del servidor' })
      }
    }

     // Nueva función para iniciar sesión y obtener un token
     export const loginUsuarios = async (req, res) => {
      const { usr_usuario, usr_clave } = req.body;
  
      try {
          const [user] = await conmysql.query('SELECT * FROM usuarios WHERE usr_usuario = ?', [usr_usuario]);
          
          if (!user.length) {
              return res.status(404).json({ message: 'Usuario no encontrado' });
          }
  
          const isPasswordValid = await bcrypt.compare(usr_clave, user[0].usr_clave);
          if (!isPasswordValid) {
              return res.status(401).json({ message: 'Contraseña inválida' });
          }
  
          const token = jwt.sign({ id: user[0].usr_id }, process.env.JWT_SECRET, {
              expiresIn: '1h'
          });
  
          res.status(200).json({ auth: true, token });
      } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Error del lado del servidor' });
      }
  };