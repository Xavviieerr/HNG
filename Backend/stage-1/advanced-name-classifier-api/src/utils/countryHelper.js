import countries from "i18n-iso-countries";

export const getCountryName = (countryId) => {
	// Converts "NG" -> "Nigeria"
	return countries.getName(countryId.toUpperCase(), "en") || "Unknown";
};

export const getCountryId = (countryName) => {
	// Converts "Nigeria" -> "NG"
	return countries.getAlpha2Code(countryName, "en") || null;
};
