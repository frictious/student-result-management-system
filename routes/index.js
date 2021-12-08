const   express             = require("express"),
        indexController     = require("../controllers/indexController");

const router = express.Router();

// ROUTES
// INDEX ROUTE
router.get("/", indexController.indexController);

// LOGIN ROUTE
router.get("/login", indexController.loginController);

// LOGIN LOGIC
router.post("/login", indexController.loginLogicController);

// EXPORTING ROUTER
module.exports = router;
