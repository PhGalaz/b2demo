const axios = require('axios')
const crypto = require("crypto")
//
// const axiosCookieJarSupport = require("axios-cookiejar-support").default;
// const tough = require("tough-cookie");
//
// // const wrapper = require('axios-cookiejar-support')
// // var tough = require('tough-cookie')
// // var CookieJar = tough.Cookie
// //
// // const jar = new CookieJar()
// // const client = wrapper(axios.create({ jar }))
//
require('dotenv').config()

const base = process.env.BASE
const baseX = process.env.BASEX
const base2 = process.env.BASE2

var email = process.env.EMAIL
var password = process.env.PASSWORD
//
axios.defaults.baseURL = base
axios.defaults.withCredentials = true
//
//
//
// // const config = {
// //     headers: { Authorization: `Bearer e5be984d-a913-4928-87b5-074474302b0b` }
// // };
//
//
function getRandom() {
  min = Math.ceil(1);
  max = Math.floor(100000000);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// //
// // function sign(payload) {
// //   const Sign = crypto
// //     .createHmac('sha512', api_key_private)
// //     .update(payload)
// //     .digest('hex')
// //     .toUpperCase()
// //   return Sign
// // }
// //
function base64URLEncode(str) {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
}

function sha256(buffer) {
    return crypto.createHash('sha256').update(buffer).digest()
}
//
//
//
//
//
//
//
// // var XMLHttpRequest = require('xhr2')
// // var xhr = new XMLHttpRequest()
// //
// //
// // var ts = new Date().toISOString().slice(0,-5)
// //
// // var dataQueryString = '?email=test+1@galaz.de&password=CapHold123!'
// //
// // var signature = CryptoJS.HmacSHA256(dataQueryString ,api_key_private).toString(CryptoJS.enc.Hex);
// //
// // var ourRequest = new XMLHttpRequest();
// //
// // var url = base + 'identity/sign-in'
// //
// // ourRequest.open('POST', url, true);
// // ourRequest.setRequestHeader('email','test+1@galaz.de')
// // ourRequest.setRequestHeader('password','CapHold123!')
// //
// // ourRequest.onload = function(){
// //     ourData = JSON.parse(ourRequest.responseText);
// //     console.log(ourData);
// // }
// // ourRequest.send();
//
//
//
//
//
//
//
//
//
//
// // sign-in request must be sent to obtain cookies.
// // {
// //   "secondFactorRequired": true,
// //   "message": "For your security, we have emailed you a one-time authentication code. Please enter this code below to proceed.",
// //   "provider": "Email"
// // }
// // { secondFactorRequired: false,
// //   account:
// //    { nickname: 'CapitalHolding',
// //      email: 'test+1@galaz.de',
// //      id: '39ac9401-77e0-425c-ac7f-064667f52af2' } }






const instance = axios.create({
  withCredentials: true,
  baseURL: base
})


async function signin(){
  var point = 'identity/sign-in'
  let resp = await instance.post(point, {
    email: email,
    password: password
  })
  .then(async (res) => {
    console.log(res.headers)
    var challenge = base64URLEncode(sha256(base64URLEncode(crypto.randomBytes(32))))
    var point = 'identity/connect/authorize'
    const resp = await instance.get(point, {
      headers: {
        Cookie0: res.headers['set-cookie'][0],
        Cookie1: res.headers['set-cookie'][1]
      },
      params: {
        scope: 'openid profile FrontOffice BackOffice offline_access',
        response_type: 'code',
        client_id: 'spa_admin',
        redirect_uri: base + 'sign-in-done',
        code_challenge: challenge,
        code_challenge_method: 'S256',
        nonce: getRandom()
      }
    })
    .then((res) => { console.log(res) })
    .catch((error) => { console.error(error) })
  })
  .catch((error) => { console.error(error) })
  return resp
}





//
//
// // const transport = axios.create({
// //   withCredentials: true
// // })
//
//
// // In case of successful authorization, cookies will be provided which are valid only for IdentityServer.
//
// // Next, a request must be sent to obtain the xmlHttpRequest.responseURL code.
// // {
// //   "secondFactorRequired": true,
// //   "message": "For your security, we have emailed you a one-time authentication code. Please enter this code below to proceed.",
// //   "provider": "Email"
// // }
//
// async function connectAuthorize(){
//   var challenge = base64URLEncode(sha256(base64URLEncode(crypto.randomBytes(32))))
//   var point = 'identity/connect/authorize'
//   const resp = await axios.get(point, {
//     // headers: {
//     //   'WWW-Authenticate': challenge
//     // },
//     params: {
//       scope: 'openid profile FrontOffice BackOffice offline_access',
//       response_type: 'code',
//       client_id: 'spa_admin',
//       redirect_uri: base + 'sign-in-done',
//       code_challenge: challenge,
//       code_challenge_method: 'S256',
//       nonce: 45487
//     }
//   })
//   .then((res) => {
//     console.log(res)
//   })
//   .catch((error) => {
//     console.error(error)
//   })
//   return resp
// }
//
//
//
//
//
//
//
//
//
signin(email, password)
// connectAuthorize()
