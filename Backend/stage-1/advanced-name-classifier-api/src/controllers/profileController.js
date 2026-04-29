import { getGenderData } from "../services/genderService.js";
import { getAgeData } from "../services/ageService.js";
import { getNationalityData } from "../services/nationalityService.js";
import { v7 as uuidv7 } from "uuid";
import Profile from "../models/profileModel.js";
import { getCountryId } from "../utils/countryHelper.js";

const formatProfile = (doc) => {
	const obj = doc.toObject(); //convert mongodb doc to object

	return {
		id: obj._id,
		name: obj.name,
		gender: obj.gender,
		gender_probability: obj.gender_probability,
		age: obj.age,
		age_group: obj.age_group,
		country_id: obj.country_id,
		country_name: obj.country_name,
		country_probability: obj.country_probability,
		created_at: obj.created_at,
	};
};

export const createProfile = async (req, res, next) => {
	try {
		const { name } = req.body;
		if (!name || typeof name !== "string" || name.trim() === "") {
			const err = new Error(
				typeof name !== "string"
					? "Invalid parameter type"
					: "Missing or empty name",
			);
			err.statusCode = typeof name !== "string" ? 422 : 400;
			throw err;
		}

		const existingProfile = await Profile.findOne({ name: name.toLowerCase() });
		if (existingProfile) {
			return res.status(200).json({
				status: "success",
				message: "Profile already exists",
				data: formatProfile(existingProfile),
			});
		}

		const [gender, age, nationality] = await Promise.all([
			getGenderData(name),
			getAgeData(name),
			getNationalityData(name),
		]);

		const newProfile = await Profile.create({
			name: name.toLowerCase(),
			...gender,
			...age,
			...nationality,
		});

		res
			.status(201)
			.json({ status: "success", data: formatProfile(newProfile) });
	} catch (error) {
		next(error);
	}
};

export const getAllProfiles = async (req, res, next) => {
	try {
		let {
			gender,
			age_group,
			country_id,
			min_age,
			max_age,
			min_gender_probability,
			min_country_probability,
			sort_by = "created_at",
			order = "desc",
			page = 1,
			limit = 10,
		} = req.query;

		const filter = {};
		if (gender) filter.gender = gender.toLowerCase();
		if (age_group) filter.age_group = age_group.toLowerCase();
		if (country_id) filter.country_id = country_id.toUpperCase();

		// Range Filters
		if (min_age || max_age)
			filter.age = {
				...(min_age && { $gte: Number(min_age) }),
				...(max_age && { $lte: Number(max_age) }),
			};
		if (min_gender_probability)
			filter.gender_probability = { $gte: Number(min_gender_probability) };
		if (min_country_probability)
			filter.country_probability = { $gte: Number(min_country_probability) };

		// Pagination & Sorting
		const skip = (Math.max(1, page) - 1) * Math.min(50, limit);
		const sortOrder = order === "desc" ? -1 : 1;

		const [profiles, total] = await Promise.all([
			Profile.find(filter)
				.sort({ [sort_by]: sortOrder })
				.skip(skip)
				.limit(Number(limit)),
			Profile.countDocuments(filter),
		]);
		const totalPages = Math.ceil(total / limit);
		// res.status(200).json({
		// 	status: "success",
		// 	page: Number(page),
		// 	limit: Number(limit),
		// 	total,
		// 	data: profiles.map(formatProfile),
		// });
		res.status(200).json({
			status: "success",
			page: Number(page),
			limit: Number(limit),
			total,
			total_pages: totalPages,
			links: {
				self: `/api/profiles?page=${page}&limit=${limit}`,
				next:
					page < totalPages
						? `/api/profiles?page=${Number(page) + 1}&limit=${limit}`
						: null,
				prev:
					page > 1
						? `/api/profiles?page=${Number(page) - 1}&limit=${limit}`
						: null,
			},
			data: profiles.map(formatProfile),
		});
	} catch (error) {
		next(error);
	}
};

export const searchProfiles = async (req, res, next) => {
	try {
		const { q, page = 1, limit = 10 } = req.query;
		console.log(q);
		if (!q)
			return res
				.status(400)
				.json({ status: "error", message: "Search query is required" });

		const filter = {};
		const query = q.toLowerCase();

		// Rule-based Parsing
		if (query.includes("male") && !query.includes("female"))
			filter.gender = "male";
		if (query.includes("female")) filter.gender = "female";

		if (query.includes("young")) {
			filter.age = { $gte: 16, $lte: 24 };
		}

		if (query.includes("teenager")) filter.age_group = "teenager";
		if (query.includes("adult")) filter.age_group = "adult";
		if (query.includes("child")) filter.age_group = "child";
		if (query.includes("senior")) filter.age_group = "senior";

		// "above X" logic
		const aboveMatch = query.match(/above\s+(\d+)/);
		if (aboveMatch) {
			filter.age = { ...filter.age, $gt: parseInt(aboveMatch[1]) };
		}

		//match country id
		const words = q.toLowerCase().split(" ");
		for (const word of words) {
			const code = getCountryId(word);
			if (code) {
				filter.country_id = code;
				break;
			}
		}

		// If no filters were matched at all
		if (Object.keys(filter).length === 0) {
			return res
				.status(400)
				.json({ status: "error", message: "Unable to interpret query" });
		}

		const skip = (page - 1) * limit;
		const [profiles, total] = await Promise.all([
			Profile.find(filter).skip(skip).limit(Number(limit)),
			Profile.countDocuments(filter),
		]);

		res.status(200).json({
			status: "success",
			page: Number(page),
			limit: Number(limit),
			total,
			data: profiles.map(formatProfile),
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
		res.status(200).json({
			status: "success",
			data: formatProfile(profile),
		});
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

export const exportProfiles = async (req, res, next) => {
	try {
		const filter = {};

		const profiles = await Profile.find(filter);

		const header =
			"id,name,gender,gender_probability,age,age_group,country_id,country_name,country_probability,created_at";

		const rows = profiles.map((p) => {
			const f = formatProfile(p);
			return [
				f.id,
				f.name,
				f.gender,
				f.gender_probability,
				f.age,
				f.age_group,
				f.country_id,
				f.country_name,
				f.country_probability,
				f.created_at,
			].join(",");
		});

		const csv = [header, ...rows].join("\n");

		res.setHeader("Content-Type", "text/csv");
		res.setHeader(
			"Content-Disposition",
			`attachment; filename="profiles_${Date.now()}.csv"`,
		);

		res.status(200).send(csv);
	} catch (err) {
		next(err);
	}
};
