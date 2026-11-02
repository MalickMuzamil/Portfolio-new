/**
 * Serializer to convert portfolio data objects into formatted JavaScript files
 * ready for direct commit to GitHub repository.
 */

export function serializeInfo(info) {
	const code = `const INFO = ${JSON.stringify(info, null, "\t")};

export default INFO;
`;
	return code;
}

export function serializeExperience(experienceList) {
	const code = `const experience = ${JSON.stringify(experienceList, null, "\t")};

export default experience;
`;
	return code;
}

/**
 * Safe UTF-8 to Base64 encoder for browser environments
 */
export function utf8ToBase64(str) {
	return window.btoa(
		encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
			return String.fromCharCode(parseInt(p1, 16));
		})
	);
}

/**
 * Safe Base64 to UTF-8 decoder for browser environments
 */
export function base64ToUtf8(str) {
	return decodeURIComponent(
		Array.prototype.map
			.call(window.atob(str), function (c) {
				return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join("")
	);
}

