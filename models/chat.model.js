const mogoose = require("mongoose");

const chatSchema = new mogoose.Schema(
  {
    userId: String,
    // roomChatId: String,
    content: String,
    // images: Array,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
)

const Chat = mogoose.model("Chat", chatSchema, "chats")

module.exports = Chat