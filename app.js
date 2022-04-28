const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const router = require('./routes/mainRouter')
const apiErrorMiddleWare = require('./middleware/middlewareError')

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api' , router)
app.use(apiErrorMiddleWare)

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      //useUndefinedTopology: true
    });
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};
start();
