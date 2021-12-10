const   mongoose                = require("mongoose");

const adminSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : String,
    password : String,
    role : {
        type : String,
        requried : true
    }
});

module.exports = mongoose.model("Admin", adminSchema);
