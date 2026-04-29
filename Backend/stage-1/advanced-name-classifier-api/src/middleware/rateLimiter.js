import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 5, // reduce for testing (so you can hit it faster)

	standardHeaders: true,
	legacyHeaders: false,

	handler: (req, res) => {
		console.log("AUTH RATE LIMIT HIT:", req.ip);

		return res.status(429).json({
			status: "error",
			message: "Too many auth requests, try again later",
		});
	},
});

// API endpoints normal
export const apiLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 3,
	handler: (req, res) => {
		console.log("RATE LIMIT HIT");
		res.status(429).json({
			status: "error",
			message: "Too many requests",
		});
	},
});
