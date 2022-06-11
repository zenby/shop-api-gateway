const fs = require('fs')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)

class ProductRepository {
  constructor() {
    this.pathToStorage = `${__dirname}/products.json`
  }

  async getAllProducts() {
    const fileContent = await readFile(this.pathToStorage)

    return JSON.parse(fileContent.toString())
  }
  async getProductById() {}
}

module.exports = { ProductRepository }
