import { utf8ToBase64, base64ToUtf8 } from "./serializer";

export const GITHUB_CONFIG = {
	owner: "MalickMuzamil",
	repo: "Portfolio-new",
	branch: "main",
	adminEmail: "malikmuzamil92110@gmail.com",
	rateLimitMax: 3,
	rateLimitWindowMs: 10 * 60 * 1000, // 10 minutes in ms
	maxRollbackCommits: 5, // Limit on how many past commits can be reverted to
};

/**
 * Verify GitHub token and identity against expected owner
 */
export async function verifyGitHubToken(token, providedEmail) {
	if (!token || !token.trim()) {
		throw new Error("GitHub token is required.");
	}

	if (providedEmail.trim().toLowerCase() !== GITHUB_CONFIG.adminEmail.toLowerCase()) {
		throw new Error(`Unauthorized email. Access is strictly restricted to ${GITHUB_CONFIG.adminEmail}.`);
	}

	const response = await fetch("https://api.github.com/user", {
		headers: {
			Authorization: `Bearer ${token.trim()}`,
			Accept: "application/vnd.github.v3+json",
		},
	});

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error("Invalid GitHub token. Please verify token permissions (Contents: Read & Write).");
		}
		throw new Error(`GitHub verification failed (${response.status}): ${response.statusText}`);
	}

	const user = await response.json();

	// Verify username
	if (user.login && user.login.toLowerCase() !== GITHUB_CONFIG.owner.toLowerCase()) {
		throw new Error(`Token belongs to '${user.login}', but this portfolio belongs to '${GITHUB_CONFIG.owner}'. Access denied.`);
	}

	return {
		success: true,
		login: user.login,
		avatar_url: user.avatar_url,
		name: user.name,
	};
}

/**
 * Fetch a file from the repository
 */
export async function fetchRepoFile(token, filePath, ref = GITHUB_CONFIG.branch) {
	const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${filePath}?ref=${ref}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token.trim()}`,
			Accept: "application/vnd.github.v3+json",
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch ${filePath} from GitHub (${response.status}): ${response.statusText}`);
	}

	const data = await response.json();
	const decoded = base64ToUtf8(data.content.replace(/\n/g, ""));

	return {
		sha: data.sha,
		content: decoded,
		path: data.path,
	};
}

export async function fetchRepoFileSha(token, filePath, ref = GITHUB_CONFIG.branch) {
	const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${filePath}?ref=${ref}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token.trim()}`,
			Accept: "application/vnd.github.v3+json",
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch ${filePath} from GitHub (${response.status}): ${response.statusText}`);
	}

	const data = await response.json();
	return data.sha;
}

/**
 * Commit updated file directly to repository main branch
 */
export async function commitRepoFile(token, filePath, contentString, commitMessage, fileSha) {
	return commitRepoFileBase64(
		token,
		filePath,
		utf8ToBase64(contentString),
		commitMessage,
		fileSha
	);
}

export async function commitRepoFileBase64(token, filePath, base64Content, commitMessage, fileSha) {
	const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${filePath}`;
	const bodyPayload = {
		message: commitMessage,
		content: base64Content,
		branch: GITHUB_CONFIG.branch,
	};

	if (fileSha) {
		bodyPayload.sha = fileSha;
	}

	const response = await fetch(url, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token.trim()}`,
			Accept: "application/vnd.github.v3+json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(bodyPayload),
	});

	if (!response.ok) {
		const err = await response.json().catch(() => ({}));
		if (
			response.status === 403 &&
			err.message === "Resource not accessible by personal access token"
		) {
			throw new Error(
				"GitHub rejected this token's write access. For a fine-grained token, select the MalickMuzamil/Portfolio-new repository and grant Contents: Read and write. For a classic token, enable the repo scope (or public_repo for a public repository). Then log out and sign in again with the updated token."
			);
		}

		throw new Error(`GitHub commit failed (${response.status}): ${err.message || response.statusText}`);
	}

	return await response.json();
}

/**
 * Fetch recent commit history for data files
 */
export async function fetchCommitHistory(token, path = "src/data", perPage = 10) {
	const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/commits?path=${encodeURIComponent(path)}&per_page=${perPage}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token.trim()}`,
			Accept: "application/vnd.github.v3+json",
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch commit history (${response.status}): ${response.statusText}`);
	}

	const commits = await response.json();
	return commits.map((item) => ({
		sha: item.sha,
		shortSha: item.sha.substring(0, 7),
		message: item.commit.message,
		authorName: item.commit.author.name,
		date: item.commit.author.date,
		timestamp: new Date(item.commit.author.date).getTime(),
		htmlUrl: item.html_url,
	}));
}

/**
 * Calculate rate limit status from commit history + in-memory actions
 * Strictly ensures max 3 push/revert actions within 10 minutes (600,000 ms)
 */
export function calculateRateLimitStatus(inMemoryTimestamps = [], recentCommits = []) {
	const now = Date.now();
	const windowMs = GITHUB_CONFIG.rateLimitWindowMs; // 10 minutes
	const cutoff = now - windowMs;

	// Collect timestamps from in-memory actions
	const activeInMemory = inMemoryTimestamps.filter((ts) => ts > cutoff);

	// Collect timestamps from recent commits made by admin
	const activeCommitTimestamps = recentCommits
		.filter((c) => c.timestamp > cutoff)
		.map((c) => c.timestamp);

	// Merge and deduplicate timestamps that are within 5 seconds of each other
	const allTimestamps = [...activeInMemory, ...activeCommitTimestamps].sort((a, b) => a - b);
	const uniqueRecentActions = [];

	for (const ts of allTimestamps) {
		if (
			uniqueRecentActions.length === 0 ||
			ts - uniqueRecentActions[uniqueRecentActions.length - 1] > 5000
		) {
			uniqueRecentActions.push(ts);
		}
	}

	const usedCount = uniqueRecentActions.length;
	const isAllowed = usedCount < GITHUB_CONFIG.rateLimitMax;

	let secondsRemaining = 0;
	if (!isAllowed) {
		// Oldest action in the 3-limit window
		const oldestInWindow = uniqueRecentActions[0];
		secondsRemaining = Math.max(0, Math.ceil((oldestInWindow + windowMs - now) / 1000));
	}

	return {
		used: usedCount,
		max: GITHUB_CONFIG.rateLimitMax,
		isAllowed,
		secondsRemaining,
		activeTimestamps: uniqueRecentActions,
	};
}

/**
 * Revert data files to a past commit
 */
export async function revertToCommit(token, targetCommitSha, targetCommitMessage) {
	const filesToRestore = [
		"src/data/user.js",
		"src/data/experience.js"
	];

	const results = [];

	for (const filePath of filesToRestore) {
		try {
			// 1. Fetch file content at the target commit
			const pastFile = await fetchRepoFile(token, filePath, targetCommitSha);

			// 2. Fetch current head file SHA on main
			const currentHead = await fetchRepoFile(token, filePath, GITHUB_CONFIG.branch);

			// 3. Commit the restored content back to main
			const commitMsg = `revert: rollback ${filePath.split("/").pop()} to ${targetCommitSha.substring(0, 7)} ("${targetCommitMessage}")`;
			const commitResult = await commitRepoFile(
				token,
				filePath,
				pastFile.content,
				commitMsg,
				currentHead.sha
			);

			results.push({ path: filePath, success: true, commitResult });
		} catch (err) {
			console.warn(`Could not revert ${filePath}:`, err.message);
			results.push({ path: filePath, success: false, error: err.message });
		}
	}

	return results;
}
