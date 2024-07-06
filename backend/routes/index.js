const router = require('express').Router();
const passport = require('passport');

//commenting out so we can see logged in/out status
//router.get('/', (req, res) => {
//    //#swagger tags=["Hello World!"]
//    res.send('Hello World!');
//});
router.use("/reviews", require("./reviews"));
router.use("/users", require("./users"));

//login/logout
router.get(
    //#swagger.tags=['Authentication']
    //#swagger.summary='Authenticate User using Github'
    //#swagger.description='This endpoint is used to login.'
    '/login', passport.authenticate('github'), (req, res) => {});

router.get(
    //#swagger.tags=['Authentication']
    //#swagger.summary='Logout Authenticated User'
    //#swagger.description='This endpoint is used to logout.'
    '/logout', function (req, res, next) {
        req.logout(function(err) {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
});


module.exports = router;