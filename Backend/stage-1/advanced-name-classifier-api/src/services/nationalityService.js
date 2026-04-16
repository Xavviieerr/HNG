import axios from "axios";

export const getNationalityData = async (name) => {
	const res = await axios.get(`https://api.nationalize.io?name=${name}`);

	if (!res.data.country || res.data.country.length === 0) {
		const err = new Error("Nationalize returned an invalid response");
		err.statusCode = 502;
		throw err;
	}

	const topCountry = res.data.country[0];

	return {
		country_id: topCountry.country_id,
		country_probability: topCountry.probability,
	};
};
