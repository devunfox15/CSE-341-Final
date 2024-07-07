const isAuthenticated = (req, res, next) => {
    if (!req.session.user || !req.session.user.id) {
        console.log("User session is undefined or does not have an id");
        return res.status(401).json("You do not have access.");
    }
    next();
};

module.exports = { isAuthenticated };
