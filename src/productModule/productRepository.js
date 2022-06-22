import { Pool } from "pg";

class ProductRepository {
  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    });
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

  async createProduct(product) {
    const connection = await this.pool.connect();
    try {
      await connection.query("BEGIN");
      const result = await connection.query(
        "INSERT INTO product (title, description, price) values ($1, $2, $3) RETURNING id;",
        [product.title, product.description, product.price]
      );
      const productId = result.rows[0].id;
      await connection.query("INSERT INTO store (product_id, amount) values ($1, $2);", [
        productId,
        product.amount || 0,
      ]);
      await connection.query("COMMIT");

      return productId;
    } catch (e) {
      await connection.query("ROLLBACK");
      throw e;
    } finally {
      connection.release();
    }
  }
}

export default ProductRepository;
