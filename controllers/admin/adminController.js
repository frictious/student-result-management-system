const   Admin           = require("../../models/admin"),
        bcryptjs          = require("bcryptjs");

// DASHBOARD ROOT ROUTE
exports.index = (req, res) => {
    res.render("admin/index", {
        title : "Njala SRMS Admin Panel"
    });
}

// =====================================================================================
// VIEW ALL USERS
exports.viewAdmins = (req, res) => {
    Admin.find({})
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
                Admin.create({
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
    Admin.findById({_id : req.params.id})
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
        Admin.findByIdAndUpdate({_id : req.params.id}, {
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
        Admin.findByIdAndUpdate({_id : req.params.id}, req.body)
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
    }
}

// DELETE ADMIN INFORMATION
exports.deleteAdmin = (req, res) => {
    Admin.findByIdAndDelete({_id : req.params.id})
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
