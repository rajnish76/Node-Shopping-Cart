const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const dotenv = require("dotenv");

const user = require("./routes/user");
const product = require("./routes/product");
const cart = require("./routes/cart");
const errorMiddleware = require("./middlewares/error");

dotenv.config({ path: "./config/config.env" });

//Connecting Databse here
const connectdb = require("./config/database");
connectdb();

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(mongoSanitize());
//Rate Limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
});

app.use(limiter);

app.use(cors());
app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", cart);
app.use(errorMiddleware);

app.listen(3000, () => console.log("listing at Port 3000"));
