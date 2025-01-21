function OpenAIService() {
    const apiURL = process.env.REACT_APP_NUCLEUS_API;
    let sv = {
        openAICall(inputText) {
            return new Promise((resolve, reject) => {
              // Asynchronous operation here
                const myHeaders = new Headers();
                const token = localStorage.getItem("jwt");
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", `Bearer ${token}`);
                    let data = JSON.stringify({
                        "input": inputText
                    });
                
                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        body: data,
                        redirect: "follow"
                    };
                    
                    fetch(`${apiURL}/api/data/openai`, requestOptions)
                    .then((response) => {
                    if (!response.ok) {
                        // Handle HTTP errors
                        reject(new Error(`HTTP error! status: ${response.status}`));
                    }
                    // Parse the response as text or JSON
                    return response.json(); // Use .json() if you expect JSON data
                    })
                    .then((responseText) => {
                    // for (const obj of responseText.assignments) {
                    //     console.log(obj)
                    //     obj.weight = parseFloat(obj.weight.replace('%', ''))
                    //     obj.dueDate = new Date(obj.dueDate)
                    // }
                    resolve(responseText); // Resolve with the actual response text
                    })
                    .catch((error) => {
                    console.log("Fetch error:", error);
                    reject(error); // Reject the promise in case of errors
                    });
            });
        },

        getCourses() {
            const myHeaders = new Headers();
            const token = localStorage.getItem("jwt");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
            };

            fetch(`${apiURL}/api/data/allCourses`, requestOptions)
            .then((response) => response.text())
            .catch((error) => console.error(error));
                    }
    }

    return sv;
 
}

export default OpenAIService;