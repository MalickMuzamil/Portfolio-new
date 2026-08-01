import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import AllProjects from "../components/projects/allProjects";

import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/projects.css";

const Projects = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "projects");

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Projects | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="projects" />
				<div className="content-wrapper">
					<div className="projects-logo-container">
						<div className="projects-logo">
							<Logo width={46} />
						</div>
					</div>
					<div className="projects-container" data-aos="fade-up">
						<div className="title projects-title">
							Things I’ve built while solving real product and business problems.
						</div>

						<div className="subtitle projects-subtitle">
							I’ve worked across client-facing web apps, internal tools, and full-stack platforms. These projects reflect a mix of UI polish, scalable architecture, and practical implementation work. If you’d like to explore any of them, I’m always happy to share more context or discuss the approach behind them.
						</div>


						<div className="projects-list" data-aos="fade-up" data-aos-delay="180">
							<AllProjects />
						</div>

						<div className="projects-github-button" data-aos="fade-up" data-aos-delay="120">
							<a
								href={INFO.socials.github}
								target="_blank"
								rel="noreferrer"
								className="projects-github-link"
							>
								Show GitHub
							</a>
						</div>
					</div>
					<div className="page-footer">
						<Footer />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Projects;
