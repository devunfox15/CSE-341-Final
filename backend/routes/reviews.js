const router = require("express").Router();
const controller = require("../controllers/reviews");
// const { isAuthenticated } = require("../utils/auth");
// const { commonValidation } = require("../utils/validation");
// const { rules: validationRules, validate } = commonValidation;

router.get("/", controller.getAll);

router.get("/:id", controller.getSingle);

router.post("/", controller.create);

router.put("/:id", controller.update);

router.delete("/:id", controller.delete);

module.exports = router;