import mongoose from "mongoose";
import { v7 as uuidv7 } from "uuid";

const profileSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			default: () => uuidv7(),
		},

		name: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true,
		},

		gender: {
			type: String,
			enum: ["male", "female"],
		},

		gender_probability: {
			type: Number,
		},

		age: {
			type: Number,
		},

		age_group: {
			type: String,
			enum: ["child", "teenager", "adult", "senior"],
		},

		country_id: {
			type: String,
			match: /^[A-Z]{2}$/,
		},

		country_name: {
			type: String,
		},

		country_probability: {
			type: Number,
		},

		created_at: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: false,
	},
);

export default mongoose.model("Profile", profileSchema);
