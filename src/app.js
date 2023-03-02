require("dotenv").config();
require("express-async-errors");
const express = require("express");
// const apiRoutes = require('./routes')
const authRoutes = require("./routes/authRoutes");
const storeRoutes = require("./routes/storeRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const cityRoutes = require("./routes/cityRoutes");
const { errorMiddleware } = require("./middleware/errorMiddleware");
const { notFoundMiddleware } = require("./middleware/notFoundMiddleware");

const { sequelize } = require("./database/config");

/* ----------- Create our Expres app ------------ */
const app = express();

/* ---------------------------------------------- */
/* ----------------- Middleware ----------------- */
/* ---------------------------------------------- */
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Processing ${req.method} request to ${req.path}`);
  next();
});

/* ---------------------------------------------- */
/* ------------------- Routes ------------------- */
/* ---------------------------------------------- */
// y
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/stores", storeRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/citys", cityRoutes);

/* ---------------------------------------------- */
/* --------------- Error Handling --------------- */
/* ---------------------------------------------- */
app.use(notFoundMiddleware);
app.use(errorMiddleware);

/* ---------------------------------------------- */
/* ---------------- Server Setup ---------------- */
/* ---------------------------------------------- */
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
