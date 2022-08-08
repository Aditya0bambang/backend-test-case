const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
