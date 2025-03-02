import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function MongoService() {
    const navigate = useNavigate()
    const apiURL = process.env.REACT_APP_NUCLEUS_API;
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
                    
                    fetch(`${apiURL}/api/data/addRandomTask`, requestOptions)
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
        async googleLoginUser(email,firstName,lastName) {
           
            let data = JSON.stringify({
                "googleEmail": email,
                "password": "test123",
                "email": email,
                "firstName": firstName,
                "lastName": lastName
              });
              
              let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${apiURL}/auth/googlelogin`,
                headers: { 
                  'Content-Type': 'application/json'
                },
                data : data
              };
              
              axios.request(config)
              .then((response) => {
             
                localStorage.removeItem("googleLogin");
                localStorage.setItem("jwt", response.data);
                navigate("/");
              })
              .catch((error) => {
                console.log(error);
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
                    
                    fetch(`${apiURL}/api/data/saveCourse`, requestOptions)
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
        async updateNofitications(newNotifs) {
          const token = localStorage.getItem("jwt");
          let data = JSON.stringify({
              "notificationCount": newNotifs
  
            });
            
            let config = {
              method: 'put',
              maxBodyLength: Infinity,
              url: `${apiURL}/auth/notifications`,
              headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
              },
              data : data
            };
            
            
            axios.request(config)
            .then((response) => {
              return response
            })
            .catch((error) => {
              console.log(error);
            });
      },
    }

    return sv;
 
}

export default MongoService;