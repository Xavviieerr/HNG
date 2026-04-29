import express from "express";
import cors from "cors";
import axios from "axios";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import "dotenv/config";
import profileRoutes from "./routes/profileRoute.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import session from "express-session";
import { logger } from "./middleware/logger.js";
import { authLimiter, apiLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
console.log("PORT:", process.env.PORT);
connectDB();
app.set("trust proxy", 1);
app.use(cors());

app.use(express.json());
//session
app.use(
	session({
		secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: true,
			httpOnly: true,
		},
	}),
);
app.use(logger);

app.use("/auth", authLimiter);
app.use("/api", apiLimiter);

//Routes
app.get("/", (req, res) => {
	res.send(
		"Hello 🙂 Just a reminder: today is a new chance to smile, breathe, and enjoy the little things around you.",
	);
});
app.use("/auth", authRoutes);
app.use("/api/profiles", profileRoutes);

// Global error handler
app.use((error, req, res, next) => {
	const statusCode = error.statusCode || 500;
	const message = error.message || "Internal Server Error";
	res.status(statusCode).json({
		status: "error",
		message: message,
	});
});

//coming up
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
