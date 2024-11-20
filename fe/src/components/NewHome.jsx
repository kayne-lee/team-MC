import '../styles/newHome.css';

const NewHome = () => {
    return (
        <div className="parent min-h-screen">
            <h1 className="header">Upcoming Tasks</h1>
            <div className="layout-container ">
                {/* Left Large Box */}
                <div className="left-box">
                    <h2>Tuesday, November 9th</h2>
                    <div className="task-list">
                        <h3>QTMA Work</h3>
                        <ul>
                            <li>Create Slideshow</li>
                            <li>Design Logos</li>
                            <li>Customer Research</li>
                        </ul>
                        <h3>MATH 121: Calculus</h3>
                        <ul>
                            <li>Week 8 Videos</li>
                            <li>Week 8 WebWork</li>
                            <li>Start Week 8 Tutorial</li>
                        </ul>
                        <h3>CISC 101: Computer Science</h3>
                        <ul>
                            <li>Runestone Week 8: Files</li>
                        </ul>
                    </div>
                </div>

                {/* Right Grid of Boxes */}
                <div className="right-grid">
                    <div className="grid-box">
                        <h3>Wednesday, November 10th</h3>
                        <p>English Paper</p>
                        <ul>
                            <li>Look Over Rubric</li>
                            <li>Brainstorm Ideas</li>
                            <li>Customer Research</li>
                        </ul>
                    </div>
                    <div className="grid-box">
                        <h3>Friday, November 12th</h3>
                        <p>Finish English Paper</p>
                        <ul>
                            <li>Zoom Meeting with Team</li>
                            <li>Help Ryan with slideshow ideas</li>
                            <li>Work Cited</li>
                        </ul>
                    </div>
                    <div className="grid-box plus-box">
                        <span>+</span>
                    </div>
                    <div className="grid-box">
                        <h3>Saturday, November 13th</h3>
                        <p>QTMA</p>
                        <ul>
                            <li>Meeting at 4:00 PM</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewHome;