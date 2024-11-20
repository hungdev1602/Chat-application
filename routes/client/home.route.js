const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("client/pages/chat/index", {
    pageTitle: "Chat App"
  });
})

module.exports = router