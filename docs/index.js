const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const express = require("express");

const PORT = process.env.PORT || 8000;

const app = express();

const swaggerDocument = YAML.load(`${__dirname}/swagger.yml`);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", (_, res) => res.redirect("/docs"));

app.listen(PORT, () => {
  console.log(`Documentation is on http://localhost:${PORT}/docs`);
});
