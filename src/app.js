require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const xss = require("xss-clean");
const { rateLimit } = require("express-rate-limit");
const { default: helmet } = require("helmet");
const authRoutes = require("./routes/authRoutes");
const storeRoutes = require("./routes/storeRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const cityRoutes = require("./routes/cityRoutes");
const { errorMiddleware } = require("./middleware/errorMiddleware");
const { notFoundMiddleware } = require("./middleware/notFoundMiddleware");
const { sequelize } = require("./database/config");

const app = express();

app.use(express.json());
app.use(xss());
app.use(helmet());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "PUT", "PATCH", "DELETE", "POST"],
  })
);

app.use(
  rateLimit({
    windowsMs: 15 * 60 * 1000,
    max: 50,
  })
);

app.use((req, res, next) => {
  console.log(`Processing ${req.method} request to ${req.path}`);
  next();
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/stores", storeRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/citys", cityRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;
const run = async () => {
  try {
    await sequelize.authenticate();

    app.listen(port, () => {
      console.log(
        `Server is listening on ${
          process.env.NODE_ENV === "development" ? "http://localhost:" : "port "
        }${port}`
      );
    });
  } catch (error) {
    console.error(error);
  }
};

run();
