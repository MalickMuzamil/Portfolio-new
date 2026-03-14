import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

import "./styles/project.css";

const Project = (props) => {
	const { logo, stackIcons, title, description, benefits, linkText, link } = props;

	return (
		<div className="project">
			<a href={link} target="_blank" rel="noopener noreferrer">
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

					<div className="project-description">{description}</div>

					{benefits && (
						<ul className="project-benefits">
							{benefits.map((item, index) => (
								<li key={index}>{item}</li>
							))}
						</ul>
					)}

					<div className="project-link">
						<div className="project-link-icon">
							<FontAwesomeIcon icon={faLink} />
						</div>

						<div className="project-link-text">{linkText}</div>
					</div>

				</div>
			</a>
		</div>
	);
};

export default Project;