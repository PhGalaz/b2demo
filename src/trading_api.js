const axios = require('axios')
const CryptoJS = require("crypto-js")
const queryString = require('query-string')

require('dotenv').config()

const base = process.env.BASE
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







// Obtain the list of API keys via API.
async function obtainKeys(){
  const ts = new Date().toISOString()
  const nonce = getRandom()
  const Sign = sign(`?ts=${ts}&nonce=${nonce}`)
  var furl = base + 'frontoffice/api/key'
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
  })
  return resp
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
// {
//   instrument: 'btc_usdt',
//   bids: [
//     { amount: 1.05814006, price: 2 },
//     { amount: 0.00004, price: 10 },
//     { amount: 1, price: 5000 },
//     { amount: 0.04292009, price: 21042.975492 },
//     { amount: 0.05227782, price: 21043.365453 },
//     { amount: 1.2416505, price: 21043.445445 },
//     { amount: 0.50908141, price: 21043.775412 },
//     { amount: 1.67289024, price: 21043.815408 },
//     { amount: 1.60064229, price: 21044.135376 },
//     { amount: 0.27184466, price: 21044.685321 },
//     { amount: 0.04103808, price: 21044.755314 },
//     { amount: 2.97983574, price: 21045.245265 },
//     { amount: 1.48829725, price: 21045.285261 },
//     { amount: 1.2416505, price: 21045.555234 },
//     { amount: 1.15011204, price: 21045.925197 },
//     { amount: 3.54035852, price: 21046.165173 },
//     { amount: 0.03837191, price: 21046.875102 },
//     { amount: 3.88842425, price: 21046.935096 },
//     { amount: 0.00784167, price: 21047.745015 },
//     { amount: 0.01568334, price: 21047.895 },
//     { amount: 0.148469, price: 21048.014988 },
//     { amount: 0.00899178, price: 21048.024987 }
//   ],
//   asks: [
//     { amount: 0.01066467, price: 21052.265016 },
//     { amount: 0.00271844, price: 21053.1051 },
//     { amount: 0.77198656, price: 21053.115101 },
//     { amount: 0.25145631, price: 21053.235113 },
//     { amount: 2.29583274, price: 21053.695159 },
//     { amount: 0.07360717, price: 21053.745164 },
//     { amount: 1.39628829, price: 21053.855175 },
//     { amount: 1.01800598, price: 21053.965186 },
//     { amount: 0.05227782, price: 21054.165206 },
//     { amount: 0.49852129, price: 21054.515241 },
//     { amount: 0.51948469, price: 21054.615251 },
//     { amount: 1.52907395, price: 21054.70526 },
//     { amount: 1.5280284, price: 21055.075297 },
//     { amount: 0.05227782, price: 21055.155305 },
//     { amount: 1.10489172, price: 21055.355325 },
//     { amount: 0.00522778, price: 21055.655355 },
//     { amount: 2.0911128, price: 21056.095399 },
//     { amount: 2.50933536, price: 21056.30542 },
//     { amount: 2.32374909, price: 21056.355425 },
//     { amount: 1, price: 50000 },
//     { amount: 2e-8, price: 34521343534252 },
//     { amount: 1, price: 10000000000000000 }
//   ],
//   version: 482099033,
//   askTotalAmount: 8.976481,
//   bidTotalAmount: 21.99856115,
//   snapshot: true
// }

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
      startDate: startDate, // YYYY-MM-DDThh:mm:ss
      endDate: endDate, // YYYY-MM-DDThh:mm:ss
      type: type, // The detail level of the chart data; the following values are supported: 1m, 5m, 15m, 30m, 1h, 12h, 1d, 1w, 1M
      count: count // The number of candles to return; the default value is 1000 (which is the maximum supported value)
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
// BTC_USD: {
//   id: 'btc_usd',
//   last: '19201.169925',
//   lowestAsk: '19218.211629',
//   highestBid: '19214.028405',
//   percentChange: '-0.05531774',
//   baseVolume: '157.45310908',
//   quoteVolume: '3066876.79429276',
//   isFrozen: '0',
//   high24hr: '20464.64626',
//   low24hr: '18982.758086'
// },
// BTC_USDT: {
//   id: 'btc_usdt',
//   last: '19228.202628',
//   lowestAsk: '19244.914299',
//   highestBid: '19241.055702',
//   percentChange: '-0.05610186',
//   baseVolume: '78.97341803',
//   quoteVolume: '1538775.55088767849421',
//   isFrozen: '0',
//   high24hr: '20525.162311',
//   low24hr: '18999.509859'
// },
// EUR_USDT: {
//   id: 'eur_usdt',
//   last: '1.03547525',
//   lowestAsk: '1.0512255',
//   highestBid: '1.03547525',
//   percentChange: '-0.00419968',
//   baseVolume: '21056.14241100',
//   quoteVolume: '21981.8395198588926850',
//   isFrozen: '0',
//   high24hr: '1.05586',
//   low24hr: '1.02952025'
// },
// ETH_USD: {
//   id: 'eth_usd',
//   last: '1055.6538475',
//   lowestAsk: '1056.884155',
//   highestBid: '1056.21588',
//   percentChange: '-0.03489552',
//   baseVolume: '1439.29900658',
//   quoteVolume: '1528483.73738477',
//   isFrozen: '0',
//   high24hr: '1103.0656975',
//   low24hr: '1032.62178'
// },
// BTC_EUR: {
//   id: 'btc_eur',
//   last: '18420.91',
//   lowestAsk: '18437.94',
//   highestBid: '18429.52',
//   percentChange: '-0.05116160',
//   baseVolume: '165.75933710',
//   quoteVolume: '3092821.40952686',
//   isFrozen: '0',
//   high24hr: '19556.22',
//   low24hr: '18147.45'
// }

