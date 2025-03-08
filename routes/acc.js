const express = require("express");
const router = express.Router();
const emails = require("../json/emails.json")
const fs = require('fs')


router.post("/register", function (req, res) {
    const email = req.body.email
    if (emails.includes(email)) {
      res.render("message.html", { message: "Tato emailová adresa je již zaregistrovaná."})
    } else {
      emails.push(email)
      const emailsStringified = JSON.stringify(emails)
      fs.writeFileSync("./json/emails.json", emailsStringified, "utf-8")
      res.render("message.html", { message: "Tvá emailová adresa byla úspěšně zaregistrovaná!"})
    }
})

router.get("/cancel", function (req, res) {
  res.render("cancelemail.html")
})

router.post("/cancel", function (req, res) {
    const email = req.body.email
    if (emails.includes(email)) {
      const newemails = emails.filter((e) => e !== email)
      const emailsStringified = JSON.stringify(newemails)
      fs.writeFileSync("./json/emails.json", emailsStringified, "utf-8")
      res.render("message.html", { message: "Tvá emailová adresa byla úspěšně odebrána."})
    } else {
      res.render("message.html", { message: "Tato emailová adresa není zaregistrovaná."})
    }
})

module.exports = router;