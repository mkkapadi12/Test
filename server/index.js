require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");
const http = require("http");
const { initSocket } = require("./socket/socket");
const app = express();

// routes
const user_routes = require("./routes/user.routes");
const admin_routes = require("./routes/admin.routes");
const product_routes = require("./routes/product.routes");
const order_routes = require("./routes/order.routes");
const course_routes = require("./routes/course.routes");
const enrollment_routes = require("./routes/enrollment.routes");
// middleware
const errorMiddleware = require("./middlewares/error.middleware");

// database connection
const connectDB = require("./config/db");

const server = http.createServer(app);
initSocket(server);

const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

//mongodb connection
connectDB();

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
app.use("/api/order", order_routes);

//course + enrollment
app.use("/api/courses", course_routes);
app.use("/api/enrollments", enrollment_routes);

//error middleware
app.use(errorMiddleware);

server.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});
