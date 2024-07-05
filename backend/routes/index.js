const router = require('express').Router();


router.get('/', (req, res) => {
    //#swagger tags=["Hello World!"]
    res.send('Hello World!');
});
router.use("/reviews", require("./reviews"));
router.use("/users", require("./users"));



module.exports = router;