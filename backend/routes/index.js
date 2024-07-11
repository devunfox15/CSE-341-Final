const router = require('express').Router();
const passport = require('passport');

//commenting out so we can see logged in/out status
//router.get('/', (req, res) => {
//    //#swagger tags=["Hello World!"]
//    res.send('Hello World!');
//});
router.use('/reviews', require('./reviews'));
router.use('/users', require('./users'));
router.use('/orders', require('./orders'));
router.use('/products', require('./products'));
router.use('/api-docs', require('./swagger'));

//login/logout
router.get(
    //#swagger.tags=['Authentication']
    //#swagger.summary='Authenticate User using Github.  Cannot be done from here.  Visit /login'
    //#swagger.description='This endpoint is used to login.'
    '/login',
    passport.authenticate('github'),
    (req, res) => {
        res.redirect('/');
    }
);

router.get(
    //#swagger.tags=['Authentication']
    //#swagger.summary='Logout Authenticated User.  Cannot be done from here.  Visit /logout'
    //#swagger.description='This endpoint is used to logout.'
    '/logout',
    function (req, res, next) {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    }
);

module.exports = router;
