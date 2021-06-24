let express = require("express");
let app = express();
const path = require("path");
const router = express.Router();

const PORT = process.env.PORT || 81;

router.get(function (req, res, next) {
  console.log(`${new Date()} - ${req.method} request for ${req.url}`);
  next();
});

app.use(express.static("./static"));

app.listen(PORT, function () {
  console.log(`Serving static on ${PORT}`);
});
