import express from "express";
import cors from "cors";
import axios from "axios";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import profileRoutes from "./routes/profileRoute.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 10,
	message: {
		status: "error",
		message: "Too many requests, please try again later.",
	},
});
const PORT = process.env.PORT || 3000;
connectDB();
app.use(limiter);
app.use(cors());

app.use(express.json());

//Routes
app.get("/", (req, res) => {
	res.send(
		"Hello 🙂 Just a reminder: today is a new chance to smile, breathe, and enjoy the little things around you.",
	);
});
app.use("/api/profiles", limiter, profileRoutes);

// Global error handler
app.use((error, req, res, next) => {
	const statusCode = error.statusCode || 500;
	const message = error.message || "Internal Server Error";
	res.status(statusCode).json({
		status: "error",
		message: message,
	});
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
