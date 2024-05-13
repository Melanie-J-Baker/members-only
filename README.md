#members-only

Built as part of the Odin Project curriculum: https://www.theodinproject.com/lessons/nodejs-members-only

Try it out here: https://pinto-smiling-celestite.glitch.me/messageboard

A simple members only messageboard built using Express, express-validator, MongoDB, Mongoose, Pug, passport and bcrypt. Members can see who the author of a post is, but non-members can only see the story and not the author.

Form fields are sanitized and validated with express-validator and passwords secured with bcrypt. The confirmPassword field is validated using a custom validator.
When users sign up, they are not automatically given membership status! Members can “join the club” by entering a secret passcode. If they enter the passcode correctly then their membership status is updated. Admins have the added ability to delete messages.

![image](https://github.com/Melanie-J-Baker/members-only/assets/104843873/201d8d3f-4b17-4da2-8108-6d4bd6c7e9de)
![image](https://github.com/Melanie-J-Baker/members-only/assets/104843873/897f3002-6141-4e45-9478-e580a1ea3044)
![image](https://github.com/Melanie-J-Baker/members-only/assets/104843873/602c2698-76e8-43c6-8779-2b2dcd47c26f)
![image](https://github.com/Melanie-J-Baker/members-only/assets/104843873/728d9f96-1f9f-464b-a60c-3a9e6b9b6bbf)
![image](https://github.com/Melanie-J-Baker/members-only/assets/104843873/cc24c7e6-53d6-449a-b856-a8b618cf5fc9)
