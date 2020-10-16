
const axios = require('axios')

let API_AUTH_TOKEN = ""
exports.uploadAuth = async (req, res, next) => {
axios.post('sandbox.api.video/auth/api-key', {
  "apiKey": "SkGQnAbt0xEwWBiglfTPtITEMQYY7fUZ8bQ95mfHKz"
})
.then(function (response) {
  API_AUTH_TOKEN = response.data.access_token
  next(API_AUTH_TOKEN)
})
.catch(function (error) {
  console.log(error);
  console.log('ERROR')
})
}