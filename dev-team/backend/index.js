// backend/index.js
const express = require("express");
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
const cors = require("cors");



const app = express();
const PORT = 3001;


const allowedOrigins = [
    'http://localhost:443', //for serve -s build -l 433 local test
    'http://localhost:3000', //for react dev env
    'http://frontend-service.jwt-app:433'   //hardcoded
];



app.use(cors({
    origin: 'http://frontend-service.jwt-app:433',
    credentials: true // Allow credentials (cookies, headers, etc.)
}));



// Your routes and other middleware

app.use(express.json());

app.use("/api/auth", authRoutes); // All the routes defined in auth.js will be prefixed with /api/auth
app.use("/api/protected", protectedRoutes); // All the routes defined in auth.js will be prefixed with /api/auth

app.get('/health', (req, res) => { //health check
    res.status(200).send('OK');
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

