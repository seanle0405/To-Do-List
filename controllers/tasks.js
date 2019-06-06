const express = require("express")
const router = express.Router()
const Task = require("../models/tasks.js")

//SEED

//INDEX
router.get("/", (req,res) =>{
	Task.find({}, (err, allTasks)=>{
		res.render("index.ejs", {tasks: allTasks})
	})
})

//NEW
router.get("/new", (req,res)=>{
	res.render("new.ejs")
})
router.post("/", (req,res)=>{
	Task.create(req.body, (err, createdTask)=>{
		console.log(createdTask)
		res.redirect("/tasks")
	})
})

//SHOW
router.get("/:id", (req,res)=>{
	Task.findById(req.params.id, (err, foundTask)=>{
		console.log(foundTask)
		res.render("show.ejs", {task: foundTask})
	})
})

//DELETE
router.delete("/:id", (req,res)=>{
	Task.findByIdAndRemove(req.params.id, (err, data)=>{
		res.redirect("/tasks")
	})
})

//EDIT
router.get("/:id/edit", (req,res) =>{
	Task.findById(req.params.id, (err, foundTask)=>{
		res.render("edit.ejs", {task: foundTask})
	})
})

router.put("/:id", (req, res)=>{
	if(req.body.completed === "on"){
		req.body.completed = true
	}else{
		req.body.completed = false
	}
	Task.findByIdAndUpdate(req.params.id, req.body, (err, updatedModel)=>{
		res.redirect("/tasks")
	})
})

module.exports = router