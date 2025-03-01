import React from 'react';
import '../styles/listView.css';

const ListView = () => {
  return (
    <div className="list-view">
      <div className="list-container">
        <div className="date-section">
          <h2>Mon 20</h2>
          <div className="tasks">
            <div className="task-item">
              <div className="task-left">
                <input type="checkbox" className="checkbox" />
                <span>Assignment 1</span>
              </div>
              <div className="task-right">
                <span className="time">11:59 PM</span>
                <div className="class-tag">CISC 121</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListView;