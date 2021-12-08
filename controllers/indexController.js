// REQUIRED MODULES WILL BE HERE

// INDEX ROUTE
exports.indexController = (req, res) => {
    res.render("index", {
        title : "Njala SRMS"
    });
}

// LOGIN ROUTE
exports.loginController = (req, res) => {
    res.render("login", {
        title : "NJALA SRMS Login Page"
    });
}

// LOGIN LOGIC
exports.loginLogicController = (req, res) => {
    console.log(req.body);
}
