const jwt = require('jsonwebtoken');
const RefreshToken = require("../models/refreshToken"); 

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());



require("dotenv").config();

///////////////
//(functions)//
///////////////

// Function to generate an access token
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

// Function to store refresh token in the database
async function storeRefreshToken(token) {
    try {
        await RefreshToken.create({ token });
    } catch (error) {
        console.error('Error storing refresh token:', error);
    }
}

// Function to remove a refresh token from the database
async function removeRefreshToken(token) {
    try {
        await RefreshToken.destroy({ where: { token } });
    } catch (error) {
        console.error('Error removing refresh token:', error);
        throw error; 
    }
}

async function isRefreshTokenValid(token) {
    try {
        const count = await RefreshToken.count({ where: { token } });
        if (count === 0) {
            throw new Error('Refresh token not found');
        }
    } catch (error) {
        console.error('Error checking refresh token:', error);
        throw error;
    }
}

//middleware to protect api with accessToken
const authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken; //using cookie parser
    console.log('access token recieved:', token );

    if (!token) {
        return res.sendStatus(401); // No token, unauthorized
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error('Error verifying access token:', err);
            return res.sendStatus(403); // Invalid token
        }
        
        // Attach user info to request object
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = { generateAccessToken, storeRefreshToken, removeRefreshToken, isRefreshTokenValid, authenticateToken };
