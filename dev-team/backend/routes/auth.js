const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const cookieParser = require('cookie-parser');

const User = require("../models/user");

router.use(cookieParser());
require("dotenv").config();


const { 
    generateAccessToken, 
    storeRefreshToken, 
    removeRefreshToken, 
    isRefreshTokenValid 
  } = require('../utils/jwt'); // Adjust the path to where auth.js is located
  
const ONE_MINUTE = 60000;
const FIFTEEN_MINUTES = ONE_MINUTE * 15;


//////////
//(apis)//
//////////
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Retrieve user from the database
        const user = await User.findOne({ where: { username } });
        if (!user) {
            console.log('User not found');
            return res.status(403).send('User not found');
        }

        // Check if password is valid
        const validPassword = await argon2.verify(user.password, password);
        console.log('Password valid:', validPassword);

        if (!validPassword) {
            console.log('Password incorrect');
            return res.status(403).send('Password incorrect');
        }

        // Generate access token
        const accessToken = generateAccessToken({ name: username });

        // Generate refresh token
        const refreshToken = jwt.sign({ name: username }, process.env.REFRESH_TOKEN_SECRET);

        // Store the refresh token in the database
        await storeRefreshToken(refreshToken);

        // Send tokens in cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            //secure: process.env.NODE_ENV === 'dev',
            sameSite: 'None',
            maxAge: FIFTEEN_MINUTES,
        });
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            //secure: process.env.NODE_ENV === 'dev',
            sameSite: 'None',
        });
        
        res.send('Cookies are set');

    } catch (error) {
        console.error('Error processing login:', error);
        res.status(500).send('Internal server error');
    }
});

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).send('Username already exists');
        }

        // Hash the password
        const hashedPassword = await argon2.hash(password);

        // Insert the new user to the database
        await User.create({ username, password: hashedPassword });

        res.status(201).send('User created successfully');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal server error');
    }
});

router.get('/token', async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        console.log('refreshToken: ', token);
        if (!token) {
            console.log('send 401');
            return res.sendStatus(401); 
        }

        // Check if the refresh token exists in the database
        await isRefreshTokenValid(token);

        console.log('valid refreshtoken')
        console.log('generating access token')

        // Verify the refresh token
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.error('Error verifying refresh token:', err);
                return res.sendStatus(403);
            }
            const accessToken = generateAccessToken({ name: user.name });

            console.log('newaccessToken', accessToken); 

            // Send the new access token in cookies
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                //secure: process.env.NODE_ENV === 'dev',
                sameSite: 'None',
                maxAge: FIFTEEN_MINUTES,
            });
            res.status(200).send('Cookies are set');
        });
    } catch (error) {
        console.error('Error processing token:', error);
        res.status(500).send('Internal server error');
    }
});

router.delete('/logout', async (req, res) => {
    try {
        const token = req.cookies.refreshToken; //using cookie parser
        console.log('Cookies:', token);

        // Check if token is undefined or empty
        if (!token) {
            console.error('No refreshToken found in cookies');
            return res.status(400).send('No refreshToken found');
        }

        // Attempt to remove the refresh token from the database
        await removeRefreshToken(token);

        //res.status(204).send('database token destroyed')
        // Attempt to clear browser cookies
        await res.clearCookie('refreshToken');
        await res.clearCookie('accessToken');

        res.status(204).send('Browser cookies cleared');
    } catch (error) {
        console.error('Error removing refresh token:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;