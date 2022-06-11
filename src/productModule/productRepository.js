import products from "./products.json";

class ProductRepository {
  constructor() {}

  async getAllProducts() {
    return products;
  }
  async getProductById(id) {
    return products.find((pr) => pr.id === id);
  }
}

export default ProductRepository;
