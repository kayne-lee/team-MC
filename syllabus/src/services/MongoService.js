function MongoService() {
    let sv = {
        addRandomTask(jsonData) {
            return new Promise((resolve, reject) => {
              // Asynchronous operation here
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                const token = localStorage.getItem("jwt");
                myHeaders.append("Authorization", `Bearer ${token}`);
                    let data = JSON.stringify(jsonData);
                
                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        body: data,
                        redirect: "follow"
                    };
                    
                    fetch("http://localhost:8080/api/data/addRandomTask", requestOptions)
                    .then((response) => {
                    if (!response.ok) {
                        // Handle HTTP errors
                        reject(new Error(`HTTP error! status: ${response.status}`));
                    }
                    // Parse the response as text or JSON
                    return response.json(); // Use .json() if you expect JSON data
                    })
                    .then((responseText) => {
                    console.log("Response Text:", responseText);
              
                    resolve(responseText); // Resolve with the actual response text
                    })
                    .catch((error) => {
                    console.error("Fetch error:", error);
                    reject(error); // Reject the promise in case of errors
                    });
            });
        },
        saveCourseInfo(jsonData) {
            return new Promise((resolve, reject) => {
              // Asynchronous operation here
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                const token = localStorage.getItem("jwt");
                myHeaders.append("Authorization", `Bearer ${token}`);
                    let data = JSON.stringify(jsonData);
                
                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        body: data,
                        redirect: "follow"
                    };
                    
                    fetch("https://api.nucleusapp.ca:8443/api/data/saveCourse", requestOptions)
                    .then((response) => {
                    if (!response.ok) {
                        // Handle HTTP errors
                        reject(new Error(`HTTP error! status: ${response.status}`));
                    }
                    // Parse the response as text or JSON
                    return response.json(); // Use .json() if you expect JSON data
                    })
                    .then((responseText) => {
                    console.log("Response Text:", responseText);
              
                    resolve(responseText); // Resolve with the actual response text
                    })
                    .catch((error) => {
                    console.error("Fetch error:", error);
                    reject(error); // Reject the promise in case of errors
                    });
            });
        }
    }

    return sv;
 
}

export default MongoService;