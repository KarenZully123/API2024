import { config } from 'dotenv';
config(); // Cargar las variables del archivo .env


export const BD_HOST = process.env.BD_HOST || 'bo8rrcnnwffo2xprueqm-mysql.services.clever-cloud.com';
export const BD_DATABASE = process.env.BD_DATABASE || 'bo8rrcnnwffo2xprueqm';
export const DB_USER = process.env.DB_USER || 'ud8xnfg0vlugvcxh';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'KkrYQ86H7DWFEkdriOCg  ';
export const DB_PORT = process.env.DB_PORT || 3306;
export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET||'karen123';
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'API2024_2';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '433167633734676';
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || 'vN4qTcUiMZA3c_4bJ1f5smyAdFU';