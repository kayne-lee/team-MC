import '../styles/tasksPopup.css';
import React, { useState, useEffect } from "react";
import MongoService from '../services/MongoService';

const TaskPopup = ({ data, onSave }) => {
    const [title, setTitle] = useState("Add Title");
    const [description, setDescription] = useState("");
    const [dateTime, setDateTime] = useState(""); // State to hold date and time
    const mongoService = MongoService();

    // Close the popup if the backdrop (outside the content) is clicked
    const handleCancel = (e) => {
        onSave({});
    };

    useEffect(() => {
        console.log(data)
        console.log(dateTime)
        if (dateTime == "") {
            if (data["date"]) {
                const date = new Date(data["date"]);
                date.setHours(8, 0, 0, 0);
                const isoString = date.toISOString().slice(0, 16);
                console.log(isoString)
                setDateTime(isoString)
             
            }
        }
      }, []);
    const handleSave = async () => {
        try {
            const response = await mongoService.addRandomTask({
                "title": title,
                "dueDate": dateTime,
                "description": description
              })

            onSave({
                "title": title,
                "dueDate": dateTime,
                "description": description
              }); // Close the popup
        } catch (error) {
            console.error(error);
            alert("Error saving task. Please try again.");
        }
    };

    return (
        <div className="popup">
            <div className="popup-content">
                
                <input
                    type="text"
                    className="popup-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => title === "" && setTitle("Add Title")}
                />
                <div className="popup-fields">
                    <div className="popup-row mb-[15px]">
                        <div>
                        <input
                            type="datetime-local"
                            className="popup-pill"
                            value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)} // Update date-time state
                            />
                        {/* <input
                            type="date"
                            className="popup-pill"
                            value={date}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setDate(e.target.value)} // Update date state
                            />
                        </div>
                        <div>

                        <input
                            type="time"
                            className="popup-pill"
                            value={time}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setTime(e.target.value)} // Update time state
                            /> */}
                        </div>
                    </div>
                    <label htmlFor="description" className="popup-label">Description</label>
                    <textarea
                        id="description"
                        className="popup-textarea"
                        placeholder="Enter task description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <button onClick={handleSave} className="popup-save-btn">Save</button>
                <button onClick={handleCancel} className="popup-save-btn">Cancel</button>
            </div>
        </div>
    );
};

export default TaskPopup;
