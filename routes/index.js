const   express             = require("express"),
        indexController     = require("../controllers/indexController");

const router = express.Router();

// LOG IN CHECKER
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.role === "Student"){
            return next();
        }else{
            res.redirect("/logout");
        }
    }else{
        res.redirect("/login");
    }
};

// ROUTES
// INDEX ROUTE
router.get("/", isLoggedIn, indexController.index);

// RESULT ROUTE
router.get("/:studentID/:student_year/result", isLoggedIn, indexController.indexController);

// LOGIN ROUTE
router.get("/login", indexController.loginController);

// LOGIN LOGIC
router.post("/login", indexController.loginLogicController);

// LOGOUT LOGIC
router.get("/logout", indexController.logout);

// GRADE SEARCH FORM
router.get("/grade/search", indexController.gradeSearch);

// GRADE SEARCH LOGIC
router.post("/grade/search", indexController.gradeSearchLogic);

// EXPORTING ROUTER
module.exports = router;
