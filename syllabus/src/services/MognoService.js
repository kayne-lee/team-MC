function MongoService() {
    let sv = {
        saveCourseInfo(jsonData) {
            return new Promise((resolve, reject) => {
              // Asynchronous operation here
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2NzJlNjM5M2ViNTNiYzYzZTQ2Yzc2ZTUiLCJleHAiOjE3MzIyNDI2OTAsImlhdCI6MTczMjIwNjY5MH0.8490DppuWkgr4s02Eqpq0ZJuqi1qu26J1TNTDI6JFcM");
                    let data = JSON.stringify(jsonData);
                
                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        body: data,
                        redirect: "follow"
                    };
                    
                    fetch("http://localhost:8080/api/data/saveCourse", requestOptions)
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