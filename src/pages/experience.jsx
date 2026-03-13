import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";

import INFO from "../data/user";
import SEO from "../data/seo";
import experience from "../data/experience";

import "./styles/experience.css";

const Experience = () => {

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "about");

	return (
		<React.Fragment>

			<Helmet>
				<title>{`Experience | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta name="keywords" content={currentSEO.keywords.join(", ")} />
			</Helmet>

			<div className="page-content">

				<NavBar active="experience" />

				<div className="content-wrapper">

					<div className="experience-logo-container">
						<div className="experience-logo">
							<Logo width={46} />
						</div>
					</div>

					<div className="experience-main-container">

						<div className="title experience-title-main">
							Experience
						</div>

						<div className="subtitle experience-subtitle">
							My journey working with modern web technologies and building full stack applications.
						</div>

						<div className="experience-container">

							{experience.map((item, index) => (

								<div className="experience-item" key={index}>

									<div className="experience-dot"></div>

									<div className="experience-card">

										<div className="experience-date">
											{item.date}
										</div>

										<div className="experience-title">
											{item.title}
										</div>

										<div className="experience-company">
											{item.company}
										</div>

										<div className="experience-description">
											{item.description}
										</div>

									</div>

								</div>

							))}

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

export default Experience;