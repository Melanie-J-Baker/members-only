const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    first_name: { type: String, required: true, maxLength: 50 },
    last_name: { type: String, required: true, maxLength: 50 },
    username: {
      type: String,
      required: true,
      maxLength: 75,
      match:
        /^(?![_.-])((?![_.-][_.-])[a-zA-Z\d_.-]){0,63}[a-zA-Z\d]@((?!-)((?!--)[a-zA-Z\d-]){0,63}[a-zA-Z\d]\.){1,2}([a-zA-Z]{2,14}\.)?[a-zA-Z]{2,14}$/,
    },
    password: {
      type: String,
      required: true,
    },
    secret: { type: String, default: "", required: false },
    admin: { type: Boolean, default: false, required: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
UserSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.first_name && this.last_name) {
    fullname = `${this.first_name} ${this.last_name}`;
  }
  return fullname;
});

// Virtual for User's URL
UserSchema.virtual("url").get(function () {
  return `/messageboard/user/${this._id}`;
});

module.exports = mongoose.model("User", UserSchema);
