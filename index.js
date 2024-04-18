const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if session contains an access token
    if (!req.session.token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(req.session.token, 'secret_key');
        // If token is valid, set user information in request object
        req.user = decoded;
        next(); // Proceed to next middleware or route handler
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
})

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
