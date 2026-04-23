import axios from "axios";
import { handleApiError } from "../utils/apiErrorHandler.js";
import { getCountryName } from "../utils/countryHelper.js";

export const getNationalityData = async (name) => {
	const res = await axios.get(`https://api.nationalize.io?name=${name}`);
	if (!res.data.country || res.data.country.length === 0)
		handleApiError("Nationalize");

	const topCountry = res.data.country[0];
	return {
		country_id: topCountry.country_id,
		country_probability: topCountry.probability,
		country_name: getCountryName(topCountry.country_id),
	};
};
