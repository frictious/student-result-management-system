// REQUIRED MODULES WILL BE HERE
const grade = require("../models/grade");
const   Student                 = require("../models/user"),
        bcrypt                  = require("bcryptjs"),
        passport                = require("passport"),
        Program                 = require("../models/program"),
        Course                  = require("../models/course");


require("../config/login")(passport);

// INDEX ROUTE
exports.indexController = (req, res) => {
    Student.findOne({studentID : req.user.studentID})
    .then(student => {
        Program.findOne({name : student.program})
        .then(program => {
            grade.find({studentID : req.user.studentID})
            .then(grades => {
                if(grades){
                    Course.find({})
                    .then(courses => {
                        if(courses){
                            res.render("index", {
                                title : "Njala SRMS",
                                student : student,
                                program : program,
                                grades : grades,
                                courses : courses
                            });
                        }
                    })
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
        successRedirect : `/${req.body.studentID}`,
        failureRedirect : "/login"
    })(req, res, next);
}

// LOGOUT LOGIC
exports.logout = (req, res) => {
    req.logout();
    res.redirect("/login");
}
