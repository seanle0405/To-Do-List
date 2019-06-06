const express = require("express")
const router = express.Router()
const Task = require("../models/tasks.js")

//SEED

//INDEX
router.get("/", (req,res) =>{
	res.render("index.ejs")
})


//NEW
router.get("/new", (req,res)=>{
	res.render("new.ejs")
})

module.exports = router