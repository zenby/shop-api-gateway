const { ProductRepository } = require('./productRepository')

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository()
  }

  async getAllProducts() {
    return this.productRepository.getAllProducts()
  }

  async getProductById(id) {
    return this.productRepository.getProductById(id)
  }
}

module.exports = { ProductService }
