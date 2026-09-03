import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import "./styles/project.css";

const Project = (props) => {
	const { logo, stackIcons, title, description, benefits, link } = props;

	const normalizedLink = typeof link === "string" ? link.trim() : "";
	const isGitHub = normalizedLink.includes("github.com");
	const isLiveDemo = normalizedLink && !isGitHub;

	const getTechName = (icon) => {
		const iconPath = icon.toLowerCase();

		if (iconPath.includes("python")) return "Python";
		if (iconPath.includes("spark")) return "Apache Spark";
		if (iconPath.includes("databricks")) return "Databricks";
		if (iconPath.includes("aws")) return "AWS";
		if (iconPath.includes("azure")) return "Azure";
		if (iconPath.includes("sql")) return "SQL";

		if (iconPath.includes("react")) return "React";
		if (iconPath.includes("next")) return "Next.js";
		if (iconPath.includes("angular")) return "Angular";
		if (iconPath.includes("node")) return "Node.js";
		if (iconPath.includes("express")) return "Express.js";
		if (iconPath.includes("mysql")) return "MySQL";
		if (iconPath.includes("mongodb")) return "MongoDB";
		if (iconPath.includes("postgres")) return "PostgreSQL";

		if (iconPath.includes("tailwind")) return "Tailwind CSS";
		if (iconPath.includes("bootstrap")) return "Bootstrap";
		if (iconPath.includes("javascript")) return "JavaScript";
		if (iconPath.includes("typescript")) return "TypeScript";
		if (iconPath.includes("html")) return "HTML";
		if (iconPath.includes("css")) return "CSS";
		if (iconPath.includes("git")) return "Git";
		if (iconPath.includes("postman")) return "Postman";

		return "Technology";
	};

	return (
		<div className="project">
			<div className="project-container">
				<div className="project-logo">
					{stackIcons && stackIcons.length > 0 ? (
						<div className="project-stack-icons">
							{stackIcons.map((icon, index) => (
								<img
									key={index}
									src={icon}
									alt={`${title} tech ${index + 1}`}
									className="project-stack-icon"
								/>
							))}
						</div>
					) : (
						<img src={logo} alt={title} />
					)}
				</div>

				<div className="project-title">{title}</div>

				{stackIcons && stackIcons.length > 0 && (
					<div
						className="project-tech-badges"
						aria-label={`${title} tech stack`}
					>
						{stackIcons.slice(0, 4).map((icon, index) => (
							<span
								className="project-tech-badge"
								key={index}
							>
								{getTechName(icon)}
							</span>
						))}
					</div>
				)}

				<div className="project-description">
					{description}
				</div>

				{benefits && (
					<ul className="project-benefits">
						{benefits.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ul>
				)}

				<div className="project-actions">
					{isLiveDemo && (
						<a
							href={normalizedLink}
							target="_blank"
							rel="noreferrer"
							className="project-action-btn project-action-demo"
						>
							<span className="project-action-icon">
								<FontAwesomeIcon
									icon={faArrowUpRightFromSquare}
								/>
							</span>
							Live Demo
						</a>
					)}

					{isGitHub && (
						<a
							href={normalizedLink}
							target="_blank"
							rel="noreferrer"
							className="project-action-btn project-action-github"
						>
							<FontAwesomeIcon icon={faGithub} />
							GitHub
						</a>
					)}
				</div>
			</div>
		</div>
	);
};

export default Project;