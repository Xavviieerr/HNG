export const handleApiError = (serviceName) => {
	const err = new Error(`${serviceName} returned an invalid response`);
	err.statusCode = 502;
	throw err;
};
