const User = require("../models/user");
const Message = require("../models/message");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const debug = require("debug")("user");
const passport = require("passport");
const bcrypt = require("bcryptjs");

// Display list of all users
exports.user_list = asyncHandler(async (req, res) => {
  const allUsers = await User.find().sort({ name: 1 }).exec();
  res.render("user_list", {
    title: "All users",
    user_list: allUsers,
  });
});

// Display detail page for a specific User
exports.user_detail = asyncHandler(async (req, res, next) => {
  // Get details of user and all their messages (in parallel)
  const [user, allMessagesByUser] = await Promise.all([
    User.findById(req.params.id).exec(),
    Message.find({ user: req.params.id }, "title timestamp").exec(),
  ]);

  if (user === null) {
    // No results.
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }

  res.render("user_detail", {
    title: "User Detail",
    user: user,
    user_messages: allMessagesByUser,
  });
});

// Display sign-up form on GET
exports.user_create_get = (req, res) => {
  res.render("sign_up_form", { title: "Create Account" });
};

// Handle User create on POST
exports.user_create_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified"),
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Last name must be specified"),
  body("username", "Invalid username").trim().isLength({ min: 1, max: 30 }),
  body("password", "Invalid password").isLength({ min: 8 }),
  body("password_confirm").custom(async (password_confirm, { req }) => {
    const password = req.body.password;
    // If passwords do not match throw error
    if (password !== password_confirm) {
      throw new Error("Passwords do not match");
    }
  }),
  body("secret").custom(async (secret, { req }) => {
    if (secret && secret !== "secret") {
      throw new Error(
        "That is not the correct password. Passwords are case sensitive."
      );
    }
  }),
  body("adminPassword").custom(async (adminPassword, { req }) => {
    if (adminPassword && adminPassword !== "omnipotent") {
      throw new Error(
        "That is not the correct password. Passwords are case sensitive"
      );
    }
  }),
  // Process req after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from a req
    const errors = validationResult(req);
    // If correct admin password mark user as admin
    const isAdmin = req.body.adminPassword == "omnipotent" ? true : false;
    // Hash password
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        next(err);
      } else {
        const user = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          password: hashedPassword,
          secret: req.body.secret,
          admin: isAdmin,
        });
        if (!errors.isEmpty()) {
          res.render("sign_up_form", {
            title: "Create Account",
            user: user,
            errors: errors.array(),
          });
          return;
        } else {
          const userExists = await User.findOne({
            username: req.body.username,
          }).exec();
          if (userExists) {
            res.redirect(userExists.url);
          } else {
            await user.save();
            req.login(user, function (err) {
              if (!err) {
                res.redirect(user.url);
              } else {
                next(err);
              }
            });
          }
        }
      }
    });
  }),
];

// Display User login form on GET
exports.user_login_get = (req, res) => {
  res.render("log_in_form", { title: "Log in" });
};

// Handle User login on POST
exports.user_login_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/messageboard/user/login",
});

// Handle User logout on GET
exports.user_logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

// Display User delete form on GET
exports.user_delete_get = asyncHandler(async (req, res) => {
  // Get details of user and their messages in parallel
  const [user, allMessagesByUser] = await Promise.all([
    User.findById(req.params.id).exec(),
    Message.find({ user: req.params.id }, "title timestamp").exec(),
  ]);
  if (user === null) {
    res.redirect("/messageboard/users");
  }
  res.render("user_delete", {
    title: "Delete account",
    user: user,
    user_messages: allMessagesByUser,
  });
});

// Handle User delete on POST
exports.user_delete_post = asyncHandler(async (req, res) => {
  // Get details of user and their messages in parallel
  const [user, allMessagesByUser] = await Promise.all([
    User.findById(req.params.id).exec(),
    Message.find({ user: req.params.id }, "title user timestamp").exec(),
  ]);
  if (allMessagesByUser.length > 0) {
    // User has messages. Render in same way as for GET route
    res.render("user_delete", {
      title: "Delete account",
      user: user,
      user_messages: allMessagesByUser,
    });
    return;
  } else {
    // User has no messages. Delete object and redirect to list of users
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/messageboard");
  }
});

// Display User update form on GET
exports.user_update_get = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).exec();
  if (user === null) {
    // No results
    debug(`id not found on update: ${req.params.id}`);
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }
  res.render("user_form", { title: "Update account", user: user });
});

// Handle User update on POST
exports.user_update_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified"),
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Last name must be specified"),
  body("username", "Invalid username").trim().isLength({ min: 1, max: 30 }),
  body("password", "Invalid password").isLength({ min: 8 }),
  body("password_confirm").custom(async (password_confirm, { req }) => {
    const password = req.body.password;
    // If passwords do not match throw error
    if (password !== password_confirm) {
      throw new Error("Passwords do not match");
    }
  }),
  body("secret").custom(async (secret, { req }) => {
    if (secret && secret !== "secret") {
      throw new Error(
        "That is not the correct password. Passwords are case sensitive."
      );
    }
  }),
  body("adminPassword").custom(async (adminPassword, { req }) => {
    if (adminPassword && adminPassword !== "omnipotent") {
      throw new Error(
        "That is not the correct password. Passwords are case sensitive"
      );
    }
  }),
  // Process req after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from the request
    const errors = validationResult(req);
    // If correct admin password mark user as admin
    const isAdmin = req.body.adminPassword == "omnipotent" ? true : false;
    // Hash password
    const hashPassword = bcrypt.hash(
      req.body.password,
      10,
      async (err, hashedPassword) => {
        if (err) {
          next(err);
        } else {
          return hashedPassword;
        }
      }
    );
    // Create user object with data (and old id)
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: hashPassword,
      secret: req.body.secret,
      admin: isAdmin,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      // There are errors. Render form with sanitised values/error messages
      res.render("user_form", {
        title: "Update account",
        user: user,
        errors: errors.array(),
      });
      return;
    } else {
      // Data is valid - update user
      await User.findByIdAndUpdate(req.params.id, user);
      // Keep user logged in
      req.login(user, function (err) {
        if (!err) {
          // Redirect to user detail page
          res.redirect(user.url);
        } else {
          next(err);
        }
      });
    }
  }),
];
