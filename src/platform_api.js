crypto = require('node:crypto')
const fetch = require("node-fetch-commonjs")

const axios = require('axios')
const CryptoJS = require("crypto-js")
const helpers = require('./cryptoHelpers')


require('dotenv').config()

const base = process.env.BASE

var email = process.env.EMAIL
var password = process.env.PASSWORD

// Create nonce
function getRandom() {
  min = Math.ceil(1);
  max = Math.floor(100000000);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



axios.defaults.baseURL = base
axios.defaults.withCredentials = true


// // // // // const config = {
// // // // //     headers: { Authorization: `Bearer e5be984d-a913-4928-87b5-074474302b0b` }
// // // // // };





// async function signin(){
//   var point = 'identity/sign-in'
//   const resp = await axios.post(point, {
//     headers: {
//       'Content-Type': "application/json"
//     },
//     email: email,
//     password: password
//   })
//   .catch((error) => { console.error(error) })
//   connectAuthorize()
//   return resp
// }



async function signin(){
  let point = base + 'identity/sign-in'
  const resp = fetch(point, {
    body: JSON.stringify({ email, password }),
    method: 'POST',
    credentials: 'include',
    headers: {
        'Content-Type': "application/json"
    },
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .then(() => connectAuthorize())
}




// In case of successful authorization, cookies will be provided which are valid only for IdentityServer.

// Next, a request must be sent to obtain the xmlHttpRequest.responseURL code.
// {
//   "secondFactorRequired": true,
//   "message": "For your security, we have emailed you a one-time authentication code. Please enter this code below to proceed.",
//   "provider": "Email"
// }

// async function connectAuthorize(){
//   var challenge = helpers.deriveChallenge(helpers.generateRandomString(128))
//   var point = base + 'identity/connect/authorize'
//   const urlParams = new URLSearchParams({
//     client_id: "spa",
//     response_type: "code",
//     redirect_uri: "https://b2t-api-cmc-staging-5.flexprotect.org/identity/sign-in-done",
//     code_challenge: challenge,
//     code_challenge_method: "S256",
//     scope: "openid offline_access FrontOffice",
//     state: helpers.generateRandomString(10),
//     nonce: helpers.generateRandomString(10),
//   });
//   const resp = await axios.get(`${point}?${urlParams}`, {
//     // headers: {
//     //   'WWW-Authenticate': challenge
//     // },
//     withCredentials: true
//   })
//   .then((res) => {
//     console.log(res)
//   })
//   .catch((error) => {
//     console.error(error)
//   })
//   return resp
// }


async function connectAuthorize(){
  var verifier = helpers.generateRandomString(128)
  var challenge = await helpers.deriveChallenge(verifier)
  console.log("verifier", verifier)
  console.log("challenge", challenge)
  var point = base + 'identity/connect/authorize'
  const urlParams = new URLSearchParams({
    client_id: "spa",
    response_type: "code",
    redirect_uri: "https://b2t-api-cmc-staging-5.flexprotect.org/identity/sign-in-done",
    code_challenge: challenge,
    code_challenge_method: "S256",
    scope: "openid offline_access FrontOffice",
    state: helpers.generateRandomString(10),
    nonce: helpers.generateRandomString(10),
  });
  const response = await fetch(`${point}?${urlParams}`, {
    method: 'GET',
    credentials: 'include'
  })
  console.log("Atencion", response)
  // return new URLSearchParams(new URL(response.url).search).get('code');
}


signin(email, password)
// signin(email, password).then(res => { console.log(res) })



// async function getUserList(){
//   var furl = base + "/back-api/backoffice/users"
//   const resp = await axios.get(furl, {
//     headers: {
//       Autorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE2NTcyMjc2MDAsImV4cCI6MTY1NzIyNzY2MCwiaXNzIjoiaHR0cDovL2lkZW50aXR5LXNlcnZlci9pZGVudGl0eS8iLCJhdWQiOlsiaHR0cDovL2lkZW50aXR5LXNlcnZlci9pZGVudGl0eS9yZXNvdXJjZXMiLCJGcm9udE9mZmljZSJdLCJjbGllbnRfaWQiOiJzcGEiLCJzdWIiOiIzOWFjOTQwMS03N2UwLTQyNWMtYWM3Zi0wNjQ2NjdmNTJhZjIiLCJhdXRoX3RpbWUiOjE2NTcyMjc1OTgsImlkcCI6ImxvY2FsIiwicm9sZSI6IkFkbWluIiwiYWN0IjoicGxhY2Utb3JkZXIiLCJzY29wZSI6WyJvcGVuaWQiLCJGcm9udE9mZmljZSIsIm9mZmxpbmVfYWNjZXNzIl0sImFtciI6WyJwd2QiXX0.WpZCc15KssqXYRziRv0eTRuHc4fJIFAAbJER5LBmOVfnNrVpC5cLjRUeoTbbopZwR9ymQCWRBbi8_jSsRjDOYK3wSJ1DMMDpdD09-BN4xdOSwaFdqbsk8fQlgMsvIeeSI_x6MaqmU_Rbsd_Rt5kwOvx6wU-_seaTrYoNGmO4ehkf13lsP6-WepMrZVCPjbUToZwcALRZVPu-Vmoa2obxCjrJc7d8sw3AQAuYcbDMh063wsT6kdgFisOHCthMDTF3eYAEQfiXUKbqrGp-SNVD-88SwlPQ4wJ2sVSwxaBK0cO48_q2W_AjACwhxQ2TGBYjMPKsaFgVeLfb0W9k3c_8pg"
//     }
//   })
//   .then((res) => {
//     console.log(res)
//   })
//   .catch((error) => {
//     console.error(error.response)
//   })
//   return resp
// }


// getUserList()

