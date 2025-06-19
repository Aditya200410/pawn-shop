const jwt = require('jsonwebtoken');

const login = (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // For demo purposes, using hardcoded admin credentials
  // In production, you should use a proper database and password hashing
  if (username === "admin" && password === "admin123") {
    const token = jwt.sign(
      { 
        id: 1, 
        username: "admin",
        isAdmin: true 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: 1,
        username: "admin",
        isAdmin: true
      }
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

module.exports = {
  login
}; 