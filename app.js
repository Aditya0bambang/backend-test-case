const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const port = 3000;
const routes = require("./routes/index");

app.use("/", routes);

app.use((err, req, res, next) => {
  res.status(500).json({
    statusCode: 500,
    error: err.message,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
