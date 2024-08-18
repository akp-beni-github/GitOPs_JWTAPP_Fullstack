// backend/models/user.js
require("dotenv").config();
const { Sequelize, DataTypes } = require('sequelize');
// Initialize Sequelize
const sequelize = new Sequelize( process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: console.log // Enable logging for development
});
  
  // Sync the models with the database
  sequelize.sync()
    .then(() => console.log('Database schema synchronized.'))
    .catch(err => console.error('Error synchronizing database schema:', err));

// Define the RefreshToken model
const RefreshToken = sequelize.define('RefreshToken', {
    token: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'refresh_tokens',
    timestamps: true // Disable automatic createdAt and updatedAt fields
});

// Export the model and sequelize instance
module.exports = RefreshToken;

