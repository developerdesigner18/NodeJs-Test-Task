const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/database");
const peopleRoutes = require("./routes/peopleRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/api/people", peopleRoutes);

// Sync database and start server
sequelize
  .sync({ alter: true }) 
  .then(() => {
    console.log("Database synced successfully!");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("Database sync error:", err));
