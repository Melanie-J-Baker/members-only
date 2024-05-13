#members-only

Built as part of the Odin Project curriculum: https://www.theodinproject.com/lessons/nodejs-members-only

Try it out here: https://pinto-smiling-celestite.glitch.me/messageboard

A simple members only messageboard built using Express, express-validator, MongoDB, Mongoose, Pug, passport and bcrypt. Members can see who the author of a post is, but non-members can only see the story and not the author.

Form fields are sanitized and validated with express-validator and passwords secured with bcrypt. The confirmPassword field is validated using a custom validator.
When users sign up, they are not automatically given membership status! Members can “join the club” by entering a secret passcode. If they enter the passcode correctly then their membership status is updated. Admins have the added ability to delete messages.
