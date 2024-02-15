const { body, validationResult } = require("express-validator");
const Message = require("../models/message");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  const [numMessages, numUsers] = await Promise.all([
    Message.countDocuments({}).exec(),
    User.countDocuments({}).exec(),
  ]);
  res.render("index", {
    title: "Messageboard",
    message_count: numMessages,
    user_count: numUsers,
  });
});

// Display list of all messages
exports.message_list = asyncHandler(async (req, res, next) => {
  const allMessages = await Message.find({})
    .populate("user")
    .sort({ timestamp: -1 })
    .exec();
  res.render("message_list", {
    title: "All Messages",
    message_list: allMessages,
  });
});

// Display detail page for a specific Message
exports.message_detail = asyncHandler(async (req, res, next) => {
  // Get details of Message
  const message = await Message.findById(req.params.id).populate("user").exec();

  if (message === null) {
    // No results.
    const err = new Error("Message not found");
    err.status = 404;
    return next(err);
  }

  res.render("message_detail", {
    title: message.title,
    message: message,
  });
});

// Display create message form on GET
exports.message_create_get = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).exec();
  res.render("message_form", {
    title: "Create Message",
    user: user,
  });
});

// Handle Message create on POST
exports.message_create_post = [
  // validate and sanitise fields
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("text", "Message must not be empty or contain more than 500 characters.")
    .trim()
    .isLength({ min: 1, max: 500 })
    .escape(),
  // process request after validation and sanitisation
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from request
    const errors = validationResult(req);
    // Create message object with data
    const message = new Message({
      title: req.body.title,
      timestamp: Date.now(),
      text: req.body.text,
      user: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form with sanitised values/error messages
      res.render("message_form", {
        title: "Create Message",
        message: message,
        errors: errors.array(),
      });
    } else {
      // Data is valid. Save message
      await message.save();
      res.redirect(message.url);
    }
  }),
];

// Display Message delete form on GET
exports.message_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of message
  const message = await Message.findById(req.params.id).exec();
  if (message === null) {
    // No results
    res.redirect("/messageboard/messages");
  }
  res.render("message_delete", {
    title: "Delete message",
    message: message,
  });
});

// Handle Message delete on POST
exports.message_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of message
  const message = await Message.findById(req.params.id).populate("user").exec();
  if (message === null) {
    // No results
    res.redirect("/messageboard/messages");
  }
  const user = message.user._id;
  await Message.findByIdAndDelete(req.body.id);
  res.redirect(`/messageboard/user/${user}`);
});

// Display Message update form on GET
exports.message_update_get = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).populate("user").exec();
  if (message === null) {
    // No results
    const err = new Error("Message not found");
    err.status = 404;
    return next(err);
  }
  res.render("message_form", {
    title: "Update message",
    message: message,
  });
});

// Handle Message update on POST
exports.message_update_post = [
  // validate and sanitise fields
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("text", "Message must not be empty or contain more than 500 characters.")
    .trim()
    .isLength({ min: 1, max: 500 })
    .escape(),
  // process request after validation and sanitisation
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from request
    const errors = validationResult(req);
    // Create message object with data
    const message = new Message({
      title: req.body.title,
      timestamp: Date.now(),
      text: req.body.text,
      user: req.params.id,
      _id: req.params.id, // required, or new _id assigned
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form with sanitised values/error messages
      res.render("message_form", {
        title: "Create Message",
        message: message,
        errors: errors.array(),
      });
    } else {
      // Data is valid. Update message
      const updatedMessage = await Message.findByIdAndUpdate(
        req.params.id,
        message,
        {}
      );
      res.render("message_detail", {
        title: updatedMessage.title,
        message: updatedMessage,
      });
    }
  }),
];
