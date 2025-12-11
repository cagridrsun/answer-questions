const express = require("express");
const dotenv = require("dotenv");
const connectDatabase = require("./helpers/database/connectDatabase")
const customErrorHandler = require("./middleware/errors/customErrorHandler")
const routers = require("./routers/index")
const path = require("path");

//environment variables
dotenv.config({
    path: "./config/env/config.env"
})
//MongoDb Connection
connectDatabase();
const app = express();
//express - Body Middleware
app.use(express.json())

const PORT = process.env.PORT;
// routers middleware
app.use("/api", routers)
//error handler
app.use(customErrorHandler);
//static files ----- Static dosyaları işleme alma bloğu ---- static files middleware

app.use(express.static(path.join(__dirname, "public"))); // dirname'yi publicle birleştirip exppresse bunu söyledik 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} : ${process.env.NODE_ENV}`);
});