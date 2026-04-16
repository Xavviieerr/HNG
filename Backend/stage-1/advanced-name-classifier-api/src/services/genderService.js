import axios from "axios";

export const getGenderData = async (name) => {
	const res = await axios.get(`https://api.genderize.io?name=${name}`);
	console.log(res.data);

	if (!res.data.gender || res.data.count === 0) {
		const err = new Error("Genderize returned an invalid response");
		err.statusCode = 502;
		throw err;
	}

	return {
		gender: res.data.gender,
		gender_probability: res.data.probability,
		sample_size: res.data.count,
	};
};
