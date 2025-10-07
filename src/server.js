import express from 'express';
import dotenv from 'dotenv';
import db from './config/db.js';
dotenv.config();
import productRoutes from './routes/productRoutes.js';

import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/product', productRoutes);

app.get('/', (req, res) => {
  res.send('Server is running!');
});



app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
