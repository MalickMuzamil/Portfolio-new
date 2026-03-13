import React from "react";
import "./style/techstack.css";

const tech = [
    { name: "Bootstrap", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },

    { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },

    { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },

    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },

    { name: "React JS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },

    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },

    { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },

    { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },

    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" }
];

const TechStack = () => {
    return (
        <div className="tech-container">

            <h2 className="tech-title">Tech Stack</h2>

            <div className="tech-grid">
                {tech.map((item, index) => (
                    <div className="tech-card" key={index}>

                        <div className="tech-icon">
                            <img src={item.icon} alt={item.name} />
                        </div>

                        <div className="tech-name">{item.name}</div>

                    </div>
                ))}
            </div>

        </div>
    );
};

export default TechStack;