// REQUIRED MODULES WILL BE HERE
const grade = require("../models/grade");
const   Student                 = require("../models/user"),
        bcrypt                  = require("bcryptjs"),
        passport                = require("passport"),
        Program                 = require("../models/program"),
        Course                  = require("../models/course"),
        Grade                   = require("../models/grade");


require("../config/login")(passport);

// INDEX ROUTE
exports.index = (req, res) => {
    res.redirect("/login");
}

// RESULT ROUTE
exports.indexController = (req, res) => {
    Student.findOne({studentID : req.params.studentID})
    .then(student => {
        Program.findOne({name : student.program})
        .then(program => {
            grade.find({student_year : req.params.student_year})
            .then(grades => {
                if(grades){
                    Course.find({}).sort()
                    .then(courses => {
                        if(courses){
                            res.render("index", {
                                title : "Njala SRMS",
                                student : student,
                                program : program,
                                grades : grades,
                                courses : courses,
                                academicYear : req.params.academicYear,
                                year : req.params.student_year
                            });
                        }
                    })
                }else{
                    res.redirect("/grade/search");
                }
            })
        })
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// LOGIN ROUTE
exports.loginController = (req, res) => {
    res.render("login", {
        title : "NJALA SRMS Login Page"
    });
}

// LOGIN LOGIC
exports.loginLogicController = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect : "/grade/search",
        failureRedirect : "/login"
    })(req, res, next);
}

// GRADE SEARCH FORM
exports.gradeSearch = (req, res) => {
    Student.findById({_id : req.user._id})
    .then(student => {
        res.render("gradesearch", {
            title : "Njala SRMS Student Grade Search"
        })
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// GRADE SEARCH LOGIC
exports.gradeSearchLogic = (req, res) => {
    Grade.find({
        student_year : req.body.student_year,
        studentID : req.body.studentID
    })
    .then(grade => {
        if(grade){
            res.redirect(`/${req.body.studentID}/${req.body.student_year}/result`);
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// LOGOUT LOGIC
exports.logout = (req, res) => {
    req.logout();
    res.redirect("/login");
}
