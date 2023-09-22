const   User            = require("../../models/user"),
        bcryptjs        = require("bcryptjs"),
        Student         = require("../../models/user"),
        Program         = require("../../models/program"),
        Course          = require("../../models/course"),
        nodemailer      = require("nodemailer"),
        passport        = require("passport");

require("../../config/adminLogin")(passport);

//Nodemailer configuration
const transport = nodemailer.createTransport({
    service : "gmail",
    auth:{
        type: "login",
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

// DASHBOARD ROOT ROUTE
exports.index = (req, res) => {
    Program.find({})
    .then(programs => {
        Student.find({})
        .then(students => {
            Course.find({})
            .then(courses => {
                User.find({})
                .then(admins => {
                    res.render("admin/index", {
                        title : "Njala SRMS Admin Panel",
                        programs : programs,
                        students : students,
                        courses : courses,
                        admins : admins
                    });
                })
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

// =====================================================================================
// VIEW ALL USERS
exports.viewAdmins = (req, res) => {
    User.find({})
    .then(users => {
        if(users){
            res.render("admin/admin/admins", {
                title : "Njala SRMS Admins",
                users : users
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

// LOGIN ROUTE
exports.login = (req, res) => {
    res.render("admin/admin/login", {
        title : "NJALA SRMS Admin Login Page"
    });
}

// LOGIN LOGIC
exports.loginLogic = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect : "/admin",
        failureRedirect : "/admin/login"
    })(req, res, next);
}

// LOGOUT
exports.logout = (req, res, next) => {
    req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/admin/login');
  });
}

// USERS SIGN UP FORM
exports.signup = (req, res) => {
    res.render("admin/admin/add", {
        title : "Njala SRMS Admin Signup"
    });
}

// SIGN UP LOGIC
exports.signupLogic = (req, res) => {
    if(req.body.password === req.body.retypePassword){
        bcryptjs.genSalt(10)
        .then(salt => {
            bcryptjs.hash(req.body.password, salt)
            .then(hash => {
                User.create({
                    name : req.body.name,
                    email : req.body.email,
                    password : hash,
                    role : req.body.role
                })
                .then(user => {
                    if(user){
                        console.log("USER CREATED SUCCESSFULLY");
                        res.redirect("/admin/users");
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
    }else{
        console.log("PASSWORDS DO NOT MATCH");
        res.redirect("back");
    }
}

// EDIT ADMIN INFORMATION
exports.editAdmin = (req, res) => {
    User.findById({_id : req.params.id})
    .then(user => {
        if(user){
            res.render("admin/admin/update", {
                title : "Njala SRMS User Update Form",
                user : user
            })
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// EDIT ADMIN INFORMATION LOGIC
exports.editAdminLogic = (req, res) => {
    if(req.body.password === ""){
        User.findByIdAndUpdate({_id : req.params.id}, {
            name : req.body.name,
            email : req.body.email,
            role : req.body.role
        })
        .then(user => {
            if(user){
                console.log(user);
                console.log("USERS INFORMATION UPDATED SUCCESSFULLY");
                res.redirect("/admin/users");
            }
        })
        .catch(err => {
            if(err){
                console.log(err);
                res.redirect("back");
            }
        })
    }else{
        bcryptjs.genSalt(10)
        .then(salt => {
            bcryptjs.hash(req.body.password, salt)
            .then(hash => {
                User.findByIdAndUpdate({_id : req.params.id}, {
                    name : req.body.name,
                    email : req.body.email,
                    password : hash,
                    role : req.body.role
                })
                .then(user => {
                    if(user){
                        console.log(user);
                        console.log("USERS INFORMATION UPDATED SUCCESSFULLY");
                        res.redirect("back");
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
}

// FORGOT PASSWORD ROUTE
exports.forgotPassword = (req, res) => {
    res.render("admin/forgot_password", {
        title : "Njala SRMS Forgot Password Page"
    });
}

// FORGOT PASSWORD LOGIC
exports.forgotPasswordLogic = (req, res) => {
    User.findOne({email : req.body.email})
    .then(user => {
        if(user){
            // console.log(req.headers.host);
            const link = `${req.headers.host}/resetpassword/${user._id}`
            console.log(`"${link}"`);
            //Send mail to admin after successful registration
            const mailOptions = {
                from: process.env.EMAIL,
                to: req.body.email,
                subject : `Njala University SRMS Password Reset`,
                html: `<p>Dear <strong>${user.name}</strong>,</p>
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
                    console.log("PASSWORD RESET MAIL SENT TO ADMIN");
                    res.redirect("/admin/passwordresetlink");
                }else{
                    console.log(err);
                }
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.redirect("back");
    })
}

// RESET PASSWORD LINK MESSAGE
exports.resetpasswordmessage = (req, res) => {
    res.render("admin/resetpasswordlink", {
        title : "Njala SRMS Password Reset Link Message"
    });
}

// RESET PASSWORD PAGE
exports.resetpassword = (req, res) => {
    User.findById({_id : req.params.id})
    .then(user => {
        if(user){
            // console.dir(res);
            res.render("admin/reset_password", {
                title : "Njal SRMS Reset Admin Password",
                user : user
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
        bcryptjs.genSalt(10)
        .then(salt => {
            bcryptjs.hash(req.body.password, salt)
            .then(hash => {
                if(hash){
                    User.findByIdAndUpdate({_id : req.params.id}, {password : hash})
                    .then(user => {
                        if(user){
                            console.log("ADMIN PASSWORD CHANGED SUCCESSFULLY");
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

// DELETE ADMIN INFORMATION
exports.deleteAdmin = (req, res) => {
    User.findByIdAndDelete({_id : req.params.id})
    .then(user => {
        if(user){
            console.log("USER INFORMATION DELETED SUCCESSFULLY");
            res.redirect("back");
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}
// =====================================================================================

// =====================================================================================
// 404 PAGES
exports.error = (req, res) => {
    res.render("admin/404", {
        title : "404 - Page Not Found"
    });
}
