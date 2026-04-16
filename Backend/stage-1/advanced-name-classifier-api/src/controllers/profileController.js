import { getGenderData } from "../services/genderService.js";
import { getAgeData } from "../services/ageService.js";
import { getNationalityData } from "../services/nationalityService.js";
import { v7 as uuidv7 } from "uuid";
import Profile from "../models/profileModel.js";

export const createProfile = async (req, res, next) => {
	try {
		const { name } = req.body;

		if (!name || name.trim() === "") {
			const err = new Error("Missing or empty name");
			err.statusCode = 400;
			throw err;
		}

		if (typeof name !== "string") {
			const err = new Error("Invalid type");
			err.statusCode = 422;
			throw err;
		}

		//checks if profile already exists
		const existingProfile = await Profile.findOne({ name: name.toLowerCase() });
		if (existingProfile) {
			const responseData = {
				...existingProfile.toObject(),
				id: existingProfile._id,
			};
			return res.status(200).json({
				status: "success",
				message: "Profile already exists",
				data: responseData,
			});
		}

		const [genderData, ageData, nationalityData] = await Promise.all([
			getGenderData(name),
			getAgeData(name),
			getNationalityData(name),
		]);

		const profilePayload = {
			_id: uuidv7(),
			name: name.toLowerCase(),
			...genderData,
			...ageData,
			...nationalityData,
			created_at: new Date().toISOString(),
		};

		//store in DB
		const newProfile = await Profile.create(profilePayload);

		const responseData = { ...newProfile.toObject(), id: newProfile._id };
		res.status(201).json({ status: "success", data: responseData });
	} catch (error) {
		next(error);
	}
};

export const getAllProfiles = async (req, res) => {
	try {
		const { gender, country_id, age_group } = req.query;
		if (gender !== "string" && country_id) {
		}

		const filter = {};
		if (gender) {
			filter.gender = gender.toLowerCase();
		}
		if (country_id) {
			filter.country_id = country_id.toUpperCase();
		}

		if (age_group) {
			filter.age_group = age_group.toLowerCase();
		}
		console.log(filter);

		const profiles = await Profile.find(filter);
		if (!profiles || profiles.length === 0) {
			return res.status(404).json({
				status: "error",
				message: "No profiles found matching the criteria",
			});
		}
		const modifiedProfiles = profiles.map(
			({ _id, name, gender, age, age_group, country_id }) => ({
				_id,
				name,
				gender,
				age,
				age_group,
				country_id,
			}),
		);

		res.status(200).json({
			status: "success",
			results: profiles.length,
			data: modifiedProfiles,
		});
	} catch (error) {
		next(error);
	}
};

export const getProfileById = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({
				status: "error",
				message: "Profile ID is required",
			});
		}

		const profile = await Profile.findById(id);
		if (!profile) {
			return res.status(404).json({
				status: "error",
				message: "Profile not found",
			});
		}

		const responseData = { ...profile.toObject(), id: profile._id };
		res.status(200).json({ status: "success", data: responseData });
	} catch (error) {
		next(error);
	}
};

export const deleteProfile = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({
				status: "error",
				message: "Profile ID is required",
			});
		}

		const deletedProfile = await Profile.findByIdAndDelete(id);
		if (!deletedProfile) {
			return res.status(404).json({
				status: "error",
				message: "Profile not found",
			});
		}

		res.status(204).json({
			status: "success",
			message: "Profile deleted successfully",
		});
	} catch (error) {
		next(error);
	}
};
