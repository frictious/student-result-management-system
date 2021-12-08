const   express                 = require("express");

const router = express.Router();

// ROUTES
router.get("/", (req, res) => {
    res.render("admin/index", {
        title : "Njala SRMS Admin Panel"
    });
});

//404 ROUTE
router.get("*", (req, res) => {
    res.render("admin/404", {
        title : "404 - Page Not Found"
    });
});

// EXPORTING THE ROUTER
module.exports = router;
