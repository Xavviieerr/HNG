import express from "express";
import cors from "cors";
import axios from "axios";
import rateLimit from "express-rate-limit";

const app = express();
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 10,
	message: {
		status: "error",
		message: "Too many requests, please try again later.",
	},
});

app.use(limiter);
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get("/", (req, res) => {
	res.send(
		"Hello 🙂 Just a reminder: today is a new chance to smile, breathe, and enjoy the little things around you.",
	);
});

app.get("/api/classify", limiter, async (req, res) => {
	try {
		const { name } = req.query;

		if (!name || name.trim() === "") {
			return res.status(400).json({
				status: "error",
				message: "Missing or empty name parameter",
			});
		}
		if (typeof name !== "string") {
			return res.status(422).json({
				status: "error",
				message: "name is not a string",
			});
		}

		const response = await axios.get(`https://api.genderize.io?name=${name}`);
		const data = response.data;

		if (!data.gender || data.count === 0) {
			return res.status(404).json({
				status: "error",
				message: "No prediction available for the provided name",
			});
		}

		const probability = data.probability || 0;
		const sample_size = data.count || 0;

		const is_confident = probability >= 0.7 && sample_size >= 100;

		const result = {
			name: data.name,
			gender: data.gender,
			probability,
			sample_size,
			is_confident,
			processed_at: new Date().toISOString(),
		};

		return res.status(200).json({
			status: "success",
			data: result,
		});
	} catch (error) {
		return res.status(502).json({
			status: "error",
			message: "Upstream or server failure",
		});
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
