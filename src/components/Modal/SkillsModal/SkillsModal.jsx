import './skills.css'

function SkillsModal() {
  // Grouped skills
  const skillGroups = {
    "Programming Languages": [
      { name: "C++", key: "cplusplus" },
      { name: "Python", key: "python" },
      { name: "JavaScript", key: "javascript" },
    ],
    "Tools & Frameworks": [
      { name: "GitHub", key: "github" },
      { name: "USD", key: "usd" },
      { name: "OpenGL", key: "opengl" },
      { name: "Three.js", key: "threejs" }, 
    ],
    "DCCs": [
      { name: "Unreal Engine", key: "unreal" },
      { name: "Blender", key: "blender" },
      { name: "Maya", key: "maya" },
      { name: "Unity", key: "unity" }
    ]
  };

  // Map skill keys to Devicon icon folders
  const iconMap = {
    cplusplus: "cplusplus",
    python: "python",
    javascript: "javascript",
    unreal: "unrealengine",
    unity: "unity",
    blender: "blender",
    maya: "maya",
    opengl: "opengl",
    github: "github"
  };

  // Handle logo path (Devicon vs custom fallback)
  const getIconSrc = (key) => {
    if (iconMap[key]) {
      return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconMap[key]}/${iconMap[key]}-original.svg`;
    }

    // Custom logos you’ll add to your /public/icons folder
    if (key === "threejs") return "/icons/three-logo.svg";
    if (key === "usd") return "/icons/USD-logo.svg";

    return "/icons/placeholder.svg"; // fallback
  };

  return (
    <div>
      <div className="skills-header">
        <h2>Skills</h2>
      </div>
      {Object.entries(skillGroups).map(([group, skills]) => (
        <div key={group} className="skill-group">
          <h3>{group}</h3>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <img
                  src={getIconSrc(skill.key)}
                  alt={skill.name}
                  className="colored"
                />
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkillsModal;
