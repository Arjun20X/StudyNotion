const express = require("express");
const app = express();

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

// middlewares
app.use(express.json());
app.use(cookieParser());



const allowedOrigins = [
  "https://study-notion-git-main-arjuns-projects-c804732d.vercel.app",
  "http://localhost:3000",
  "https://study-notion-blue-mu.vercel.app",
  "https://study-notion-arjuns-projects-c804732d.vercel.app",
  "https://study-notion-95z9bcuc2-arjuns-projects-c804732d.vercel.app",
  "https://study-notion-3oluh4wy1-arjuns-projects-c804732d.vercel.app", 
];
  

const corsOptions = {
  origin: 'https://study-notion-six-amber.vercel.app/',
  allowedHeaders: 'Content-Type,Authorization'
};

app.use(
  cors(corsOptions)
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