const   express                 = require("express");

const router = express.Router();

// ROUTES
router.get("/", (req, res) => {
    res.render("admin/index", {
        title : "Njala SRMS Admin Panel"
    });
});

// EXPORTING THE ROUTER
module.exports = router;
