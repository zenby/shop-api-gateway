import products from "./products.json";

class ProductRepository {
  constructor() {}

  async getAllProducts() {
    return products;
  }
  async getProductById(id) {
    console.log(id);
    return products.find((pr) => pr.id === id);
  }
}

export default ProductRepository;
