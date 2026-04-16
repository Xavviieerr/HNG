import axios from "axios";

export const getAgeData = async (name) => {
	const res = await axios.get(`https://api.agify.io?name=${name}`);

	if (res.data.age === null) {
		const err = new Error("Agify returned an invalid response");
		err.statusCode = 502;
		throw err;
	}

	// classification Logic
	let ageGroup = "senior";
	if (res.data.age <= 12) ageGroup = "child";
	else if (res.data.age <= 19) ageGroup = "teenager";
	else if (res.data.age <= 59) ageGroup = "adult";

	return {
		age: res.data.age,
		age_group: ageGroup,
	};
};
