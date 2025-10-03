import { useState } from 'react'
import './folio.css'

function ProjectCard ({project}) {
    const [isFlipped, setFlipped] = useState(false)

    const handleClick = () => {
        setFlipped(!isFlipped)
    }

    // Function to render media based on type
    const renderMedia = () => {
        if (!project.media) return null;
        
        const { type, content } = project.media;
        
        switch(type) {
            case 'image':
                return (
                    <div className="media-container">
                        <img src={content} alt={project.title} className="project-media" />
                    </div>
                );
            case 'video':
                return (
                    <div className="media-container">
                        <iframe 
                            src={content} 
                            className="project-media"
                            title={project.title}
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                );
            case 'youtube':
                const getYouTubeId = (url) => {
                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                    const match = url.match(regExp);
                    return (match && match[2].length === 11) ? match[2] : null;
                };
                
                const videoId = getYouTubeId(content);
                if (videoId) {
                    return (
                        <div className="media-container youtube-video">
                            <iframe 
                                src={`https://www.youtube.com/embed/${videoId}`}
                                className="project-media"
                                title={project.title}
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    );
                }
                return null;
            case 'custom':
                // For custom HTML content
                return (
                    <div className="media-container" dangerouslySetInnerHTML={{ __html: content }} />
                );
            default:
                return null;
        }
    }

    return (
        <div className={`project-card ${isFlipped ? 'flipped' : ''}`} onClick={handleClick}>
            <div className='card-inner'>
                {/* Front of the card */}
                <div className='card-front'>
                    <div className='card-image'>
                        <img src={project.image || "/api/placeholder/300/200"} alt={project.title} />
                    </div>
                    <div className='card-content'>
                        <img src={project.thumbnail} />
                        <h3>{project.title}</h3>
                        <p>{project.shortDesc}</p>
                    </div>
                </div>
                
                {/* Back of the card */}
                <div className='card-back'>
                    <button className="close-details" onClick={(e) => {
                        e.stopPropagation();
                        setFlipped(false);
                    }}>
                        &times;
                    </button>
                    
                    <h3>{project.title}</h3>
                    
                    {/* Media section */}
                    {project.media && renderMedia()}
                    
                    <p className='full-description'>{project.fullDesc}</p>
                    
                    <div className='tech-stack'>
                        {project.technologies && (
                            <>
                                <h4>Technologies Used:</h4>
                                <div className="tech-tags">
                                    {project.technologies.map((tech, index) => (
                                        <span key={index} className="tech-tag">{tech}</span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    
                    <div className='project-links'>
                        {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                                View Project Details
                            </a>
                        )}
                        {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                                GitHub Repository
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function FolioModal({ onClose }){
    const projects = [
        {
            id: 1,
            title: "Auto Turntable Plugin",
            shortDesc: "A blender addon for artists",
            fullDesc: "An automated turntable camera generator with intelligent scene analysis and a debug UI for artistic fine-tuning. This solution is designed to streamline camera setup workflows, cutting manual set up time to keep pace with rapid productions.",
            image: "./imgs/blenderaddon.jpg",
            technologies: ["Blener", "Python",],
            media: {
                type: "youtube",
                content: "https://www.youtube.com/watch?v=LdALoCeGTvo" // Example video embed
            }
        },
        {
            id: 2,
            title: "Gestner Waves",
            shortDesc: "Procedural wave simulator",
            fullDesc: " a real-time Gerstner wave simulation using OpenGL and GLSL with custom vertex/fragment shaders. Implemented interactive parameter controls to dynamically manipulate wave properties and enhance physical accuracy.",
            image: "./imgs/waves.png",
            link: "https://jamesonyee.github.io/waves.html",
            technologies: ["WebGL", "GLSL"],
            media: {
                type: "youtube",
                content: "https://youtu.be/MLgClEmjfCY" 
            }
        },
        {
            id: 3,
            title: "Flight Simulator",
            shortDesc: "A realistic flight simulation experience",
            fullDesc: "This project is a custom flight simulation experience built in Unreal Engine 5, combining real-time geospatial data with accurate flight dynamics. Using the JSBSim plugin, the simulator models realistic aircraft behavior, while Cesium integrates high-resolution 3D terrain and satellite imagery for a truly global environment.",
            image: "./imgs/jet.png",
            link: "https://jamesonyee.github.io/flightsim",
            technologies: ["Unreal Engine", "Blueprints", "Blender"],
            media: {
                type: "youtube",
                content: "https://www.youtube.com/watch?v=or1LfXo2FX0" // Example video
            }
        },
        {
            id: 4,
            title: "AchorViz",
            shortDesc: "Magic Leap 2 model visualizer",
            fullDesc: "ML2-AnchorViz is a Unity-based Augmented Reality (AR) project that leverages the capabilities of Magic Leap 2 and Unity’s AR Foundation. This application allows users to place four anchor points in a real-world environment and visualize 3D models within the defined plane.",
            image: "./imgs/ml2jet.png",
            technologies: ["Unity", "Magic Leap 2",],
            media: {
                type: "youtube",
                content: "https://www.youtube.com/watch?v=epFFwjtkQlc" // Example video embed
            }
        },
        
    ]

        return (
        <>
        <div className="portfolio-header">
            <h2>Portfolio</h2>
        </div>
        <div className='projects-grid'>
            {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
        </>
    )
}

export default FolioModal