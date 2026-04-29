import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		github_id: {
			type: String,
			required: true,
			unique: true,
		},
		username: String,
		email: String,
		avatar_url: String,

		role: {
			type: String,
			enum: ["admin", "analyst"],
			default: "analyst",
		},

		is_active: {
			type: Boolean,
			default: true,
		},
		refresh_token: {
			type: String,
			default: null,
		},

		last_login_at: Date,
	},
	{ timestamps: true },
);

export default mongoose.model("User", userSchema);
