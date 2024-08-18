const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();

//const jwt = require('jsonwebtoken');

const {authenticateToken} = require('../utils/jwt'); // Adjust the path to where auth.js is located
  
router.use(cookieParser()); // Ensure this is before any routes or middleware

// Protected route
router.get('/test', authenticateToken, (req, res) => {
    res.status(200).send('This is a protected route. User: ' + req.user.name);
});


module.exports = router;