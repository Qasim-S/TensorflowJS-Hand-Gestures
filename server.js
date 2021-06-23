let express = require("express");
let app = express();
const path = require("path");
const router = express.Router();

const PORT = process.env.PORT || 81;

router.get(function (req, res, next) {
  console.log(`${new Date()} - ${req.method} request for ${req.url}`);
  next();
});

app.get("/", (req, res, next) => {
  res.send("<h1>Server is Up</h1>");
  next();
});

app.use(express.static("./static"));

app.listen(PORT, function () {
  console.log("Serving static on 81");
});
