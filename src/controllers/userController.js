import db from '../config/db.js';

// Get all users    
export const getUsers = async (req, res) => {
  try {
    const users = await db.any('SELECT * FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } 
};
// Add a new user   
export const addUser = async (req, res) => {
  try {
    const newUser = req.body;
    const result = await db.one('INSERT INTO users(username, password, contact_no, email) VALUES($1, $2, $3, $4) RETURNING *', [newUser.username, newUser.password, newUser.contact_no, newUser.email]);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//update a user
export const updateUser = async (req, res) => {
  try { 
    const { id } = req.params;
    const updatedUser = req.body;
    const result = await db.one('UPDATE users SET username = $1, password = $2 WHERE id = $3 RETURNING *', [updatedUser.username, updatedUser.password, id]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.none('DELETE FROM users WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
