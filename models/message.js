const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;
const MessageSchema = new Schema({
  title: { type: String, required: true, maxLength: 40 },
  timestamp: { type: Date, default: Date.now() },
  text: { type: String, required: true, maxLength: 500 },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// Virtual for Message's URL
MessageSchema.virtual("url").get(function () {
  return `/messageboard/message/${this._id}`;
});

MessageSchema.virtual("timestamp_formatted").get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(
    DateTime.DATETIME_MED
  );
});

module.exports = mongoose.model("Message", MessageSchema);
