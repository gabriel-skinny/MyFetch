const Pagination = require("./pagination");

(async () => {
  const pagination = new Pagination()

  const firstPage = 10000
  const req = pagination.getPaginated({
    url: "https://www.mercadobitcoin.net/api/BTC/trades",
    page: firstPage
  })

  for await (const items of req) {
    console.table(items)
  }
})()