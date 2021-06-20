let express = require("express");
let app = express();
const path = require("path");
const router = express.Router();

router.get(function (req, res, next) {
  console.log(`${new Date()} - ${req.method} request for ${req.url}`);
  next();
});

app.use(express.static("../static"));
app.use("/", router);

app.listen(81, function () {
  console.log("Serving static on 81");
});
