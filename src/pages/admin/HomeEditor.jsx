import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHome, faAddressCard, faShareAlt } from "@fortawesome/free-solid-svg-icons";

const HomeEditor = ({ info, onChange }) => {
	const handleMainChange = (field, value) => {
		onChange({
			...info,
			main: {
				...info.main,
				[field]: value,
			},
		});
	};

	const handleSocialChange = (field, value) => {
		onChange({
			...info,
			socials: {
				...info.socials,
				[field]: value,
			},
		});
	};

	const handleHomepageChange = (field, value) => {
		onChange({
			...info,
			homepage: {
				...info.homepage,
				[field]: value,
			},
		});
	};

	const handleAboutChange = (field, value) => {
		onChange({
			...info,
			about: {
				...info.about,
				[field]: value,
			},
		});
	};

	return (
		<div className="home-editor-container">
			{/* General & Identity */}
			<div className="admin-card">
				<div className="admin-card-header">
					<h3 className="admin-card-title">
						<FontAwesomeIcon icon={faUser} style={{ color: "var(--link-color)" }} />
						<span>Identity & Core Info</span>
					</h3>
					<span className="admin-card-subtitle">Reflected across navbar, header, and metadata</span>
				</div>

				<div className="admin-form-row">
					<div className="admin-form-group">
						<label className="admin-label">Full Name</label>
						<input
							type="text"
							className="admin-input"
							value={info.main?.name || ""}
							onChange={(e) => handleMainChange("name", e.target.value)}
						/>
					</div>
					<div className="admin-form-group">
						<label className="admin-label">Primary Contact Email</label>
						<input
							type="email"
							className="admin-input"
							value={info.main?.email || ""}
							onChange={(e) => handleMainChange("email", e.target.value)}
						/>
					</div>
				</div>

				<div className="admin-form-group">
					<label className="admin-label">Header Title / Role Headline</label>
					<input
						type="text"
						className="admin-input"
						value={info.main?.title || ""}
						onChange={(e) => handleMainChange("title", e.target.value)}
					/>
				</div>
			</div>

			{/* Social Links */}
			<div className="admin-card">
				<div className="admin-card-header">
					<h3 className="admin-card-title">
						<FontAwesomeIcon icon={faShareAlt} style={{ color: "var(--link-color)" }} />
						<span>Social Profiles</span>
					</h3>
					<span className="admin-card-subtitle">Links used on home page, about page, and footer</span>
				</div>

				<div className="admin-form-row">
					<div className="admin-form-group">
						<label className="admin-label">GitHub URL</label>
						<input
							type="url"
							className="admin-input"
							value={info.socials?.github || ""}
							onChange={(e) => handleSocialChange("github", e.target.value)}
						/>
					</div>
					<div className="admin-form-group">
						<label className="admin-label">LinkedIn URL</label>
						<input
							type="url"
							className="admin-input"
							value={info.socials?.linkedin || ""}
							onChange={(e) => handleSocialChange("linkedin", e.target.value)}
						/>
					</div>
				</div>

				<div className="admin-form-group">
					<label className="admin-label">Instagram URL</label>
					<input
						type="url"
						className="admin-input"
						value={info.socials?.instagram || ""}
						onChange={(e) => handleSocialChange("instagram", e.target.value)}
					/>
				</div>
			</div>

			{/* Homepage Hero */}
			<div className="admin-card">
				<div className="admin-card-header">
					<h3 className="admin-card-title">
						<FontAwesomeIcon icon={faHome} style={{ color: "var(--link-color)" }} />
						<span>Homepage Hero Content</span>
					</h3>
					<span className="admin-card-subtitle">Main tagline and introductory pitch</span>
				</div>

				<div className="admin-form-group">
					<label className="admin-label">Hero Title</label>
					<input
						type="text"
						className="admin-input"
						value={info.homepage?.title || ""}
						onChange={(e) => handleHomepageChange("title", e.target.value)}
					/>
				</div>

				<div className="admin-form-group">
					<label className="admin-label">Hero Description</label>
					<textarea
						className="admin-textarea"
						rows={4}
						value={info.homepage?.description || ""}
						onChange={(e) => handleHomepageChange("description", e.target.value)}
					/>
				</div>
			</div>

			{/* About Me Section */}
			<div className="admin-card">
				<div className="admin-card-header">
					<h3 className="admin-card-title">
						<FontAwesomeIcon icon={faAddressCard} style={{ color: "var(--link-color)" }} />
						<span>About Me Details</span>
					</h3>
					<span className="admin-card-subtitle">Full biography displayed on /about</span>
				</div>

				<div className="admin-form-group">
					<label className="admin-label">About Page Title</label>
					<input
						type="text"
						className="admin-input"
						value={info.about?.title || ""}
						onChange={(e) => handleAboutChange("title", e.target.value)}
					/>
				</div>

				<div className="admin-form-group">
					<label className="admin-label">About Page Description / Bio</label>
					<textarea
						className="admin-textarea"
						rows={8}
						value={info.about?.description || ""}
						onChange={(e) => handleAboutChange("description", e.target.value)}
					/>
				</div>
			</div>
		</div>
	);
};

export default HomeEditor;

