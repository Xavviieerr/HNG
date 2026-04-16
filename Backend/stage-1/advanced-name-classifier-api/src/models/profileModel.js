import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},

		name: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},

		gender: String,
		gender_probability: Number,
		sample_size: Number,

		age: Number,
		age_group: String,

		country_id: String,
		country_probability: Number,

		created_at: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: false,
	},
);

export default mongoose.model("Profile", profileSchema);
