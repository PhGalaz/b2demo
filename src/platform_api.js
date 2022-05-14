const axios = require('axios')
const crypto = require("crypto");

const base = 'https://b2t-api-cmc-staging-5.flexprotect.org/'
// const baseX = 'https://b2t-api-staging-5.flexprotect.org/'
const base2 = 'https://b2t-api-cmc-staging-5.flexprotect.org/marketdata/cmc/v1/'


var email = "test+1@galaz.de"
var password = "CapHold123!"


// const config = {
//     headers: { Authorization: `Bearer e5be984d-a913-4928-87b5-074474302b0b` }
// };


function getRandom() {
  min = Math.ceil(1);
  max = Math.floor(100000000);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sign(payload) {
  const Sign = crypto
    .createHmac('sha512', api_key_private)
    .update(payload)
    .digest('hex')
    .toUpperCase()
  return Sign
}

function base64URLEncode(str) {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
}

function sha256(buffer) {
    return crypto.createHash('sha256').update(buffer).digest()
}


// var XMLHttpRequest = require('xhr2')
// var xhr = new XMLHttpRequest()
//
//
// var ts = new Date().toISOString().slice(0,-5)
//
// var dataQueryString = '?email=test+1@galaz.de&password=CapHold123!'
//
// var signature = CryptoJS.HmacSHA256(dataQueryString ,api_key_private).toString(CryptoJS.enc.Hex);
//
// var ourRequest = new XMLHttpRequest();
//
// var url = base + 'identity/sign-in'
//
// ourRequest.open('POST', url, true);
// ourRequest.setRequestHeader('email','test+1@galaz.de')
// ourRequest.setRequestHeader('password','CapHold123!')
//
// ourRequest.onload = function(){
//     ourData = JSON.parse(ourRequest.responseText);
//     console.log(ourData);
// }
// ourRequest.send();










// sign-in request must be sent to obtain cookies.
// {
//   "secondFactorRequired": true,
//   "message": "For your security, we have emailed you a one-time authentication code. Please enter this code below to proceed.",
//   "provider": "Email"
// }
// { secondFactorRequired: false,
//   account:
//    { nickname: 'CapitalHolding',
//      email: 'test+1@galaz.de',
//      id: '39ac9401-77e0-425c-ac7f-064667f52af2' } }


async function signin(email, password){
  const transport = axios.create({
    withCredentials: true
  })
  var furl = base + 'identity/sign-in'
  let resp = await transport.post(furl, {
    email: email,
    password: password
  })
  .then((res) => {
    console.log(res)
  })
  .catch((error) => {
    console.error(error.response.data)
  })
  var challenge = base64URLEncode(sha256(base64URLEncode(crypto.randomBytes(32))))
  furl = base + 'identity/connect/authorize'
  resp = await transport.get(furl, {
    // headers: {
    //   'WWW-Authenticate': challenge
    // },
    params: {
      scope: 'openid profile FrontOffice BackOffice offline_access',
      response_type: 'code',
      client_id: 'spa_admin',
      redirect_uri: base + 'sign-in-done',
      code_challenge: challenge,
      code_challenge_method: 'S256',
      nonce: 45487
    }
  })
  .then((res) => {
    console.log(res)
  })
  .catch((error) => {
    console.error(error)
  })
  return resp
}








// In case of successful authorization, cookies will be provided which are valid only for IdentityServer.

// Next, a request must be sent to obtain the xmlHttpRequest.responseURL code.
// {
//   "secondFactorRequired": true,
//   "message": "For your security, we have emailed you a one-time authentication code. Please enter this code below to proceed.",
//   "provider": "Email"
// }

async function connectAuthorize(){
  const transport = axios.create({
    withCredentials: true
  })
  var challenge = base64URLEncode(sha256(base64URLEncode(crypto.randomBytes(32))))
  var furl = base + 'identity/connect/authorize'
  const resp = await axios.get(furl, {
    // headers: {
    //   'WWW-Authenticate': challenge
    // },
    params: {
      scope: 'openid profile FrontOffice BackOffice offline_access',
      response_type: 'code',
      client_id: 'spa_admin',
      redirect_uri: base + 'sign-in-done',
      code_challenge: challenge,
      code_challenge_method: 'S256',
      nonce: 45487
    }
  })
  .then((res) => {
    console.log(res)
  })
  .catch((error) => {
    console.error(error)
  })
  return resp
}









signin(email, password)
// connectAuthorize()
