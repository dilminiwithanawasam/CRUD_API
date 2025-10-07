import db from '../config/db.js';

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await db.any('SELECT * FROM product');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};  

// Add a new product
export const addProduct = async (req, res) => {
  try {
    const newProduct = req.body;
    const result = await db.one('INSERT INTO product(name, price,productid) VALUES($1, $2,$3) RETURNING *', [newProduct.name, newProduct.price, newProduct.productid]);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = req.body;
    const result = await db.one('UPDATE product SET name = $1, price = $2 WHERE productid = $3 RETURNING *', [updatedProduct.name, updatedProduct.price, id]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await db.none('DELETE FROM product WHERE productid = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
