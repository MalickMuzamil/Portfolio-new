import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import INFO from "../../data/user";
import "./styles/socialLinks.css";

const SocialLinks = ({ className = "" }) => {
	return (
		<div className={`social-links-container ${className}`} role="list" aria-label="Social media profiles">
			{INFO.socials.linkedin && (
				<a
					href={INFO.socials.linkedin}
					target="_blank"
					rel="noreferrer"
					aria-label="Visit Muzamil Saleem on LinkedIn"
					className="social-link-item"
				>
					<FontAwesomeIcon icon={faLinkedin} />
				</a>
			)}

			{INFO.socials.github && (
				<a
					href={INFO.socials.github}
					target="_blank"
					rel="noreferrer"
					aria-label="Visit Muzamil Saleem on GitHub"
					className="social-link-item"
				>
					<FontAwesomeIcon icon={faGithub} />
				</a>
			)}

			{INFO.socials.instagram && (
				<a
					href={INFO.socials.instagram}
					target="_blank"
					rel="noreferrer"
					aria-label="Visit Muzamil Saleem on Instagram"
					className="social-link-item"
				>
					<FontAwesomeIcon icon={faInstagram} />
				</a>
			)}

			{INFO.main.email && (
				<a
					href={`mailto:${INFO.main.email}`}
					target="_blank"
					rel="noreferrer"
					aria-label="Email Muzamil Saleem"
					className="social-link-item"
				>
					<FontAwesomeIcon icon={faEnvelope} />
				</a>
			)}

			<a
				href="Muzamil_Saleem.pdf"
				target="_blank"
				rel="noreferrer"
				download
				aria-label="Download Muzamil Saleem resume"
				className="social-link-item"
			>
				<FontAwesomeIcon icon={faFileArrowDown} />
			</a>
		</div>
	);
};

export default SocialLinks;

