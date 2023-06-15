const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const app = express();
const connectDB = require("./db/conn");

dotenv.config();

connectDB();

app.use(cors())
app.use(express.json())
app.use("/api/auth", require("./routes/auth"))
app.use("/api/notes", require("./routes/notes"))

const port = process.env.PORT || 5000;
//listen port
app.listen(port, () => {
    console.log(
        `Server Running on port ${process.env.PORT}`
    );
});