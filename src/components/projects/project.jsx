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
					<div className="project-tech-badges" aria-label={`${title} tech stack`}>
						{stackIcons.slice(0, 4).map((icon, index) => (
							<span className="project-tech-badge" key={index}>
								{icon.includes("react") ? "React" : icon.includes("next") ? "Next.js" : icon.includes("angular") ? "Angular" : icon.includes("node") ? "Node" : icon.includes("express") ? "Express" : icon.includes("mysql") ? "MySQL" : icon.includes("mongodb") ? "MongoDB" : icon.includes("bootstrap") ? "Bootstrap" : icon.includes("tailwind") ? "Tailwind" : icon.includes("html") ? "HTML" : icon.includes("css") ? "CSS" : "Tech"}
							</span>
						))}
					</div>
				)}

				<div className="project-description">{description}</div>

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
								<FontAwesomeIcon icon={faArrowUpRightFromSquare} />
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