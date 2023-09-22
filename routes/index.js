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

// FORGOT PASSWORD
router.get("/forgotpassword", indexController.forgotPassword);

// FORGOT PASSWORD LOGIC
router.post("/forgotpassword", indexController.forgotPasswordLogic);

// PASSWORD RESET LINK MESSAGE
router.get("/passwordresetlink", indexController.resetpasswordmessage);

// GET RESET PASSWORD PAGE
router.get("/resetpassword/:id/:studentID", indexController.resetpassword);

// RESET PASSWORD LOGIC
router.put("/resetpassword/:id/:studentID", indexController.resetpasswordLogic);

// GRADE SEARCH FORM
router.get("/grade/search", indexController.gradeSearch);

// GRADE SEARCH LOGIC
router.post("/grade/search", indexController.gradeSearchLogic);

// EXPORTING ROUTER
module.exports = router;
