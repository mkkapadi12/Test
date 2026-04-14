require("dotenv").config({ quiet: true });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const user_routes = require("./routes/user.routes");
const admin_routes = require("./routes/admin.routes");
const product_routes = require("./routes/product.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

//mongodb connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.log(err));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api", (req, res) => {
  res.send("API is Working!!");
});

app.use("/api/user", user_routes);
app.use("/api/admin", admin_routes);
app.use("/api/product", product_routes);

//error middleware
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});
