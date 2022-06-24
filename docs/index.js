const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const express = require("express");

const app = express();

const swaggerDocument = YAML.load(`${__dirname}/swagger.yml`);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", (_, res) => res.redirect("/docs"));

app.listen(8000, () => {
  console.log("Documentation is on http://localhost:8000/docs");
});
