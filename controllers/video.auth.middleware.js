
const axios = require('axios')

let API_AUTH_TOKEN = ""

axios.post('sandbox.api.video/auth/api-key', {
  "apiKey": "SkGQnAbt0xEwWBiglfTPtITEMQYY7fUZ8bQ95mfHKz"
})
.then(function (response) {
  API_AUTH_TOKEN = response.data.access_token
  console.log(API_AUTH_TOKEN)
})
.catch(function (error) {
  console.log(error);
  console.log('ERROR')
})

export default API_AUTH_TOKEN;