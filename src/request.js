// https://www.mercadobitcoin.net/api/BTC/trades/?tid=5704

const https = require("https");

class Request {
  
  erorrTimeout = (reject, urlRequest) => () => reject(new Error(`timeout at [${urlRequest}]`))
  
  raceTimeoutDelay(url, timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(this.erorrTimeout(reject, url), timeout)
    })
  }

  async get(url) {
    return new Promise((resolve, reject) => {
      
      https.get(url, res => {
        const items = []
        res
          .on('data', data => items.push(data))
          .on('end', () => resolve(JSON.parse(items.join(""))))
      })
        .on("error", reject)
    }) 
  }

  async makeRequest({ url, method, timeout}) {
    return Promise.race([
      this[method](url),
      this.raceTimeoutDelay(url, timeout)
    ])
  }
}

module.exports = Request;