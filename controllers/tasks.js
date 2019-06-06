const express = require("express")
const router = express.Router()
const Task = require("../models/tasks.js")

//INDEX
router.get("/", (req,res) =>{
	res.render("index.ejs")
})


module.exports = router