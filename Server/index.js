// Force Google DNS to ensure mongodb+srv:// SRV records resolve correctly
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const app = express();
const rateLimit = require('express-rate-limit');


const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactRoutes = require("./routes/ContactUs");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 4000;

// database connect
database.connect();


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Time window: 15 minutes
  limit: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
  statusCode: 429, // Standard HTTP status for rate limiting
  standardHeaders: 'draft-7', // Return standard rate limit info headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
});

// middlewares
app.use(apiLimiter);
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "https://study-notion-six-amber.vercel.app/",
  "http://34.207.205.76/"
];
  

// const corsOptions = {
//   origin: allowedOrigins,
//   allowedHeaders: 'Content-Type,Authorization'
// };

app.use(
  cors()
);
  

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
);

// cloudinary connection
cloudinaryConnect();

// routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/contact",contactRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// default route
app.get("/", (req,res) => {
    return res.status(200).json({
        success:true,
        message:'Your server is up and running....',
    });
})

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
})