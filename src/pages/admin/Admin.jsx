import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import AdminLogin from "./AdminLogin";
import AdminToast from "./AdminToast";
import RateLimitBadge from "./RateLimitBadge";
import HomeEditor from "./HomeEditor";
import ExperienceEditor from "./ExperienceEditor";
import ProjectsEditor from "./ProjectsEditor";
import HistoryRollback from "./HistoryRollback";

import initialInfo from "../../data/user";
import initialExperience from "../../data/experience";

import { serializeInfo, serializeExperience } from "../../utils/serializer";
import {
	fetchRepoFile,
	fetchRepoFileSha,
	commitRepoFile,
	commitRepoFileBase64,
	fetchCommitHistory,
	GITHUB_CONFIG,
} from "../../utils/github";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHome,
	faBriefcase,
	faProjectDiagram,
	faHistory,
	faSignOutAlt,
	faArrowUpRightFromSquare,
	faCloudUploadAlt,
	faUndo,
} from "@fortawesome/free-solid-svg-icons";

import "./styles/admin.css";

const readFileAsBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(new Error("Could not read the selected CV file."));
		reader.onload = () => {
			if (typeof reader.result !== "string") {
				reject(new Error("Could not read the selected CV file."));
				return;
			}

			const separatorIndex = reader.result.indexOf(",");
			if (separatorIndex === -1) {
				reject(new Error("Could not encode the selected CV file."));
				return;
			}

			resolve(reader.result.slice(separatorIndex + 1));
		};
		reader.readAsDataURL(file);
	});

