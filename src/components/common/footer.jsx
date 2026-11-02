import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

import "./styles/footer.css";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<React.Fragment>
			<div className="footer">
				<div className="footer-links">
					<ul className="footer-nav-link-list">
						<li className="footer-nav-link-item">
							<Link to="/">Home</Link>
						</li>
						<li className="footer-nav-link-item">
							<Link to="/about">About</Link>
						</li>
						<li className="footer-nav-link-item">
							<Link to="/projects">Projects</Link>
						</li>
						<li className="footer-nav-link-item">
							<Link to="/experience">Experience</Link>
						</li>
						<li className="footer-nav-link-item">
							<Link to="/contact">Contact</Link>
						</li>
					</ul>
				</div>

				<div className="footer-credits">
					<div className="footer-credits-text">
						© {currentYear} Muzamil Saleem. All Rights Reserved.
						<Link
							to="/admin"
							title="Admin Portal"
							style={{
								marginLeft: "8px",
								color: "var(--tertiary-color)",
								opacity: 0.6,
								textDecoration: "none",
								display: "inline-block",
							}}
						>
							<FontAwesomeIcon icon={faLock} style={{ fontSize: "11px" }} />
						</Link>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Footer;
