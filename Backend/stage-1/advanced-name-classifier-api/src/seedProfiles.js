import mongoose from "mongoose";
import fs from "fs";
import Profile from "./models/profileModel.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const dataPath = new URL("./seed_profiles.json", import.meta.url);

const seedDatabase = async () => {
	try {
		const rawData = fs.readFileSync(dataPath, "utf-8");
		const { profiles } = JSON.parse(rawData);

		const operations = profiles.map((profile) => ({
			updateOne: {
				filter: { name: profile.name },
				update: {
					$set: profile,
					$setOnInsert: {
						created_at: new Date(),
					},
				},
				upsert: true,
			},
		}));

		const result = await Profile.bulkWrite(operations);

		console.log("Seeding complete");
		process.exit();
	} catch (error) {
		console.error("Seeding error:", error);
		process.exit(1);
	}
};

const deleteAllProfiles = async () => {
	try {
		const result = await Profile.deleteMany({});

		console.log(`Deleted ${result.deletedCount} profiles`);
		process.exit();
	} catch (error) {
		console.error("Delete error:", error);
		process.exit(1);
	}
};

const run = async () => {
	try {
		await connectDB();
		if (process.argv[2] === "-d") {
			await deleteAllProfiles();
		} else {
			await seedDatabase();
		}
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

run();
