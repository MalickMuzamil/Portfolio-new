const INFO = {
	main: {
		title: "Muzamil Saleem — Software Engineer, Full Stack & Data Engineer",
		name: "Muzamil Saleem",
		email: "[malikmuzamil92110@gmail.com](mailto:malikmuzamil92110@gmail.com)",
		logo: "../logo.png",
	},

	socials: {
		github: "https://github.com/MalickMuzamil",
		instagram: "https://instagram.com/hafixmuzamil",
		linkedin: "https://linkedin.com/in/malik-muzamil",
	},

	homepage: {
		title: "Software Engineer, Full Stack Developer & Data Engineer | Web · APIs · Data · Cloud",
		description:
			"I build scalable software applications and data engineering systems. On the software side, I develop modern full-stack applications, REST APIs, backend services, and data-driven interfaces using React, Next.js, Node.js, Angular, and SQL/NoSQL databases. On the data side, I design ETL/ELT pipelines, cloud data platforms, Medallion Architecture, and metadata-driven data workflows using AWS, Azure, Databricks, Python, PySpark, and SQL.",
	},

	about: {
		title: "I'm Muzamil Saleem — Software Engineer, Full Stack Developer & Data Engineer.",
		description:
			`I am a results-driven Software Engineer, Full Stack Developer, and Data Engineer with hands-on experience building scalable web applications, backend services, data platforms, and production-ready engineering solutions.

		On the Software Engineering and Full Stack side, I build modern web applications using React, Next.js, Angular, Node.js, and Express.js. I develop REST APIs, backend services, authentication systems, dashboards, and data-driven interfaces backed by relational databases such as SQL Server, MySQL, and PostgreSQL, as well as NoSQL databases like MongoDB.

		On the Data Engineering side, I design and implement scalable ETL and ELT pipelines using metadata-driven architecture principles. I apply Medallion Architecture (Bronze → Silver → Gold) to build reliable and analytics-ready data platforms. My experience includes Apache Spark, PySpark, Databricks, Azure Data Factory, AWS Glue, Redshift, SQL, Python, dbt, and Apache Airflow.

		I work across both application and data layers, connecting backend systems with reliable data pipelines and analytics platforms. My cloud experience spans Microsoft Azure and Amazon Web Services, including services such as ADLS Gen2, Blob Storage, Synapse Analytics, S3, Glue, Lambda, Redshift, and Athena.

		I focus on writing clean, maintainable code and building systems that are scalable, observable, testable, and production-ready — from user-facing applications and APIs to the data pipelines powering analytics and business intelligence.` ,
	},

	articles: {
		title: "Insights on Software Engineering, Data Engineering, Cloud, and Full Stack Development.",
		description:
			"A collection of my thoughts, experiences, and learnings about software engineering, full stack development, backend systems, data pipelines, ETL/ELT patterns, cloud platforms, Medallion Architecture, and modern application development.",
	},

	projects: [
		{
			title: "Metadata-Driven ETL Framework",
			description:
				"Designed and built a fully metadata-driven ETL pipeline on Azure Data Factory. Pipeline behavior — source, transformation rules, target, and scheduling — is controlled entirely via configuration tables, enabling zero-code onboarding of new data sources.",
			logo: "/techstack/azure.svg",
			stackIcons: [
				"/techstack/azure.svg",
				"/techstack/python.svg",
				"/techstack/sql.svg",
			],
			linkText: "View on GitHub",
			link: "https://github.com/MalickMuzamil",
		},

		{
			title: "Medallion Architecture Data Lakehouse",
			description:
				"Implemented Bronze → Silver → Gold Medallion Architecture on Azure Data Lake Storage Gen2 with Databricks. Raw ingestion in Bronze, cleansed & conformed data in Silver, and business-aggregate Gold tables consumed by Power BI dashboards.",
			logo: "/techstack/databricks.svg",
			stackIcons: [
				"/techstack/databricks.svg",
				"/techstack/azure.svg",
				"/techstack/python.svg",
				"/techstack/spark.svg",
			],
			linkText: "View on GitHub",
			link: "https://github.com/MalickMuzamil",
		},

		{
			title: "AWS Glue ELT Pipeline — Redshift Analytics",
			description:
				"Built an ELT pipeline using AWS Glue and PySpark to ingest raw files from S3, apply schema enforcement and data quality checks, and load curated data into Amazon Redshift for analytics and BI consumption.",
			logo: "/techstack/aws.svg",
			stackIcons: [
				"/techstack/aws.svg",
				"/techstack/python.svg",
				"/techstack/spark.svg",
				"/techstack/sql.svg",
			],
			linkText: "View on GitHub",
			link: "https://github.com/MalickMuzamil",
		},

		{
			title: "Apache Airflow Orchestration Platform",
			description:
				"Designed a reusable Apache Airflow DAG framework to orchestrate multi-step data pipelines with dynamic DAG generation, retry handling, alerting, and SLA monitoring.",
			logo: "/techstack/python.svg",
			stackIcons: [
				"/techstack/python.svg",
				"/techstack/azure.svg",
				"/techstack/sql.svg",
			],
			linkText: "View on GitHub",
			link: "https://github.com/MalickMuzamil",
		},

		{
			title: "Executive Dashboard (Admin Panel)",
			description:
				"Built a Next.js and Node.js-based admin platform for internal monitoring, analytics, and real-time data visualization with secure role-based access and REST API integration.",
			logo: "/techstack/nextjs.svg",
			stackIcons: [
				"/techstack/nextjs.svg",
				"/techstack/nodejs.svg",
				"/techstack/express.svg",
				"/techstack/mysql.svg",
			],
			linkText: "View Project",
			link: "https://exec.postexglobal.com",
		},

		{
			title: "Yanbu International Job Portal",
			description:
				"Built a responsive Angular and Node.js job portal with multilingual Arabic/English support, REST API integration, dynamic job listings, and SQL-based data management.",
			logo: "/techstack/angular.svg",
			stackIcons: [
				"/techstack/angular.svg",
				"/techstack/nodejs.svg",
				"/techstack/mysql.svg",
			],
			linkText: "View Project",
			link: "https://yanbu-job-portal.vercel.app",
		},

		{
			title: "EverGreen Sable Web Application",
			description:
				"Built a modern web application with responsive UI, optimized performance, dynamic data handling, CSV export, and Excel integration for automated data updates.",
			logo: "/techstack/react.svg",
			stackIcons: ["/techstack/nextjs.svg", "/techstack/tailwindcss.svg"],
			linkText: "View Project",
			link: "https://evergreen-sable.vercel.app",
		},

		{
			title: "dbt Data Transformation Layer",
			description:
				"Developed a modular dbt transformation layer that converts raw ingested data into analytics-ready models using staging, intermediate, and mart conventions with lineage documentation.",
			logo: "/techstack/sql.svg",
			stackIcons: [
				"/techstack/sql.svg",
				"/techstack/python.svg",
				"/techstack/databricks.svg",
			],
			linkText: "View on GitHub",
			link: "https://github.com/MalickMuzamil",
		},

		{
			title: "Employee Tracking System",
			description:
				"Built an employee tracking application using Angular, Node.js, and MongoDB for employee activity monitoring, attendance management, and centralized data handling.",
			logo: "/techstack/nodejs.svg",
			stackIcons: [
				"/techstack/angular.svg",
				"/techstack/nodejs.svg",
				"/techstack/mongodb.svg",
			],
			linkText: "View on GitHub",
			link: "https://github.com/MalickMuzamil/Employee-Tracking-System",
		},

		{
			title: "Retail POS System (MEAN)",
			description:
				"Built a full-stack point-of-sale system using the MEAN stack with product management, billing workflows, inventory operations, and persistent MongoDB storage.",
			logo: "/techstack/nodejs.svg",
			stackIcons: [
				"/techstack/angular.svg",
				"/techstack/nodejs.svg",
				"/techstack/mongodb.svg",
				"/techstack/express.svg",
			],
			linkText: "View on GitHub",
			link: "https://github.com/MalickMuzamil/POS-Inventory",
		},

		{
			title: "GPT Clone (MERN)",
			description:
				"Built a full-stack ChatGPT-style application using the MERN stack with OpenAI integration, JWT authentication, API integration, and persistent chat history.",
			logo: "/techstack/react.svg",
			stackIcons: [
				"/techstack/react.svg",
				"/techstack/nodejs.svg",
				"/techstack/mongodb.svg",
				"/techstack/express.svg",
			],
			linkText: "View on GitHub",
			link: "https://github.com/MalickMuzamil/GPT-CLone",
		},

		{
			title: "Hierarchy Survey App (MEAN)",
			description:
				"Built a role-based MEAN stack survey platform with hierarchical access control, dynamic forms, and secure data visibility across organizational levels.",
			logo: "/techstack/nodejs.svg",
			stackIcons: [
				"/techstack/angular.svg",
				"/techstack/nodejs.svg",
				"/techstack/mongodb.svg",
				"/techstack/express.svg",
			],
			linkText: "View on GitHub",
			link: "https://github.com/MalickMuzamil/Survey-App",
		},

		{
			title: "Opticians CRM & eStore Platform",
			description:
				"Built an Angular-based CRM and eStore registration platform with responsive UI, reusable components, and scalable frontend architecture.",
			logo: "/techstack/angular.svg",
			stackIcons: ["/techstack/angular.svg", "/techstack/bootstrap.svg"],
			linkText: "View Project",
			link: "https://opticians.pk",
		},

		{
			title: "Delaeheim Master Car Inventory",
			description:
				"Built a responsive car inventory web application using Next.js and Tailwind CSS with real-time search, filtering, and an OLX-style browsing experience.",
			logo: "/techstack/nextjs.svg",
			stackIcons: ["/techstack/nextjs.svg", "/techstack/tailwindcss.svg"],
			linkText: "View on GitHub",
			link: "https://delaeheim-master.vercel.app/",
		},
	],

};

export default INFO;
