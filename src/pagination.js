const Request = require("./request");

const DEFAULT_OPTIONS = {
  maxRetries: 2,
  retryTimeout: 1000,
  maxRequestTimeout: 1000,
  treshhold: 200
}

class Pagination {
  constructor(options = DEFAULT_OPTIONS) {
    this.request = new Request();
    
    this.maxRetries = options.maxRetries;
    this.retryTimeout = options.retryTimeout;
    this.maxRequestTimeout = options.maxRequestTimeout;
    this.treshhold = options.treshhold;
  }

  async handleRequest({ url, page, restries: retries = 1}) {
    try {
      const finalurl = `${url}?tid=${page}`;
      const result = await this.request.makeRequest({
        url: finalurl,
        method: "get",
        timeout: this.maxRequestTimeout
      })

      return result;

    } catch (error) {
      if (retries === this.maxRetries) {
        console.error(`[${retries}] max retries reached!`);
        throw error;
      }
      console.error(`[${retries}] an error: [${error.message}] has happened! trying again in ${this.retryTimeout}ms`)
      await Pagination.sleep(this.retryTimeout)

      return this.handleRequest({ url, page, restries: retries += 1})
    }
  }

  static async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async * getPaginated({ url, page }) {
    const result = await this.handleRequest({ url, page })
    const lastId = result[result.length -1]?.tid ?? 0 

    if(lastId === 0) return

    yield result

    await Pagination.sleep(this.treshhold)

    yield* this.getPaginated({ url, page: lastId})
  }
} 

module.exports = Pagination;