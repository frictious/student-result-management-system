const   mongoose                = require("mongoose");

const studentSchema = mongoose.Schema({
    studentID : Number,
    name : {
        type: String,
        required : true
    },
    email : String,
    password : String,
    current_year : String,
    program : String,
    role : String
});

module.exports = mongoose.model("Students", studentSchema);
