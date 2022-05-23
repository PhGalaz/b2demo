const axios = require('axios')
var CryptoJS = require("crypto-js")
const queryString = require('query-string')

require('dotenv').config()

const base = process.env.BASE
const baseX = process.env.BASEX
const base2 = process.env.BASE2

const api_key_public = process.env.API_KEY_PUBLIC
const api_key_private = process.env.API_KEY_PRIVATE





function getRandom() {
  min = Math.ceil(1);
  max = Math.floor(100000000);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function sign(payload) {
  const Sign = CryptoJS
    .HmacSHA512(payload, api_key_private)
    .toString(CryptoJS.enc.Hex)
    .toUpperCase()
  return Sign
}



// Returns up-to-date information about all currency pairs (instruments) supported by the exchange.
// zec_eth:
//  { baseAsset: 'zec',
//    quoteAsset: 'eth',
//    minAmount: 0,
//    priceDeviation: 0,
//    hidden: 1,
//    makerFee: 0,
//    makerFeeLimit: 0,
//    takerFee: 0.001,
//    takerFeeLimit: 0,
//    priceScale: 8,
//    amountScale: 8,
//    createdAt: '2021-12-03T14:35:48.438029Z',
//    updatedAt: '2022-04-05T14:45:07.388344Z',
//    status: 'Open',
//    side: 'BuySell' },

async function supportedInstruments(){
  var furl = base + 'frontoffice/api/info'
  const resp = await axios.get(furl, {})
  .then((res) => {
    console.log(res.data)
  })
  .catch((error) => {
    console.error(error.response.data)
  })
  return resp
}






// Returns an order book information for a specified currency pair (instrument).
// { instrument: 'eth_btc',
//   bids: [],
//   asks: [],
//   version: 0,
//   askTotalAmount: 0,
//   bidTotalAmount: 0,
//   snapshot: true }

async function orderBookSnapshot(instrument){
  var furl = base + 'marketdata/instruments/' + instrument + '/depth'
  const resp = await axios.get(furl, {})
  .then((res) => {
    console.log(res.data)
  })
  .catch((error) => {
    console.error(error.response.data)
  })
  return resp
}







// Returns candlestick chart data for a specified currency pair (instrument).
// {
//   "success": true,
//   "instrument": "btc_usdt",
//   "data": [
//     {
//       "instrument": "btc_usdt",
//       "start": "2019-03-13T09:00:00Z",
//       "end": "2019-03-13T10:00:00Z",
//       "low": 3842.855,
//       "high": 3855.445,
//       "volume": 4,
//       "quoteVolume": 0,
//       "open": 3855.105,
//       "close": 3842.855
//     },
//     {
//       "instrument": "btc_usdt",
//       "start": "2019-03-13T10:00:00Z",
//       "end": "2019-03-13T11:00:00Z",
//       "low": 3834.355,
//       "high": 3848.855,
//       "volume": 26,
//       "quoteVolume": 0,
//       "open": 3842.865,
//       "close": 3835.655
//     }
//   ],
//   "startDateTime": "2019-03-13T09:00:00Z",
//   "endDateTime": "2019-03-13T11:00:00Z"
// }

async function instrumentCandles(instrument,startDate,endDate,type,count){
  var furl = base + 'marketdata/instruments/' + instrument + '/history'
  const resp = await axios.get(furl, {
    params: {
      startDate: startDate,
      endDate: endDate,
      type: type
    }
  })
  .then((res) => {
    console.log(res.data)
  })
  .catch((error) => {
    console.error(error.response.data)
  })
  return resp
}







////////////////////////////////// base2 //////////////////////////////////






// assetInfo()
// Returns up-to-date information about supported assets.
// {
//   "BTC": {
//     "name": "btc",
//     "can_withdraw": true,
//     "can_deposit": true,
//     "min_withdraw": "0.00000001",
//     "max_withdraw": "100000000"
//   },
//   "USDT": {
//     "name": "usdt",
//     "can_withdraw": true,
//     "can_deposit": true,
//     "min_withdraw": "0.00000001",
//     "max_withdraw": "100000000"
// }

async function assetInfo(){
  var furl = base2 + 'asset'
  const resp = await axios.get(furl, {})
  .then((res) => {
    console.log(res)
  })
  .catch((error) => {
    console.error(error.response)
  })
  return resp
}








// summary()
// Returns summary information about a specified market. The data is aggregated for the last 24 hours.
// {
//   "BTC_USDT": {
//     "id": "btc_usdt",
//     "last": "10978.93578",
//     "lowestAsk": "10979.0",
//     "highestBid": "10978.71",
//     "percentChange": "0.0813730364297798727996051454",
//     "baseVolume": "6.47119743",
//     "quoteVolume": "70829.9781692126756",
//     "isFrozen": "0",
//     "high24hr": "10985.0049",
//     "low24hr": "10857.95376"
//   },
//   "BTC_USD": {
//     "id": "btc_usd",
//     "last": "0",
//     "lowestAsk": "0",
//     "highestBid": "0",
//     "percentChange": "0",
//     "baseVolume": "0",
//     "quoteVolume": "0",
//     "isFrozen": "0",
//     "high24hr": "0",
//     "low24hr": "0"
//   }
// }

async function summary(){
  var furl = base2 + 'summary'
  console.log(base2)
  const resp = await axios.get(furl, {})
  .then((res) => {
    console.log(res)
  })
  .catch((error) => {
    console.error(error.response)
  })
  return resp
}









// ticketInfo()
// Returns up-to-date ticker information.
// {
//   "dash_btc": {
//     "base_name": "dash",
//     "quote_name": "btc",
//     "last_price": "0",
//     "base_volume": "0",
//     "quote_volume": "0",
//     "isFrozen": "1"
//   },
//   "eth_usdt": {
//     "base_name": "eth",
//     "quote_name": "usdt",
//     "last_price": "423.9936",
//     "base_volume": "2942.97774",
//     "quote_volume": "1273092.080666887",
//     "isFrozen": "0"
//   }
// }

async function ticketInfo(){
  var furl = base2 + 'ticker'
  const resp = await axios.get(furl, {})
  .then((res) => {
    console.log(res.data)
  })
  .catch((error) => {
    console.error(error.response)
  })
  return resp
}











// tradesInfo()
// Returns information about all trades related to a specified currency pair (instrument) and executed within the last 24 hours.
// [
//   {
//     "tradeID": "1247307",
//     "price": "10093.92246491",
//     "base_volume": "0.0259",
//     "quote_volume": "261.432591841169",
//     "trade_timestamp": "1599577070",
//     "type": "buy"
//   },
//   {
//     "tradeID": "1247309",
//     "price": "10091.69185435",
//     "base_volume": "0.0754",
//     "quote_volume": "760.913565817990",
//     "trade_timestamp": "1599577128",
//     "type": "sell"
//   }
// ]

async function tradesInfo(instrument){
  var furl = base2 + 'trades/' + instrument
  const resp = await axios.get(furl, {})
  .then((res) => {
    console.log(res.data)
  })
  .catch((error) => {
    console.error(error.response)
  })
  return resp
}









////////////////////////////////// Private calls //////////////////////////////////

//
// const obj = {
//   param1: 'something',
//   param2: 'somethingelse',
//   param3: 'another'
// }
// const url = new URL(`http://example.com`);
// url.search = new URLSearchParams(obj);
// console.log(url.toString())


// Places a new order on the exchange.
async function placeOrder(){
  const ts = new Date().toISOString()
  const nonce = getRandom()

  const body = {
    order: {
      instrument: 'btc_usdt',
      type: 'sell',
      amount: 1,
      price: 1,
      isLimit: true
    },
    ts: ts,
    nonce: nonce
  };
  const data = '?' + queryString.stringify(body);
  const data0 = '?' + JSON.stringify(body);
  const data1 = '?' + new URLSearchParams(body).toString()
  const data2 = '?' + queryString.stringify(body)
  const data3 = `?ts=${ts}&nonce=${nonce}&order=%5B${new URLSearchParams(body.order).toString()}%5D`
  const data4 = '?' + encodeURIComponent(body)

  // let order = {
  //   instrument: "btc_usdt",
  //   type: "sell",
  //   amount: 1,
  //   price: 1,
  //   isLimit: true
  // }
  // let params = {
  //   order: {
  //     instrument: "btc_usdt",
  //     type: "sell",
  //     amount: 1,
  //     price: 1,
  //     isLimit: true
  //   },
  //   ts: ts,
  //   nonce: nonce
  // }
  // order = new URLSearchParams(params).toString()
  // console.log(order)
  // let testy = queryString.stringify(params)
  // console.log(testy)
  // const body = `?ts=${ts}&nonce=${nonce}&order%5Binstrument%5D=btc_usdt&order%5Btype%5D=sell&order%5Bamount%5D=1&order%5Bprice%5D=1&order%5BisLimit%5D=true`
  // let body = `?order=%5B${order}%5D&ts=${ts}&nonce=${nonce}`
  // console.log(body)
  // let body = {
  //   ts: ts,
  //   nonce: nonce,
  //   order: {
  //     instrument: "btc_usdt",
  //     type: "sell",
  //     amount: 1,
  //     price: 1,
  //     isLimit: true
  //   }
  // }
  // body = JSON.stringify(body);
  // body = new URLSearchParams(body).toString()
  // console.log(body)
  // body = '?' + order
  const Sign = sign(data4)

  const furl = base + 'frontoffice/api/order'
  const resp = await axios.post(furl, {
    headers: {
      Key: api_key_public,
      Sign: Sign
    },
    params: {
      order: {
        instrument: "btc_usdt",
        type: "sell",
        amount: 1,
        price: 1,
        isLimit: true
      },
      ts: ts,
      nonce: nonce
    }
  })
  .then((res) => {
    console.log(res)
  })
  .catch((error) => {
    console.error(error.response)
  })
  return resp
}










// Cancels a specified order.
// data: {
//   order: {
//     orderId: '-72057592872552811',
//     total: 0,
//     orderType: 0,
//     commission: 0,
//     createdAt: '2022-05-18T02:17:41.8194437Z',
//     unitsFilled: 0,
//     isPending: false,
//     status: 'cancelled',
//     type: 'buy',
//     amount: 1,
//     remaining: 1,
//     executionPrice: 0,
//     requestedPrice: 1,
//     stopPrice: 0,
//     isLimit: true,
//     instrument: 'btc_usdt',
//     side: 0,
//     rejectDetails: ''
//   }
// }
async function cancelOrder(orderId){
  const ts = new Date().toISOString()
  const nonce = getRandom()
  const Sign = sign(`?orderId=${orderId}&ts=${ts}&nonce=${nonce}`)
  var furl = base + 'frontoffice/api/orders'
  const resp = await axios.delete(furl, {
    headers: {
      Key: api_key_public,
      Sign: Sign
    },
    params: {
      orderId: orderId,
      ts: ts,
      nonce: nonce
    }
  })
  .then((res) => {
    console.log(res)
  })
  .catch((error) => {
    console.error(error.response)
    console.error(error.response.data)
  })
  return resp
}










// Returns a history of orders meeting specified criteria, or a history of all orders if no parameters are defined in a request.async function ordersHistory(){
// {
//   filters: {},
//   paging: { page: 1, per_page: 15, total: 0 },
//   data: [
//     {
//       orderId: '-72057592875995720',
//       total: 1.560031946803,
//       orderType: 0,
//       commission: 0.001560031946803,
//       createdAt: '2022-05-10T20:27:34.817512Z',
//       unitsFilled: 0.00005,
//       isPending: false,
//       status: 'completed',
//       type: 'sell',
//       amount: 0.00005,
//       remaining: 0,
//       executionPrice: 31200.63893606,
//       requestedPrice: 2,
//       stopPrice: 0,
//       isLimit: true,
//       instrument: 'btc_usdt',
//       side: 1
//     },
//     {
//       orderId: '-72057592876030280',
//       total: 1.5593675796965,
//       orderType: 0,
//       commission: 0.0015593675796965,
//       createdAt: '2022-05-10T20:24:33.956383Z',
//       unitsFilled: 0.00005,
//       isPending: false,
//       status: 'completed',
//       type: 'sell',
//       amount: 0.00005,
//       remaining: 0,
//       executionPrice: 31187.35159393,
//       requestedPrice: 0.5,
//       stopPrice: 0,
//       isLimit: true,
//       instrument: 'btc_usdt',
//       side: 1
//     }
//   ]
// }
async function ordersHistory(){
  const ts = new Date().toISOString()
  const nonce = getRandom()
  var furl = base + 'frontoffice/api/order_history'

  const resp = await axios.get(furl, {
    headers: {
      Key: api_key_public,
      Sign: sign(`?ts=${ts}&nonce=${nonce}`)
    },
    params: {
      ts: ts,
      nonce: nonce
    }
  })
  .then((res) => {
    console.log(res.data)
  })
  .catch((error) => {
    console.error(error.response.data)
  })
  return resp
}













// Returns a history of trades meeting specified criteria or a history of all trades if no parameters are defined in a request.
// {
//   filters: {},
//   paging: { page: 1, per_page: 15, total: 0 },
//   data: [
//     {
//       tradeSeq: 0,
//       tradeTime: '2022-05-10T20:27:34.817512Z',
//       amount: 0.00005,
//       executionPrice: 31200.63893606,
//       instrument: 'btc_usdt',
//       side: 1,
//       commission: 0.001560031946803,
//       orderId: -72057592875995720
//     },
//     {
//       tradeSeq: 0,
//       tradeTime: '2022-05-10T20:24:33.956383Z',
//       amount: 0.00005,
//       executionPrice: 31187.35159393,
//       instrument: 'btc_usdt',
//       side: 1,
//       commission: 0.0015593675796965,
//       orderId: -72057592876030280
//     }
//   ]
// }

async function tradesHistory(){
  const ts = new Date().toISOString()
  const nonce = getRandom()
  const Sign = sign(`?ts=${ts}&nonce=${nonce}`)
  var furl = base + 'frontoffice/api/trade_history'
  const resp = await axios.get(furl, {
    headers: {
      Key: api_key_public,
      Sign: Sign
    },
    params: {
      ts: ts,
      nonce: nonce
    }
  })
  .then((res) => {
    console.log(res.data)
  })
  .catch((error) => {
    console.error(error.response.data)
  })
  return resp
}













// Returns up-to-date information about the total and locked amount of each asset on user balances.
// [
//   { asset: 'btc', balance: 0, locked: 0 },
//   { asset: 'usdt', balance: 3.1162801269730007, locked: 0 }
// ]
async function userBalance(){
  const ts = new Date().toISOString()
  const nonce = getRandom()
  const Sign = sign(`?ts=${ts}&nonce=${nonce}`)
  let furl = baseX + 'frontoffice/api/balances'
  const resp = await axios.get(furl, {
    headers: {
      Key: api_key_public,
      Sign: Sign
    },
    params: {
      ts: ts,
      nonce: nonce
    }
  })
  .then((res) => {
    console.log(res.data)
  })
  .catch((error) => {
    console.error(error.response)
    console.error(error.response.data)
  })
  return resp
}












// Returns order details based on a specified order ID or client order ID.
//   {
//     updatedAt: '2022-05-10T23:48:14.033957Z',
//     averageFillPrice: '0',
//     timeInForce: 'GTC',
//     orderId: '-72057592871944785',
//     total: 0,
//     orderType: 0,
//     commission: 0,
//     createdAt: '2022-05-10T23:48:13.997898Z',
//     unitsFilled: 0,
//     isPending: true,
//     status: 'working',
//     type: 'buy',
//     amount: 1.05814006,
//     remaining: 1.05814006,
//     executionPrice: 0,
//     requestedPrice: 2,
//     stopPrice: 0,
//     isLimit: true,
//     instrument: 'btc_usdt',
//     side: 0
//   }
async function orderInfo(orderId){
  const ts = new Date().toISOString()
  const nonce = getRandom()
  const Sign = sign(`?orderId=${orderId}&ts=${ts}&nonce=${nonce}`)
  var furl = base + 'frontoffice/api/orders'
  const resp = await axios.get(furl, {
    headers: {
      Key: api_key_public,
      Sign: Sign
    },
    params: {
      orderId: orderId,
      ts: ts,
      nonce: nonce
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










// Returns up-to-date information about orders placed by a current user.
// [
//   {
//     orderId: '-72057592872552811',
//     total: 0,
//     orderType: 0,
//     commission: 0,
//     createdAt: '2022-05-10T23:18:39.7779057Z',
//     unitsFilled: 0,
//     isPending: true,
//     status: 'working',
//     type: 'buy',
//     amount: 1,
//     remaining: 1,
//     executionPrice: 0,
//     requestedPrice: 1,
//     stopPrice: 0,
//     isLimit: true,
//     instrument: 'btc_usdt',
//     side: 0
//   }
// ]
async function myOrdersInfo(){
  const ts = new Date().toISOString()
  const nonce = getRandom()
  const Sign = sign(`?ts=${ts}&nonce=${nonce}`)
  var furl = base + 'frontoffice/api/orders/my'
  const resp = await axios.get(furl, {
    headers: {
      Key: api_key_public,
      Sign: Sign
    },
    params: {
      ts: ts,
      nonce: nonce
    }
  })
  .then((res) => {
    console.log(res)
  })
  .catch((error) => {
    console.error(error.response.data)
  })
  return resp
}








// supportedInstruments()
// orderBookSnapshot('eth_btc')
// instrumentCandles('btc_usdt','2019-03-13T09:00:00','2019-03-13T11:00:00','1m')
// assetInfo()
// summary()
// ticketInfo()
// tradesInfo('btc_usd')

placeOrder() // !!!!!!!
// cancelOrder('-72057592872552811')
// ordersHistory()
// tradesHistory()
// userBalance()
// orderInfo('-72057592871944785')
// myOrdersInfo()




/////////////// Sockets /////////////////



// const { HubConnectionBuilder } = require("@microsoft/signalr"); // Package version must be >= 5.0.0
//
// const url = `${base}/status-api/status`; // Change [host.name] to your host name
// const instrument = "btc_usd";
// const channel = 'Book';
//
// let connection = new HubConnectionBuilder()
//   .withUrl(url, {
//     skipNegotiation: true,
//     transport: HubConnectionBuilder.HttpTransportType.WebSockets
//   })
//   .build();
//
// connection.start().then(function () {
//   connection.stream()
//     .subscribe({
//       next: (item) => {
// 	      console.log(JSON.stringify(item));
//       },
//       error: (err) => {
//         console.log(err);
//       },
//     });
// });
//
