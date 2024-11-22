import '../styles/tasksPage.css';
import Navbar from '../navbar/Navbar';

const TasksPage = () => {
    return (
        <div className=" tasks-page parent min-h-screen">
            <Navbar />
            <h1 className="header">Upcoming Tasks</h1>
            <div className="layout-container ">
                {/* Left Large Box */}
                {/* CURRENT DAY BOX */}
                <div className="left-box">
                    <h2 className="main-date-header">Tuesday, November 9th</h2>
                    <div className="task-list">
                        <h3 className="main-task-header">QTMA Work</h3>
                        <ul className="main-list">
                            <li>Create Slideshow</li>
                            <li>Design Logos</li>
                            <li>Customer Research</li>
                        </ul>
                        <h3 className="main-task-header">MATH 121: Calculus</h3>
                        <ul>
                            <li>Week 8 Videos</li>
                            <li>Week 8 WebWork</li>
                            <li>Start Week 8 Tutorial</li>
                        </ul>
                        <h3 className="main-task-header">CISC 101: Computer Science</h3>
                        <ul>
                            <li>Runestone Week 8: Files</li>
                        </ul>
                    </div>
                </div>

                {/* Right Grid of Boxes */}
                {/* UPCOMING DAY BOXES*/}
                <div className="right-grid">
                    <div className="grid-box">
                        <h3 className="date-header">Wednesday, November 10th</h3>
                        <h3 className="task-header">English Paper</h3>
                        <ul className="sub-list">
                            <li>Look Over Rubric</li>
                            <li>Brainstorm Ideas</li>
                            <li>Customer Research</li>
                        </ul>
                    </div>
                    <div className="grid-box">
                        <h3 className="date-header">Friday, November 12th</h3>
                        <h3 className="task-header">Finish English Paper</h3>
                        <ul className="sub-list">
                            <li>Zoom Meeting with Team</li>
                            <li>Help Ryan with slideshow ideas</li>
                            <li>Work Cited</li>
                        </ul>
                    </div>
                    <div className="grid-box">
                        <h3 className="date-header">Saturday, November 13th</h3>
                        <h3 className="task-header">QTMA</h3>
                        <ul className="sub-list">
                            <li>Meeting at 4:00 PM</li>
                        </ul>
                    </div>
                    <div className="grid-box">
                        <h3 className="date-header">Sunday, November 14th</h3>
                        <h3 className="task-header">QTMA</h3>
                        <ul className="sub-list">
                            <li>Meeting at 4:00 PM</li>
                        </ul>
                    </div>
                    <div className="grid-box">
                        <h3 className="date-header">Monday, November 15th</h3>
                        <h3 className="task-header">New Project</h3>
                        <ul className="sub-list">
                            <li>Research Ideas</li>
                            <li>Create Draft</li>
                        </ul>
                    </div>
                    <div className="grid-box">
                        <h3 className="date-header">Tuesday, November 16th</h3>
                        <h3 className="task-header">Presentation</h3>
                        <ul className="sub-list">
                            <li>Finalize Slides</li>
                            <li>Practice Speech</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TasksPage;