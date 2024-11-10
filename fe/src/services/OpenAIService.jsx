import axios from 'axios';


function OpenAIService() {
    let sv = {
        
        openAICall(inputText) {
            console.log(inputText)
            let data = JSON.stringify({
                "input": "hey hows it going",
               
              });
          
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:8080/api/data/openai',
                headers: { 
                  'Content-Type': 'application/json', 
                  'Authorization': "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2NzJlNjM5M2ViNTNiYzYzZTQ2Yzc2ZTUiLCJleHAiOjE3MzExNDE4NDQsImlhdCI6MTczMTEwNTg0NH0.9ne8Cg1Fn5hcSPUwfGlF-9EBIQ9zlIJH56k3IBzH4KA"
                },
                data : data
              };     
            axios.request(config)
            .then((response) => {
            console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
            console.log(error);
            });
        },

    }

    return sv;
 
}

export default OpenAIService;