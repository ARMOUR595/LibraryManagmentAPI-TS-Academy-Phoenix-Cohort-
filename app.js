const express = require("express");
const connectDB = require("./config/database");

const app = express();

connectDB();

app.use(express.json());

app.use("/authors",    require("./routes/authourRoutes"));
app.use("/books",      require("./routes/bookRoutes"));
app.use("/students",   require("./routes/studentRoutes"));
app.use("/staff", require("./routes/staffRoute"));

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});