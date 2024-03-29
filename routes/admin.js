const   express                 = require("express"),
        adminController         = require("../controllers/admin/adminController"),
        programController       = require("../controllers/admin/programController"),
        courseController        = require("../controllers/admin/courseController"),
        studentController       = require("../controllers/admin/studentController"),
        gradeController         = require("../controllers/admin/gradeController");

const router = express.Router();

// LOG IN CHECKER
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.role === "Admin" || req.user.role === "Exam Officer"){
            return next();
        }else{
            res.redirect("/admin/logout");
        }
    }else{
        res.redirect("/admin/login");
    }
};

// ROUTES
router.get("/", isLoggedIn, adminController.index);

// =====================================================================================
// PROGRAMS SECTION
// GET ALL PROGRAMS
router.get("/programs", isLoggedIn, programController.programs);

// ADD PROGRAM FORM
router.get("/program/add", isLoggedIn, programController.addProgram);

// ADD PROGRAM LOGIC
router.post("/program/add", programController.addProgramLogic);

// VIEW PROGRAM FOR EDIT
router.get("/program/:id/edit", isLoggedIn, programController.editProgram);

// EDIT PROGRAM LOGIC
router.put("/program/:id", programController.editProgramLogic);

// DELETE PROGRAM
router.delete("/program/:id", programController.deleteProgram);

// END OF PROGRAMS SECTION
// =====================================================================================


// =====================================================================================
// COURSES SECTION
// COURSES
router.get("/courses", isLoggedIn, courseController.courses);

// ADD COURSE FORM
router.get("/course/add", isLoggedIn, courseController.addCourse);

// ADD COURSE LOGIC
router.post("/course/add", courseController.addCourseLogic);

// EDIT COURSE FORM
router.get("/course/:id/edit", isLoggedIn, courseController.editCourse);

// UPDATE COURSE LOGIC
router.put("/course/:id/edit", courseController.editCourseLogic);

// DELETE COURSE
router.delete("/course/:id", courseController.deleteCourse);

// END OF COURSES SECTION
// =====================================================================================

// =====================================================================================
// STUDENT SECTION
// GET ALL STUDENTS
router.get("/students", isLoggedIn, studentController.students);

// ADD STUDENT FORM
router.get("/student/add", isLoggedIn, studentController.addStudent);

// ADD STUDENT LOGIC
router.post("/student/add", studentController.addStudentLogic);

// EDIT STUDENT FORM
router.get("/student/:id/edit", studentController.editStudent);

// EDIT STUDENT INFORMATION LOGIC
router.put("/student/:id", studentController.editStudentLogic);

// DELETE STUDENT INFROMATION
router.delete("/student/:id", isLoggedIn, studentController.deleteStudent);

// END OF STUDENT SECTION
// =====================================================================================

// =====================================================================================
// GRADES SECTION
// GET ALL GRADES
router.get("/grades", isLoggedIn, gradeController.grades);

// SEARCH FORM
router.get("/grade/search", isLoggedIn, gradeController.gradeSearch);

// SEARCH FORM LOGIC
router.post("/grade/search", gradeController.gradeSearchLogic);

// ADD GRADES FORM
router.get("/grade/add/:studentID/:year/:semester/:programName", isLoggedIn, gradeController.addGrade);

// ADD GRADE LOGIC
router.post("/grade/add", gradeController.addGradeLogic);

// EDIT GRADE FORM
router.get("/grade/:id/edit", isLoggedIn, gradeController.editGrade);

// EDIT GRADE LOGIC
router.put("/grade/:id", gradeController.editGradeLogic);

// DELETE GRADE
router.delete("/grade/:id", gradeController.deleteGrade);

// END OF GRADES SECTION
// =====================================================================================


// =====================================================================================
// USERS SECTION
router.get("/users", isLoggedIn, adminController.viewAdmins);

// ADD USERS
router.get("/user/add", adminController.signup);

// ADD USERS LOGIC
router.post("/user/add", adminController.signupLogic);

// VIEW/EDIT USERS INFORMATION
router.get("/user/:id/edit", isLoggedIn, adminController.editAdmin);

// UPDATE USER LOGIC
router.put("/user/:id", adminController.editAdminLogic);

// DELETE USER
router.delete("/user/:id", adminController.deleteAdmin);

// LOGIN USER
router.get("/login", adminController.login);

// LOGIN USER LOGIC
router.post("/login", adminController.loginLogic);

// LOGOUT
router.post("/logout", adminController.logout);

// FORGOT PASSWORD
router.get("/forgotpassword", adminController.forgotPassword);

// FORGOT PASSWORD LOGIC
router.post("/forgotpassword", adminController.forgotPasswordLogic);

// PASSWORD RESET LINK MESSAGE
router.get("/passwordresetlink", adminController.resetpasswordmessage);

// GET RESET PASSWORD PAGE
router.get("/resetpassword/:id", adminController.resetpassword);

// RESET PASSWORD LOGIC
router.put("/resetpassword/:id", adminController.resetpasswordLogic);

// END OF ADMIN SECTION
// =====================================================================================

// =====================================================================================
//404 ROUTE
router.get("*", isLoggedIn, adminController.error);

// EXPORTING THE ROUTER
module.exports = router;
