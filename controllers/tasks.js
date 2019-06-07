const express = require("express")
const router = express.Router()
const Task = require("../models/tasks.js")

//SEED

//INDEX
router.get("/", (req,res) =>{
	Task.find({}, (err, allTasks)=>{
		res.render("index.ejs", {hTasks: allTasks.filter(task => task.priority === "high" && !task.completed), mTasks: allTasks.filter(task => task.priority === "medium" && !task.completed), lTasks: allTasks.filter(task => task.priority === "low" && !task.completed), cTasks: allTasks.filter(task => task.completed)})
	})
})

//NEW
router.get("/new", (req,res)=>{
	res.render("new.ejs")
})
router.post("/", (req,res)=>{
	let relatedTo = req.body.relatedTo.split(",")
	for(let i = 0; i< relatedTo.length; i++){
		relatedTo[i] = relatedTo[i].trim()
	}
	req.body.relatedTo = relatedTo
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
	Task.findByIdAndUpdate(req.params.id, req.body,  (err, updatedModel)=>{
		res.redirect("/tasks")
	})
})

//COMPLETED & UNDO
router.post("/:id", (req, res) =>{
	Task.findById(req.params.id, (err, foundTask) =>{
		foundTask.completed = !foundTask.completed
		foundTask.save((err, updatedTask)=>{
			res.redirect("/tasks")
		})
	})
})

module.exports = router