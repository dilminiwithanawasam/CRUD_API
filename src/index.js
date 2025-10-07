import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { Pool } from 'pg';  


dotenv.config();
const app = express();
const port = process.env.PORT || 3000;  

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {  
    res.send('Welcome to the Express PostgreSQL CRUD API');
});
app.get('/health', (req, res) => {  
    res.status(200).send('OK');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
