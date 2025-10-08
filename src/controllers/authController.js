import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// User Registration
export const signup = async (req, res) => {
  try {
    const { username, password, role_name, contact_no, email } = req.body;

    // Check if user already exists
    const existingUser = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Get role_id from user_role table - FIXED: using role_id column
    const role = await db.oneOrNone('SELECT role_id FROM user_role WHERE role_name = $1', [role_name]);
    if (!role) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    // Create user - FIXED: using role.role_id and added contact_no, email
    const newUser = await db.one(
      'INSERT INTO users (username, password, role_id, contact_no, email) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, role_id',
      [username, hashedPassword, role.role_id, contact_no, email]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        role: role_name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user - FIXED: corrected JOIN condition
    const user = await db.oneOrNone(`
      SELECT u.*, r.role_name 
      FROM users u 
      JOIN user_role r ON u.role_id = r.role_id 
      WHERE u.username = $1
    `, [username]);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role_name
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role_name,
        contact_no: user.contact_no,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const userDetails = await db.oneOrNone(`
      SELECT u.*, r.role_name 
      FROM users u 
      JOIN user_role r ON u.role_id = r.role_id 
      WHERE u.id = $1
    `, [req.user.id]);

    res.json({
      user: {
        id: userDetails.id,
        username: userDetails.username,
        role: userDetails.role_name,
        contact_no: userDetails.contact_no,
        email: userDetails.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};