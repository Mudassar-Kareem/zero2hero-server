require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorMiddleware = require("./middleware/error");
const userRouter = require('./routes/userRoutes');
const reportRouter = require('./routes/reportRoutes');
const notificationRouter = require('./routes/notificarion');
const transactionRouter = require('./routes/transaction');


const app = express();

// CORS Middleware - Place it before routes
app.use(cors({
    origin: "https://zero2hero-client.vercel.app", //"http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}));


// Parse incoming JSON data
// app.use(express.json({ limit: '100mb' }));
// app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Testing API
app.get('/', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'API is working'
    });
});

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/report", reportRouter);
app.use("/api/v1", notificationRouter);
app.use("/api/v1", transactionRouter);

// Unknown route handler
app.all('*', (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});

// Error middleware
app.use(errorMiddleware);

module.exports = { app };
