const   express             = require("express"),
        Index               = require("./routes/index"),
        Admin               = require("./routes/admin"),
        mongoose            = require("mongoose"),
        methodOverride      = require("method-override");

const app = express();
require("dotenv").config();

// CONFIG
// MONGOOSE CONNECTION
global.Promise = mongoose.Promise
mongoose.connect(process.env.MONGODB, {
    useNewUrlParser : true,
    useUnifiedTopology : true
});

app.set("view engine", "ejs");
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

// ROUTES
app.use("/", Index);
app.use("/admin", Admin);

// SERVER
app.listen(process.env.PORT, () => {
    console.log(`Server Started on PORT ${process.env.PORT}`);
});
