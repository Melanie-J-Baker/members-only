#! /usr/bin/env node

console.log(
  'This script populates some test users and messages to database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Message = require("./models/message");
const User = require("./models/user");

const users = [];
const messages = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createUsers();
  await createMessages();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function userCreate(
  index,
  first_name,
  last_name,
  username,
  password,
  secret,
  admin
) {
  const userdetail = {
    first_name: first_name,
    last_name: last_name,
    username: username,
    password: password,
    secret: secret,
    admin: admin,
  };

  const user = new User(userdetail);

  await user.save();
  users[index] = user;
  console.log(`Added user: ${first_name} ${last_name}`);
}

async function messageCreate(index, title, timestamp, text, user) {
  const messagedetail = {
    title: title,
    timestamp: timestamp,
    text: text,
    user: user,
  };

  const message = new Message(messagedetail);
  await message.save();
  messages[index] = message;
  console.log(`Added message: ${title}`);
}

async function createUsers() {
  console.log("Adding users");
  await Promise.all([
    userCreate(
      0,
      "Patrick",
      "Rothfuss",
      "prothfuss@hotmail.com",
      "TestUser0",
      "secret",
      false
    ),
    userCreate(1, "Ben", "Bova", "benbova@live.co.uk", "TestUser1", "secret"),
    userCreate(
      2,
      "Isaac",
      "Asimov",
      "iasimov@hotmail.co.uk",
      "TestUser2",
      "secret",
      false
    ),
    userCreate(
      3,
      "Bob",
      "Billings",
      "bobbillings@gmail.com",
      "TestUser3",
      "secret",
      false
    ),
    userCreate(4, "Jim", "Jones", "jimjones@yahoo.com", "TestUser4", "", true),
  ]);
}

async function createMessages() {
  console.log("Adding Messages");
  await Promise.all([
    messageCreate(
      0,
      "Test Message 0",
      Date.now(),
      "Aenean pulvinar dolor enim, et vulputate dolor blandit quis. Praesent aliquam nibh ut metus tristique, ac facilisis elit facilisis. Nullam tincidunt nulla aliquam quam tempus, nec accumsan dolor volutpat. Quisque volutpat turpis facilisis quam viverra, in tincidunt mi hendrerit. Mauris quis consequat purus, vitae mattis justo. Maecenas lacinia arcu lacus, et condimentum augue venenatis quis.",
      users[0]
    ),
    messageCreate(
      1,
      "Test Message 1",
      Date.now(),
      "Nunc dictum eros mi, in vehicula leo egestas vitae. Aenean non rutrum lorem, non lobortis enim. Vivamus in justo ac metus efficitur iaculis. Cras purus purus, iaculis non faucibus id, tempus ac lectus. Donec sit amet orci elementum, fermentum augue at, aliquam erat. Nulla sodales ex eu enim venenatis sollicitudin. Integer in feugiat diam. Donec eu luctus ante. Nulla tempus at nibh at suscipit.",
      users[0]
    ),
    messageCreate(
      2,
      "Test Message 2",
      Date.now(),
      "Nulla commodo tempor ipsum, eu feugiat metus lobortis vitae. Nam egestas ante neque, eget vehicula velit maximus at. Phasellus sollicitudin tincidunt luctus. Aenean vitae metus tempor, tempor justo sed, egestas nulla. Duis sollicitudin neque mi, pharetra pellentesque leo dignissim et. Sed a blandit lorem. Praesent mollis felis ut maximus egestas. Sed ullamcorper, sapien eu tristique pulvinar, nisl eros volutpat metus, rutrum finibus turpis purus ac odio.",
      users[0]
    ),
    messageCreate(
      3,
      "Test Message 3",
      Date.now(),
      "Nullam auctor id ligula sed elementum. Nulla efficitur justo nulla, ornare semper purus interdum eu. Phasellus aliquam fringilla lacus, non consequat nisi sodales ut. Proin maximus porttitor purus, a iaculis sem suscipit finibus. Sed dapibus sapien elit, eu auctor diam egestas sed. Quisque sit amet ipsum ipsum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse eu nisi ut dui iaculis pellentesque.",
      users[1]
    ),
    messageCreate(
      4,
      "Test Message 4",
      Date.now(),
      "Vestibulum iaculis et risus sed vehicula. Proin mi diam, scelerisque tempor dictum et, rutrum non sapien. Quisque pretium, urna et congue fringilla, ex sem imperdiet felis, eget dapibus quam nulla eget eros. Mauris quis commodo leo. Aenean dapibus dapibus ante. In tincidunt non erat eget pulvinar. Nam rhoncus mauris id molestie pulvinar.",
      users[1]
    ),
    messageCreate(
      5,
      "Test Message 5",
      Date.now(),
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec hendrerit orci a facilisis pulvinar. Aliquam sed laoreet metus. Praesent fermentum, lacus sed pellentesque sodales, neque lectus iaculis ante, nec malesuada ligula sapien vitae ex. Duis et fringilla est. Vestibulum in tortor quis erat finibus molestie. Suspendisse imperdiet malesuada dui ac porta. In a lorem blandit, commodo nisi ut, auctor lectus.",
      users[4]
    ),
    messageCreate(
      6,
      "Test Message 6",
      Date.now(),
      "In efficitur libero ut risus sodales gravida. Sed ullamcorper velit ac diam semper, eget ultricies lorem elementum. Donec facilisis semper suscipit. Morbi et molestie est. Sed dolor erat, euismod a cursus vitae, ullamcorper ut nisi. Vivamus ipsum nibh, bibendum at efficitur eu, dapibus ac augue. Proin molestie dolor at diam lacinia blandit. Vestibulum pharetra neque ipsum, vel mattis ante rhoncus ac. Cras venenatis commodo elit, pellentesque vulputate enim porttitor nec.",
      users[4]
    ),
  ]);
}
