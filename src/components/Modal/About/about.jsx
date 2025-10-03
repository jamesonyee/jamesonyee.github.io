import './about.css';

function About() {
  return (
    <div className="about-container">
      <section className="about-intro">
        <h2>About me</h2>
        <p>
            I am a creative technologist based in the San Francisco Bay Area. 
            I am interested in using my computer science background to build tools 
            and simulations that bridge the gap between creative vision and technical execution. 
            My goal is to tell meaningful stories through the power of computer graphics. 
        </p>
      </section>

      <section className="about-education">
        <h2>Education</h2>
        <div className="education-grid">
          <div className="education-item">
            <div className="education-header">
              <img
                src="/icons/osulogo.jfif"
                alt="Oregon State University"
                className="education-logo"
              />
              <h3>Oregon State University</h3>
            </div>
            <div className="education-details">
              <p className="degree">Bachelor of Computer Science</p>
              <p className="dates">2020–2024</p>
              <p className="honors">Dean's Honor List 2024</p>
            </div>
          </div>

          <div className="education-item">
            <div className="education-header">
              <img
                src="/icons/block-s-right.png"
                alt="Stanford University"
                className="education-logo"
              />
              <h3>Stanford University</h3>
            </div>
            <div className="education-details">
              <p className="degree">Graduate Certificate, Visual Computing</p>
              <p className="dates">2025–2027</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;