const Admin = () => {
	const {
		isAuthenticated,
		githubToken,
		adminUser,
		logout,
		showToast,
		dismissToast,
		recordAction,
		getRateLimitInfo,
	} = useAdmin();

	// Active tab
	const [activeTab, setActiveTab] = useState("home");

	// In-memory working draft state
	const [infoData, setInfoData] = useState(() => JSON.parse(JSON.stringify(initialInfo)));
	const [experienceData, setExperienceData] = useState(() =>
		JSON.parse(JSON.stringify(initialExperience))
	);
	const [cvFile, setCvFile] = useState(null);

	// Committed baseline to detect changes
	const [baselineInfo, setBaselineInfo] = useState(() =>
		JSON.parse(JSON.stringify(initialInfo))
	);
	const [baselineExperience, setBaselineExperience] = useState(() =>
		JSON.parse(JSON.stringify(initialExperience))
	);

	// Recent commits from GitHub for rate limit auditing
	const [recentCommits, setRecentCommits] = useState([]);

	// Publishing state
	const [isPublishing, setIsPublishing] = useState(false);
	const [publishStatusText, setPublishStatusText] = useState("");
	const commitMessage = "feat(portfolio): update portfolio content via Admin Dashboard";

	// Fetch recent commits from GitHub on login
	const syncWithGitHub = useCallback(async () => {
		if (!githubToken) return;
		try {
			// Fetch commit history to verify recent commit timestamps for rate limit
			const commits = await fetchCommitHistory(githubToken, "src/data", 10).catch(() => []);
			setRecentCommits(commits);
		} catch (err) {
			console.warn("GitHub sync check:", err.message);
		}
	}, [githubToken]);

	useEffect(() => {
		if (isAuthenticated) {
			syncWithGitHub();
		}
	}, [isAuthenticated, syncWithGitHub]);

	// Rate limit calculation
	const rateLimitInfo = useMemo(() => {
		return getRateLimitInfo(recentCommits);
	}, [getRateLimitInfo, recentCommits]);

	// Dirty tracking
	const hasChanges = useMemo(() => {
		const infoChanged = JSON.stringify(infoData) !== JSON.stringify(baselineInfo);
		const expChanged = JSON.stringify(experienceData) !== JSON.stringify(baselineExperience);
		return infoChanged || expChanged || Boolean(cvFile);
	}, [infoData, baselineInfo, experienceData, baselineExperience, cvFile]);

	// Discard unsaved changes
	const handleResetChanges = () => {
		setInfoData(JSON.parse(JSON.stringify(baselineInfo)));
		setExperienceData(JSON.parse(JSON.stringify(baselineExperience)));
		setCvFile(null);
		showToast("info", "Draft discarded", "Your saved portfolio content is unchanged.");
	};

	const handleLogout = () => {
		showToast("info", "Signed out", "Your admin session has been securely closed.");
		logout();
	};

	// Publish changes directly to GitHub
	const handlePublishToGitHub = async () => {
		if (!hasChanges) {
			showToast("info", "Nothing to publish", "There are no unsaved changes.");
			return;
		}

		if (!rateLimitInfo.isAllowed) {
			showToast(
				"error",
				"Publish temporarily unavailable",
				`You have reached the 3-publish limit. Try again in ${rateLimitInfo.secondsRemaining} seconds.`
			);
			return;
		}

		setIsPublishing(true);
		setPublishStatusText("Connecting to GitHub...");
		dismissToast();

		try {
			// 1. Fetch latest SHAs
			setPublishStatusText("Verifying latest repository commit...");
			const currentUserFile = await fetchRepoFile(githubToken, "src/data/user.js");
			const currentExpFile = await fetchRepoFile(githubToken, "src/data/experience.js");
			const currentCvSha = cvFile
				? await fetchRepoFileSha(githubToken, "public/Muzamil_Saleem.pdf")
				: null;

			// 2. Serialize in-memory data
			setPublishStatusText("Generating clean JavaScript source code...");
			const userCode = serializeInfo(infoData);
			const expCode = serializeExperience(experienceData);

			const msg = commitMessage.trim() || "feat(portfolio): update portfolio content via Admin Dashboard";

			// 3. Commit src/data/user.js
			setPublishStatusText("Committing src/data/user.js to main branch...");
			await commitRepoFile(
				githubToken,
				"src/data/user.js",
				userCode,
				msg,
				currentUserFile.sha
			);

			// 4. Commit src/data/experience.js
			setPublishStatusText("Committing src/data/experience.js to main branch...");
			await commitRepoFile(
				githubToken,
				"src/data/experience.js",
				expCode,
				msg,
				currentExpFile.sha
			);

			if (cvFile) {
				setPublishStatusText("Uploading updated portfolio CV...");
				const cvBase64 = await readFileAsBase64(cvFile);
				await commitRepoFileBase64(
					githubToken,
					"public/Muzamil_Saleem.pdf",
					cvBase64,
					msg,
					currentCvSha
				);
			}

			// Record write action for 10-minute rate limiting
			recordAction(Date.now());

			// Update baseline
			setBaselineInfo(JSON.parse(JSON.stringify(infoData)));
			setBaselineExperience(JSON.parse(JSON.stringify(experienceData)));
			setCvFile(null);

			showToast(
				"success",
				"Publish complete",
				"Changes are on GitHub. Your live site will update after deployment."
			);

			await syncWithGitHub();
		} catch (err) {
			console.error("Publish error:", err);
			showToast(
				"error",
				"Publish failed",
				err.message || "Could not push changes to GitHub."
			);
		} finally {
			setIsPublishing(false);
			setPublishStatusText("");
		}
	};

	// Callback when rollback completes
	const handleRollbackComplete = async () => {
		showToast(
			"success",
			"Rollback complete",
			"Restored content was pushed. Refreshing to load the restored version."
		);
		await syncWithGitHub();
		setTimeout(() => {
			window.location.reload();
		}, 1500);
	};

	// If not authenticated, render Login view
	if (!isAuthenticated) {
		return <AdminLogin />;
	}

	return (
		<div className="admin-page-container">
			<AdminToast />
			{/* Ambient Aura Background Orbs */}
			<div className="admin-aura-orb admin-aura-orb-1" aria-hidden="true" />
			<div className="admin-aura-orb admin-aura-orb-2" aria-hidden="true" />
			<div className="admin-aura-orb admin-aura-orb-3" aria-hidden="true" />

			{/* Top Header */}
			<header className="admin-header">
				<div className="admin-header-content">
					<div className="admin-brand">
						<Link to="/" style={{ textDecoration: "none" }}>
							<h1 className="admin-brand-title">
								<span>Portfolio Admin</span>
								<span className="admin-badge">Live Sync</span>
							</h1>
						</Link>
						<span style={{ fontSize: 13, color: "var(--secondary-color)" }}>
							Logged in as <strong>{adminUser?.login || GITHUB_CONFIG.owner}</strong>
						</span>
					</div>

					<div className="admin-header-actions">
						<RateLimitBadge
							rateLimitInfo={rateLimitInfo}
							onWindowExpired={syncWithGitHub}
						/>

						<a
							href="https://muzamil-saleem.vercel.app"
							target="_blank"
							rel="noopener noreferrer"
							className="admin-btn admin-btn-secondary"
						>
							<FontAwesomeIcon icon={faArrowUpRightFromSquare} />
							<span>Live Site</span>
						</a>

						<button
							type="button"
							className="admin-btn admin-btn-secondary"
							onClick={handleLogout}
							title="Log out and wipe in-memory token"
						>
							<FontAwesomeIcon icon={faSignOutAlt} />
							<span>Logout</span>
						</button>
					</div>
				</div>
			</header>

			{/* Navigation Tabs */}
			<nav className="admin-nav-tabs">
				<button
					type="button"
					className={`admin-tab-btn ${activeTab === "home" ? "active" : ""}`}
					onClick={() => setActiveTab("home")}
				>
					<FontAwesomeIcon icon={faHome} />
					<span>Home & Bio</span>
				</button>

				<button
					type="button"
					className={`admin-tab-btn ${activeTab === "experience" ? "active" : ""}`}
					onClick={() => setActiveTab("experience")}
				>
					<FontAwesomeIcon icon={faBriefcase} />
					<span>Experience & CV ({experienceData.length})</span>
				</button>

				<button
					type="button"
					className={`admin-tab-btn ${activeTab === "projects" ? "active" : ""}`}
					onClick={() => setActiveTab("projects")}
				>
					<FontAwesomeIcon icon={faProjectDiagram} />
					<span>Projects ({infoData.projects?.length || 0})</span>
				</button>

				<button
					type="button"
					className={`admin-tab-btn ${activeTab === "history" ? "active" : ""}`}
					onClick={() => setActiveTab("history")}
				>
					<FontAwesomeIcon icon={faHistory} />
					<span>History & Rollback</span>
				</button>
			</nav>

			{/* Main Tab Panels */}
			<main className="admin-content">
				{activeTab === "home" && (
					<HomeEditor info={infoData} onChange={setInfoData} />
				)}

				{activeTab === "experience" && (
					<ExperienceEditor
						experiences={experienceData}
						onChange={setExperienceData}
						cvFile={cvFile}
						onCvChange={setCvFile}
					/>
				)}

				{activeTab === "projects" && (
					<ProjectsEditor
						projects={infoData.projects || []}
						onChange={(updatedProjects) =>
							setInfoData({ ...infoData, projects: updatedProjects })
						}
					/>
				)}

				{activeTab === "history" && (
					<HistoryRollback
						onRollbackComplete={handleRollbackComplete}
						rateLimitInfo={rateLimitInfo}
					/>
				)}
			</main>

			{/* Sticky Publish Footer */}
			<footer className="admin-sticky-footer">
				<div className="admin-sticky-footer-inner">
					<div className="admin-status-message">
						{hasChanges ? (
							<span style={{ color: "#fbbf24", display: "inline-flex", alignItems: "center", gap: 8 }}>
								<span className="admin-status-dot dirty" />
								<span>You have unsaved edits in memory</span>
							</span>
						) : (
							<span style={{ color: "var(--admin-text-muted)", display: "inline-flex", alignItems: "center", gap: 8 }}>
								<span className="admin-status-dot clean" />
								<span>All changes are synchronized with repository</span>
							</span>
						)}
					</div>

					<div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
						{hasChanges && (
							<button
								type="button"
								className="admin-btn admin-btn-secondary"
								onClick={handleResetChanges}
								disabled={isPublishing}
							>
								<FontAwesomeIcon icon={faUndo} />
								<span>Discard Changes</span>
							</button>
						)}

						<button
							type="button"
							className="admin-btn admin-btn-primary"
							onClick={handlePublishToGitHub}
							disabled={!hasChanges || !rateLimitInfo.isAllowed || isPublishing}
						>
							{isPublishing ? (
								<>
									<span className="spinner"></span>
									<span>{publishStatusText || "Publishing..."}</span>
								</>
							) : (
								<>
									<FontAwesomeIcon icon={faCloudUploadAlt} />
									<span>Publish & Push to GitHub</span>
								</>
							)}
						</button>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Admin;
