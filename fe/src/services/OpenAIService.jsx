function OpenAIService() {
    let sv = {
        
        openAICall(inputText) {
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2NzNhODVmZjg3MGU2YzQ0Njk4YTJmOGMiLCJleHAiOjE3MzIwMTM3NjAsImlhdCI6MTczMTk3Nzc2MH0.Uzs-cTSIMUCKHR4NKQ2Yg4w_zziP3M14Lk_LDKfsICg");
            let data = JSON.stringify({
                "input": inputText
              });
          
              const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: data,
                redirect: "follow"
              };
              
              fetch("http://localhost:8080/api/data/openai", requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.error(error));
        },

    }

    return sv;
 
}

export default OpenAIService;