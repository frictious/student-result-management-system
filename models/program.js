const   mongoose                = require("mongoose"),
        Courses                 = require("../models/course");

const programSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    duration : String,
    type: String,
    students : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users"
    }],
    courses : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Courses"
    }]
});

module.exports = mongoose.model("Program", programSchema);
