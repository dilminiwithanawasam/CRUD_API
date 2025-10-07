import express from 'express';
import { getProducts, addProduct, updateProduct,deleteProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);      // Get all products
router.post('/', addProduct);      // Add a new product
router.put('/:id', updateProduct); // Update a product
router.delete('/:id', deleteProduct); // Delete a product

router.get('/',(req,res)=>{
  res.send("API is running....");
});

export default router;
