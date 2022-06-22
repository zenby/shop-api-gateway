import { Pool } from "pg";

class ProductRepository {
  constructor() {
    console.log("pool started");
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    });
    console.log("pool finished");
  }

  async getAllProducts() {
    const connection = await this.pool.connect();
    try {
      const allProducts = (
        await connection.query("SELECT * FROM product INNER JOIN store ON store.product_id = product.id;")
      ).rows;

      return allProducts;
    } finally {
      connection.release();
    }
  }

  async getProductById(id) {
    const connection = await this.pool.connect();
    try {
      const result = await connection.query(
        "SELECT * FROM product INNER JOIN store ON store.product_id = product.id AND product.id = $1;",
        [id]
      );

      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      connection.release();
    }
  }
}

export default ProductRepository;
