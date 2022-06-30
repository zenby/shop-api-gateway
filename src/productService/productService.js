import ProductRepository from "./productRepository";

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async createProduct(product) {
    return this.productRepository.createProduct(product);
  }

  async getAllProducts() {
    return this.productRepository.getAllProducts();
  }

  async getProductById(id) {
    return this.productRepository.getProductById(id);
  }
}

export default ProductService;
