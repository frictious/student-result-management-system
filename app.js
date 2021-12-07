const   express             = require("express"),
        Index               = require("./routes/index"),
        Admin               = require("./routes/admin");

const app = express();
require("dotenv").config();

// CONFIG
app.set("view engine", "ejs");
app.use(express.urlencoded({extended : true}));

// ROUTES
app.use("/", Index);
app.use("/admin", Admin);

// SERVER
app.listen(process.env.PORT, () => {
    console.log(`Server Started on PORT ${process.env.PORT}`);
});
