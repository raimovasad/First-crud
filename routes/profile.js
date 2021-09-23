const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth");
const User = require("../models/user");
const fileMiddleware = require("../middleware/file");

router.get("/", auth, async (req, res) => {
  res.render("profile", {
    title: "Profile",
    isProfile: true,
    user: req.user.toObject(),
  });
});

router.post("/", auth, fileMiddleware.single("avatar"), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const toChange = {
      name: req.body.name,
    };

    if (req.file) {
      toChange.avatarUrl = req.file.filename;
    }

    Object.assign(user, toChange);
    await user.save();
    res.redirect("/profile");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
