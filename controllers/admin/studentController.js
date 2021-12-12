const   Student                 = require("../../models/user"),
        Program                 = require("../../models/program"),
        nodemailer              = require("nodemailer"),
        bcrypt                  = require("bcryptjs");

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

// GET ALL STUDENTS
exports.students = (req, res) => {
    Student.find({})
    .then(students => {
        if(students){
            res.render("admin/students/students", {
                title : "Njala SRMS Students",
                students : students
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

// ADD STUDENT FORM
exports.addStudent = (req, res) => {
    Program.find({})
    .then(programs => {
        if(programs){
            res.render("admin/students/add", {
                title : "Njala SRMS Add Student Form",
                programs : programs
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

// ADD STUDENT LOGIC
exports.addStudentLogic = (req, res) => {
    if(req.body.password !== ""){
        Student.findOne({studentID : req.body.studentID})
        .then(foundStudent => {
            if(!foundStudent){
                bcrypt.genSalt(10)
                .then(salt => {
                    bcrypt.hash(req.body.password, salt)
                    .then(hash => {
                        if(hash){
                            Student.create({
                                studentID : req.body.studentID,
                                name : req.body.name,
                                email : req.body.email,
                                password : hash,
                                current_year : req.body.current_year,
                                program : req.body.program,
                                role : "Student"
                            })
                            .then(student => {
                                Program.findOne({name : req.body.program})
                                .then(program => {
                                    if(program){
                                        program.students.push(student);//ADDING STUDENT TO THAT PROGRAM
                                        console.log("STUDENT INFORMATION ADDED TO PROGRAM");
                                        program.save();//SAVING THE STUDENT ID TO THAT PROGRAM
                                        
                                        //Send mail to student after successful registration
                                        const mailOptions = {
                                            from: process.env.EMAIL,
                                            to: req.body.email,
                                            subject : `Njala University Student Result Management System Login Information`,
                                            html: `<p>Dear <strong>${req.body.name}</strong>,</p>
                                            <p>This email is to inform you that you have been registered into the Njala University Student Result Management System.</p>
                                            <p>Your id is: <strong>${req.body.studentID}</strong>.</p>
                                            <p>Your email is <strong>${req.body.email}</strong>.</p>
                                            <p>And your password is <strong>${req.body.password}</strong>.</p>
                                            <p>Please keep your login information private. If you so wish to change your password for security purposes, you can do so via the portal</p>

                                            <p>Bear in  mind that you can and should change your password so it can be kept safe.</p>
                                            
                                            <br><br>
                                            <p>Sincerely</p>
                                            <p>Exams Office</p>`
                                        }
                
                                        //Sending mail
                                        transport.sendMail(mailOptions, (err, mail) => {
                                            if(!err){
                                                console.log("MAIL SENT TO STUDENT");
                                                res.redirect("/admin/students");
                                            }else{
                                                console.log(err);
                                            }
                                        });
                                    }
                                })
                            })
                        }
                    })
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
}

// EDIT STUDENT FORM
exports.editStudent = (req, res) => {
    Student.findById({_id : req.params.id})
    .then(student => {
        if(student){
            res.render("admin/students/update", {
                title : "Njala SRMS Student Information Edit Form"
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

// EDIT STUDENT LOGIC
exports.editStudentLogic = (req, res) => {
    if(req.body.password === ""){
        Student.findByIdAndUpdate({_id : req.params.id}, {
            studentID : req.body.studentID,
            name : req.body.name,
            email : req.body.name,
            current_year : req.body.current_year,
            program : req.body.program
        })
        .then(student => {
            if(student){
                console.log("STUDENT INFORMATION UPDATED SUCCESSFULLY");
                res.redirect("/admin/students");
            }
        })
    }else{
        bcrypt.genSalt(10)
        .then(salt => {
            bcrypt.hash(req.body.password, salt)
            .then(hash => {
                if(hash){
                    Student.create({
                        studentID : req.body.studentID,
                        name : req.body.name,
                        email : req.body.name,
                        password : hash,
                        current_year : req.body.current_year,
                        program : req.body.program
                    })
                    .then(student => {
                        Program.findOne({name : req.body.program})
                        .then(program => {
                            if(program){
                                program.students.push(student);//ADDING STUDENT TO THAT PROGRAM
                                program.save();//SAVING THE STUDENT ID TO THAT PROGRAM
                                
                                //Send mail to student after successful registration
                                const mailOptions = {
                                    from: process.env.EMAIL,
                                    to: req.body.email,
                                    subject : `Njala Student Result Management System Login Information`,
                                    html: `<p>Dear <strong>${req.body.name}</strong>,</p>
                                    <p>This email is to inform you that your password just changed, if this was not you, kindly use the link below to change your password and secure your account.</p>
                                    
                                    <p>If this was you, ignore this message.</p>

                                    <br><br>
                                    <p>Sincerely</p>
                                    <p>Exams Office</p>`
                                }
        
                                //Sending mail
                                transport.sendMail(mailOptions, (err, mail) => {
                                    if(!err){
                                        res.redirect("/admin/students");
                                    }else{
                                        console.log(err);
                                    }
                                });
                            }
                        })
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
    }
}

// DELETE STUDENT
exports.deleteStudent = (req, res) => {
    Student.findByIdAndDelete({_id : req.params.id})
    .then(student => {
        if(student){
            console.log("STUDENT INFORMATION DELETED SUCCESSFULLY");
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