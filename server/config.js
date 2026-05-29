// config.js
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const config = {
  MONGO_URI: process.env.MONGO_URI,
  TOKEN: process.env.JWT_SERCRET_KEY,
  BACKEND_URL: process.env.BACKEND_URL,
  FRONTEND: process.env.FRONTEND_URL,
  PORT: process.env.PORT || 8080,
  CLOUDINARY: process.env.CLOUDINARY,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
};

export default config;