async function summary(instrument){
  var furl = base2 + 'summary'
  let resp = await axios.get(furl, {})
  // .then((res) => {
  //   console.log(res.data[instrument])
  // })
  .catch((error) => {
    console.error(error.response)
  })
  return resp.data[instrument]
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
//     "quote_volume": "261.432591841169",PPPPPP
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






// Places a new order on the exchange.
async function placeOrder(instrument,type,amount,price,isLimit,isStop,isFok,clientOrderId){
  const ts = new Date().toISOString()
  const nonce = getRandom()
  
  const order = {
    instrument: 'btc_usdt',
    type: 'sell',
    amount: 1,
    price: 100000,
    isLimit: true
  }

  const body = {
    ts: ts,
    nonce: nonce,
    order: {
      instrument: 'btc_usdt',
      type: 'sell',
      amount: 1,
      price: 100000,
      isLimit: true
    }
  };

  // const dataDoc = JSON.stringify(body)
  const data = '?' + queryString.stringify(body)
  const data0 = '?' + JSON.stringify(body);
  const data1 = '?' + new URLSearchParams(body).toString()
  const data3 = `?order=${JSON.stringify(order)}&ts=${ts}&nonce=${nonce}`
  const data4 = '?' + encodeURIComponent(body)

  // const url = new URL(base);
  // url.search = new URLSearchParams(body);

  const Sign = sign(JSON.stringify(body))

  const furl = base + 'frontoffice/api/order'
  const resp = await axios.post(furl, {
    headers: {
      // 'Content-Length': body.length,
      Key: api_key_public,
      Sign: Sign
    },
    params: {
      ts: ts,
      nonce: nonce,
      order: {
        instrument: "btc_usdt",
        type: "sell",
        amount: 1,
        price: 100000,
        isLimit: true
      }
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
  let furl = base + 'frontoffice/api/balances'
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
    console.log(res.data)
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







// obtainKeys() // !!!!!!!!!!

// supportedInstruments()
// orderBookSnapshot('btc_usdt')
// instrumentCandles('btc_usdt','2019-03-13T09:00:00','2019-03-13T11:00:00','1m')
// assetInfo()
summary("BTC_USDT")
// ticketInfo()
// tradesInfo('btc_usd')

// placeOrder() // !!!!!!!
// cancelOrder('-72057592872552811')
// ordersHistory()
// tradesHistory()
// userBalance()
// orderInfo('-72057592267732133')
// myOrdersInfo()


















/////////////// Sockets /////////////////



// const signalR = require("@microsoft/signalr") // Package version must be >= 5.0.0

// const url = `${base}/trading/marketdata/info`
// const instrument = "btc_usdt"
// const channel = 'Book'

// let connection = new signalR.HubConnectionBuilder()
//   .withUrl(url, {
//     skipNegotiation: true,
//     transport: signalR.HttpTransportType.WebSockets
//   })
//   .build()

// connection.start().then(function () {
//   connection.stream(channel, instrument)
//     .subscribe({
//       next: (item) => {
// 		    console.log(JSON.stringify(item));
//       },
//       error: (err) => {
//         console.log(err);
//       },
//     }); 
// });




// const signalr = require('node-signalr')

// let client = new signalr.client(`${base}/trading/marketdata/info`, ['testHub'])

// client.start()