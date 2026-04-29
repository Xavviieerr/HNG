const sessions = new Map();

export const setAuthSession = (state, data) => {
	sessions.set(state, data);

	// auto cleanup after 10 minutes
	setTimeout(
		() => {
			sessions.delete(state);
		},
		10 * 60 * 1000,
	);
};

export const getAuthSession = (state) => {
	return sessions.get(state);
};
