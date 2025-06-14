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
  

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      // Allow all *.vercel.app subdomains
      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
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