import axios from "axios";
import { handleApiError } from "../utils/apiErrorHandler.js";

export const getGenderData = async (name) => {
	const res = await axios.get(`https://api.genderize.io?name=${name}`);
	if (!res.data.gender || res.data.count === 0) handleApiError("Genderize");

	return {
		gender: res.data.gender,
		gender_probability: res.data.probability,
	};
};
