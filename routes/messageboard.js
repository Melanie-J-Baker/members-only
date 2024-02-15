const express = require("express");
const router = express.Router();
const message_controller = require("../controllers/messageController");
const user_controller = require("../controllers/userController");

// MESSAGE ROUTES

// GET messageboard home page
router.get("/", message_controller.index);

// GET message create form
router.get("/user/create/:id", message_controller.message_create_get);

// POST request for creating message
router.post("/user/create/:id", message_controller.message_create_post);

// GET request to delete Message
router.get("/message/:id/delete", message_controller.message_delete_get);

// POST request to delete Message
router.post("/message/:id/delete", message_controller.message_delete_post);

// GET request to update Message
router.get("/message/:id/update", message_controller.message_update_get);

// POST request to update Message
router.post("/message/:id/update", message_controller.message_update_post);

// GET request for one Message
router.get("/message/:id", message_controller.message_detail);

// GET request for all Messages
router.get("/messages", message_controller.message_list);

// USER ROUTES

// GET request to create User
router.get("/user/create", user_controller.user_create_get);

// POST request to create User
router.post("/user/create", user_controller.user_create_post);

// GET request to log in User
router.get("/user/login", user_controller.user_login_get);

// POST request to log in User
router.post("/user/login", user_controller.user_login_post);

// GET request to log out User
router.get("/user/logout", user_controller.user_logout_get);

// GET request to delete User
router.get("/user/:id/delete", user_controller.user_delete_get);

// POST request to delete User
router.post("/user/:id/delete", user_controller.user_delete_post);

// GET request to update User
router.get("/user/:id/update", user_controller.user_update_get);

// POST request to update User
router.post("/user/:id/update", user_controller.user_update_post);

// GET request for one User
router.get("/user/:id", user_controller.user_detail);

// GET request for list of all Users
router.get("/users", user_controller.user_list);

module.exports = router;
