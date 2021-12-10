const   express                 = require("express"),
        adminController         = require("../controllers/admin/adminController"),
        programController       = require("../controllers/admin/programController"),
        courseController        = require("../controllers/admin/courseController"),
        studentController       = require("../controllers/admin/studentController");

const router = express.Router();

// ROUTES
router.get("/", adminController.index);

// =====================================================================================
// PROGRAMS SECTION
// GET ALL PROGRAMS
router.get("/programs", programController.programs);

// ADD PROGRAM FORM
router.get("/program/add", programController.addProgram);

// ADD PROGRAM LOGIC
router.post("/program/add", programController.addProgramLogic);

// VIEW PROGRAM FOR EDIT
router.get("/program/:id/edit", programController.editProgram);

// EDIT PROGRAM LOGIC
router.put("/program/:id", programController.editProgramLogic);

// DELETE PROGRAM
router.delete("/program/:id", programController.deleteProgram);

// END OF PROGRAMS SECTION
// =====================================================================================


// =====================================================================================
// COURSES SECTION
// COURSES
router.get("/courses", courseController.courses);

// ADD COURSE FORM
router.get("/course/add", courseController.addCourse);

// ADD COURSE LOGIC
router.post("/course/add", courseController.addCourseLogic);

// EDIT COURSE FORM
router.get("/course/:id/edit", courseController.editCourse);

// UPDATE COURSE LOGIC
router.put("/course/:id/edit", courseController.editCourseLogic);

// DELETE COURSE
router.delete("/course/:id", courseController.deleteCourse);

// END OF COURSES SECTION
// =====================================================================================

// =====================================================================================
// STUDENT SECTION
// GET ALL STUDENTS
router.get("/students", studentController.students);

// ADD STUDENT FORM
router.get("/student/add", studentController.addStudent);

// ADD STUDENT LOGIC
router.post("/student/add", studentController.addStudentLogic);

// DELETE STUDENT INFROMATION
router.delete("/student/:id", studentController.deleteStudent);

// END OF STUDENT SECTION
// =====================================================================================


// =====================================================================================
// USERS SECTION
router.get("/users", adminController.viewAdmins);

// ADD USERS
router.get("/user/add", adminController.signup);

// ADD USERS LOGIC
router.post("/user/add", adminController.signupLogic);

// VIEW/EDIT USERS INFORMATION
router.get("/user/:id/edit", adminController.editAdmin);

// UPDATE USER LOGIC
router.put("/user/:id", adminController.editAdminLogic);

// DELETE USER
router.delete("/user/:id", adminController.deleteAdmin);

// END OF ADMIN SECTION
// =====================================================================================

// =====================================================================================
//404 ROUTE
router.get("*", adminController.error);

// EXPORTING THE ROUTER
module.exports = router;
