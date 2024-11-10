import { conmysql } from '../db.js';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: 'dvyxpwvnt', // Reemplaza con tu Cloud Name
  api_key: '433167633734676', // Reemplaza con tu API Key
  api_secret: 'vN4qTcUiMZA3c_4bJ1f5smyAdFU' // Reemplaza con tu API Secret
});

export const getProductos = 
    async (req,res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM productos')
        res.json(result)   
     } catch (error) {
       return res.status(500).json({message: "Error al consultar productos"})
     }
    }
    export const getProductosxid = 
    async(req, res) => {
      try {
        const [result] = await conmysql.query('select * from productos where prod_id=?',[req.params.id])
        if(result.length<=0)return res.status(404).json({
          prod_id:0,
          message:"Producto no encontrado"
        })
        res.json(result[0])
      } catch (error) {
        return res.status(500).json({message:'error del lado del servidor'})
      }
    }
   // Función para crear un nuevo producto
export const postProductos = async (req, res) => {
  try {
    // Verificar si los datos del producto están presentes
    const {  prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo }= req.body;
    console.log('Datos recibidos del cuerpo:', req.body);

    // Inicializar variable para la imagen
    let prod_imagen = null;

    // Verificar si se envió una imagen
    if (req.file) {
      console.log('Imagen recibida:', req.file);
      // Subir la imagen a Cloudinary
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "uploads", // Puedes agregar un folder en Cloudinary si lo deseas
        public_id: `${Date.now()}-${req.file.originalname}` // Usamos el timestamp para garantizar un nombre único
      });
      console.log('Resultado de la carga en Cloudinary:', uploadResult);
      // Obtener la URL segura de la imagen subida
      prod_imagen = uploadResult.secure_url;
    } else {
      console.log('No se recibió ninguna imagen.');
    }

    // Insertar el producto en la base de datos
    const [rows] = await conmysql.query(
      'INSERT INTO productos (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) VALUES (?, ?, ?, ?, ?, ?)',
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen]
    );
    console.log('Producto insertado con ID:', rows.insertId);

    // Responder con el ID del producto insertado
    res.status(201).json({
      mensaje: 'Producto guardado correctamente.',
      prod_id: rows.insertId,
      prod_imagen: prod_imagen // Incluye la URL de la imagen (si existe)
    });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    return res.status(500).json({ mensaje: 'Error del lado del servidor', error: error.message });
  }
};
  // Ruta PUT para actualizar un producto
export const putProductos = async (req, res) => {
  try {
    // Obtener el ID del producto y los nuevos datos
    const {id} = req.params;
    const {prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen } = req.body;

    let newProd_imagen = prod_imagen; // Si ya se pasó una URL de imagen, la almacenamos

    // Verificar si se subió una nueva imagen
    if (req.file) {
      // Subir la nueva imagen a Cloudinary
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'uploads', // Usar un folder en Cloudinary si lo deseas
        public_id: `${Date.now()}-${req.file.originalname}` // Usar un nombre único
      });

      // Obtener la URL segura de la imagen subida
      newProd_imagen = uploadResult.secure_url;
    }

    // Actualizar el producto en la base de datos
    const [result] = await conmysql.query(
      `UPDATE productos SET prod_codigo = ?, prod_nombre = ?, prod_stock = ?, prod_precio = ?, prod_activo = ?, prod_imagen = ? WHERE prod_id = ?`,
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, newProd_imagen, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Obtener el producto actualizado
    const [rows] = await conmysql.query('SELECT * FROM productos WHERE prod_id = ?', [id]);

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error del lado del servidor' });
  }
};
  
  
  export const patchProductos = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Acceder a los datos del cuerpo y archivo
      const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;
      const prod_imagen = req.file ? `uploads/${req.file.filename}` : req.body.prod_imagen; // Si hay nueva imagen, usarla
  
      console.log("Datos recibidos: ", req.body);
      console.log("Imagen recibida: ", req.file);
  
      // Realizar la consulta para actualizar el producto
      const [result] = await conmysql.query(
        'UPDATE productos SET ' +
        'prod_codigo = IFNULL(?, prod_codigo), ' +
        'prod_nombre = IFNULL(?, prod_nombre), ' +
        'prod_stock = IFNULL(?, prod_stock), ' +
        'prod_precio = IFNULL(?, prod_precio), ' +
        'prod_activo = IFNULL(?, prod_activo), ' +
        'prod_imagen = IFNULL(?, prod_imagen) ' +
        'WHERE prod_id = ?',
        [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
      );
  
      if (result.affectedRows <= 0) return res.status(404).json({ message: "Producto no encontrado" });
  
      // Consultar el producto actualizado
      const [rows] = await conmysql.query('SELECT * FROM productos WHERE prod_id = ?', [id]);
      res.json(rows[0]);
  
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: 'Error del lado del servidor', error });
    }
  };
  
    
     export const deleteProductos=
     async(req, res)=> {
         try {
             const [rows]=await conmysql.query('delete from productos where prod_id=?', [req.params.id])
             if(rows.affectedRows<=0) return res.status(404).json({
                 id:0,
                 message:"No pudo eliminar al productos"
             })
             res.sendStatus(202)
         } catch (error) {
             return res.status(500).json({message:error})
         }
     }
