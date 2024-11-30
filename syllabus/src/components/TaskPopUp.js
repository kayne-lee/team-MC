import '../styles/tasksPopup.css';
import React, { useState } from "react";

const TaskPopup = ({ onSave }) => {
    const [title, setTitle] = useState("Add Title");
    const [description, setDescription] = useState("");
    const [time, setTime] = useState("2:00 PM");
    const [date, setDate] = useState("2024-11-09");

    // Close the popup if the backdrop (outside the content) is clicked
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onSave();
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch("YOUR_BACKEND_ENDPOINT", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description, time, date }),  // Include date in the request
            });

            if (!response.ok) throw new Error("Failed to save task");
            console.log("Task saved successfully!");

            onSave();
        } catch (error) {
            console.error(error);
            alert("Error saving task. Please try again.");
        }
    };

    return (
        <div className="popup" onClick={handleBackdropClick}>
            <div className="popup-content">
                <input
                    type="text"
                    className="popup-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => title === "" && setTitle("Add Title")}
                />
                <div className="popup-fields">
                    <div className="popup-row">
                        <input
                            type="date"
                            className="popup-pill"
                            value={date}
                            onChange={(e) => setDate(e.target.value)} // Update date state
                        />
                        <input
                            type="time"
                            className="popup-pill"
                            value={time}
                            onChange={(e) => setTime(e.target.value)} // Update time state
                        />
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
            </div>
        </div>
    );
};

export default TaskPopup;
