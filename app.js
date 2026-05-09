require('dotenv').config();

const express = require("express");
const connectDB = require("./config/database");
const swaggerUi      = require("swagger-ui-express");
const swaggerSpec    = require("./config/swagger");

const app = express();

connectDB();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/authors",    require("./routes/authourRoutes"));
app.use("/books",      require("./routes/bookRoutes"));
app.use("/students",   require("./routes/studentRoutes"));
app.use("/staff", require("./routes/staffRoute"));
app.use("/auth", require("./routes/loginRoutes"));

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
    console.log(`Swagger docs at http://localhost:3000/api-docs`);
});