import axios from 'axios';
const qs = require('qs');

function GoogleService() {
    const apiURL = process.env.REACT_APP_NUCLEUS_API;
    let sv = {
        async getAccessToken(credential) {
            console.log("CRED",credential)
            const qs = new URLSearchParams({
                client_id: process.env.REACT_APP_CLIENT_ID,
                client_secret: process.env.REACT_APP_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: credential,
                redirect_uri: 'https://www.nucleusapp.ca/api/auth/callback/google',
              });
            const response = await axios.post('https://oauth2.googleapis.com/token', qs.toString(), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            console.log(response)
            localStorage.setItem("access_token", response["data"]["access_token"])
        },

        async createCalendarEvent(dueDate, title, weight, description, courseTitle){
            console.log("qa1",dueDate, title, weight, description, courseTitle)
            try {
                const authToken = localStorage.getItem("access_token")
                const calendarId = 'primary'; // Use 'primary' for the user's main calendar
                console.log("TOKE", authToken)
                const event = {
                  summary: `${courseTitle} - ${title}`,
                //   location: '123 Main St, New York, NY',
                  description: `Weight ${weight}
Description: ${description}`,
                  start: {
                    date: dueDate, // Format: YYYY-MM-DDTHH:MM:SS±HH:MM
                   
                  },
                  end: {
                    date: dueDate,
                  
                  },
                //   attendees: [
                //     { email: 'client@example.com' }, 
                //     { email: 'team@example.com' }
                //   ],
                //   reminders: {
                //     useDefault: false,
                //     overrides: [
                //       { method: 'email', minutes: 24 * 60 },  // Reminder 1 day before
                //       { method: 'popup', minutes: 10 },       // Reminder 10 mins before
                //     ],
                //   },
                  colorId: '3',  // Yellow color ID
                };
            
                const response = await axios.post(
                  `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
                  event,
                  {
                    headers: {
                      Authorization: `Bearer ${authToken}`,
                    
                      'Content-Type': 'application/json',
                    },
                  }
                );
            
                console.log('Event created:', response.data);
              } catch (error) {
                console.error('Error creating event:', error.response?.data || error.message);
              }
        }
    }

    return sv;
 
}

export default GoogleService;