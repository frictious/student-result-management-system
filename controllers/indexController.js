// REQUIRED MODULES WILL BE HERE
const grade = require("../models/grade");
const   Student                 = require("../models/user"),
        bcrypt                  = require("bcryptjs"),
        passport                = require("passport"),
        Program                 = require("../models/program"),
        Course                  = require("../models/course"),
        Grade                   = require("../models/grade"),
        nodemailer              = require("nodemailer");

//CONFIG
require("dotenv").config();
//Nodemailer configuration
const transport = nodemailer.createTransport({
    service : "gmail",
    auth:{
        type: "login",
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});


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

// FORGOT PASSWORD ROUTE
exports.forgotPassword = (req, res) => {
    res.render("forgot_password", {
        title : "Njala SRMS Forgot Password Page"
    });
}

// FORGOT PASSWORD LOGIC
exports.forgotPasswordLogic = (req, res) => {
    Student.findOne({email : req.body.email, studentID : req.body.studentID})
    .then(student => {
        if(student){
            console.log(req.headers.host);
            const link = `${req.headers.host}/resetpassword/${student._id}/${student.studentID}`
            console.log(`"${link}"`);
            //Send mail to student after successful registration
            const mailOptions = {
                from: process.env.EMAIL,
                to: req.body.email,
                subject : `Njala University SRMS Password Reset`,
                html: `<p>Dear <strong>${student.name}</strong>,</p>
                <p>A request was made to reset your password. The link to resetting your password is given below.</p>

                <a href=http://${link}>Click Here</a>
                
                <p>Please keep your login information private. If you so wish to change your password for security purposes, you can do so via the portal</p>

                <p>Bear in  mind that you can and should change your password so it can be kept safe.</p>
                
                <br><br>
                <p>Sincerely</p>
                <p>Exams Office</p>`
            }

            //Sending mail
            transport.sendMail(mailOptions, (err, mail) => {
                if(!err){
                    console.log("PASSWORD RESET MAIL SENT TO STUDENT");
                    res.redirect("/passwordresetlink");
                }else{
                    console.log(err);
                }
            });
        }
    })
}

// RESET PASSWORD LINK MESSAGE
exports.resetpasswordmessage = (req, res) => {
    res.render("resetpasswordlink", {
        title : "Njala SRMS Password Reset Link Message"
    });
}

// RESET PASSWORD PAGE
exports.resetpassword = (req, res) => {
    Student.findById({_id : req.params.id})
    .then(student => {
        if(student){
            // console.dir(res);
            res.render("reset_password", {
                title : "Njal SRMS Reset Student Password",
                student : student
            });
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// RESET PASSWORD LOGIC
exports.resetpasswordLogic = (req, res) => {
    if(req.body.password === req.body.repassword){
        bcrypt.genSalt(10)
        .then(salt => {
            bcrypt.hash(req.body.password, salt)
            .then(hash => {
                if(hash){
                    Student.findByIdAndUpdate({_id : req.params.id}, {password : hash})
                    .then(student => {
                        if(student){
                            // console.log("STUDENT PASSWORD CHANGED SUCCESSFULLY");
                            res.redirect("/login");
                        }
                    })
                    
                }
            })
        })
        .catch(err => {
            if(err){
                console.log(err);
                res.redirect("back");
            }
        });
    }else{
        console.log("PASSWORDS DO NOT MATCH");
        res.redirect("back");
    }
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
