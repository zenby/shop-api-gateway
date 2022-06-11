const { ProductService } = require('./src/productService')

module.exports.endpoint = async (event, context, callback) => {
  const productService = new ProductService()
  const products = await productService.getAllProducts()

  return {
    statusCode: 200,
    body: JSON.stringify(products),
  }
}
