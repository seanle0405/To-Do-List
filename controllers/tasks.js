const express = require("express")
const router = express.Router()
const Task = require("../models/tasks.js")
const moment = require("moment")
const session = require("express-session")

const createRelatedList = (allTasks) =>{
	let relatedList = []
	for(let i = 0; i < allTasks.length; i++){
		for(let j = 0; j < allTasks[i].relatedTo.length; j++){
			if(!relatedList.includes(allTasks[i].relatedTo[j])){
				relatedList.push(allTasks[i].relatedTo[j])
			}
		}
	}
	return	relatedList
}

const createDateArray = (allTasks) =>{
	let dateArray = []
	for (let i = 0; i < allTasks.length; i++){
		if(i === 0){
			dateArray.push(moment(allTasks[0].dueDate).format("MM/DD/YYYY"))
		}else{
			if(moment(allTasks[i].dueDate).format("MM/DD/YYYY") != moment(allTasks[i-1].dueDate).format("MM/DD/YYYY")){
				dateArray.push(moment(allTasks[i].dueDate).format("MM/DD/YYYY"))
			}else{
				dateArray.push("")
			}
		}	
	}
	return dateArray
}

const createAllDateArray = (allTasks) =>{
	let dateArray = []
	for(let i = 0; i<allTasks.length; i++){
		dateArray.push(moment(allTasks[i].dueDate).format("MM/DD/YYYY"))
	}
	return dateArray
}

//INDEX
router.get("/", (req,res) =>{
	if(req.session.currentUser){
		if(req.session.currentUser.username == "admin"){
			Task.find({}, (err, allTasks)=>{
				res.render("index.ejs", {
					hTasks: allTasks.filter(task => task.priority === "high" && !task.completed),
					mTasks: allTasks.filter(task => task.priority === "medium" && !task.completed),
					lTasks: allTasks.filter(task => task.priority === "low" && !task.completed),
					cTasks: allTasks.filter(task => task.completed),
					hDates: createAllDateArray(allTasks.filter(task => task.priority === "high" && !task.completed)),
					mDates: createAllDateArray(allTasks.filter(task => task.priority === "medium" && !task.completed)),
					lDates: createAllDateArray(allTasks.filter(task => task.priority === "low" && !task.completed)),
					relatedTo: createRelatedList(allTasks),
					currentUser: req.session.currentUser
				})
			})
		}else{
			Task.find({user: req.session.currentUser.username}, (err, allTasks)=>{
				res.render("index.ejs", {
					hTasks: allTasks.filter(task => task.priority === "high" && !task.completed),
					mTasks: allTasks.filter(task => task.priority === "medium" && !task.completed),
					lTasks: allTasks.filter(task => task.priority === "low" && !task.completed),
					cTasks: allTasks.filter(task => task.completed),
					hDates: createAllDateArray(allTasks.filter(task => task.priority === "high" && !task.completed)),
					mDates: createAllDateArray(allTasks.filter(task => task.priority === "medium" && !task.completed)),
					lDates: createAllDateArray(allTasks.filter(task => task.priority === "low" && !task.completed)),
					relatedTo: createRelatedList(allTasks),
					currentUser: req.session.currentUser
				})
			})
		}
	}else{
		res.redirect("/sessions/new")
	}
})
//byDate
router.get("/sort/date", (req,res) =>{
	if(req.session.currentUser){
		if(req.session.currentUser.username == "admin"){
			Task.find({}).sort("dueDate").exec((err, allTasks) =>{
				res.render("index_date.ejs",{
					tasks: allTasks.filter(task => !task.completed),
					relatedTo: createRelatedList(allTasks.filter(task => !task.completed)),
					dates: createDateArray(allTasks.filter(task => !task.completed)),
					currentUser: req.session.currentUser
				})
			})
		}else{
			Task.find({user: req.session.currentUser.username}).sort("dueDate").exec((err, allTasks) =>{
				res.render("index_date.ejs",{
					tasks: allTasks.filter(task => !task.completed),
					relatedTo: createRelatedList(allTasks.filter(task => !task.completed)),
					dates: createDateArray(allTasks.filter(task => !task.completed)),
					currentUser: req.session.currentUser
				})
			})
		}
	}else{
		res.redirect("/sessions/new")
	}
	
})

//NEW
router.get("/new", (req,res)=>{
	res.render("new.ejs", {currentUser: req.session.currentUser})
})
router.post("/", (req,res)=>{
	let relatedTo
	if(req.body.relatedTo === ""){
		relatedTo = []
	}else{
		relatedTo = req.body.relatedTo.split(",")
		for(let i = 0; i< relatedTo.length; i++){
			relatedTo[i] = relatedTo[i].trim()
		}

	}
	
	req.body.relatedTo = relatedTo
	req.body.dueDate = moment(req.body.dueDate).format()
	Task.create(req.body, (err, createdTask)=>{
		res.redirect("/tasks")
	})
})

//SHOW
router.get("/:id", (req,res)=>{
	Task.findById(req.params.id, (err, foundTask)=>{
		res.render("show.ejs", {
			task: foundTask, 
			date: moment(foundTask.dueDate).format("MMMM Do, YYYY"),
			currentUser: req.session.currentUser
		})

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
		let relatedTo = foundTask.relatedTo[0]
		for(let i = 1; i < foundTask.relatedTo.length; i++){
			relatedTo += `, ${foundTask.relatedTo[i]}`
		}
		res.render("edit.ejs", {
			task: foundTask, 
			relatedTo: relatedTo,
			date: moment(foundTask.dueDate).format("MM/DD/YYYY"),
			currentUser: req.session.currentUser
		})
	})
})

router.put("/:id", (req, res)=>{
	if(req.body.completed === "on"){
		req.body.completed = true
	}else{
		req.body.completed = false
	}
	let relatedTo
	if(req.body.relatedTo === ""){
		relatedTo = []
	}else{
		relatedTo = req.body.relatedTo.split(",")
		for(let i = 0; i< relatedTo.length; i++){
			relatedTo[i] = relatedTo[i].trim()
		}

	}
	req.body.relatedTo = relatedTo
	req.body.dueDate = moment(req.body.dueDate).format()
	Task.findByIdAndUpdate(req.params.id, req.body,  (err, updatedModel)=>{
		res.redirect("/tasks/"+ req.params.id)
	})
})

//COMPLETED & UNDO
router.post("/:id", (req, res) =>{
	Task.findById(req.params.id, (err, foundTask) =>{
		foundTask.completed = !foundTask.completed
		foundTask.save((err, updatedTask)=>{
			res.redirect("back")
		})
	})
})

//FILTER
router.get("/filter/:relatedTo", (req,res) =>{
	if(req.session.currentUser){
		if(req.session.currentUser.username == "admin"){
			Task.find({}, (err, allTasks) =>{
				res.render("index.ejs", {
					hTasks: allTasks.filter(task => task.priority === "high" && !task.completed && task.relatedTo.includes(req.params.relatedTo)),
					mTasks: allTasks.filter(task => task.priority === "medium" && !task.completed && task.relatedTo.includes(req.params.relatedTo)),
					lTasks: allTasks.filter(task => task.priority === "low" && !task.completed && task.relatedTo.includes(req.params.relatedTo)),
					cTasks: allTasks.filter(task => task.completed && task.relatedTo.includes(req.params.relatedTo)),
					hDates: createAllDateArray(allTasks.filter(task => task.priority === "high" && !task.completed && task.relatedTo.includes(req.params.relatedTo))),
					mDates: createAllDateArray(allTasks.filter(task => task.priority === "medium" && !task.completed && task.relatedTo.includes(req.params.relatedTo))),
					lDates: createAllDateArray(allTasks.filter(task => task.priority === "low" && !task.completed && task.relatedTo.includes(req.params.relatedTo))),
					relatedTo: createRelatedList(allTasks),
					currentUser: req.session.currentUser
				})
			})
		}else{
			Task.find({user: req.session.currentUser.username}, (err, allTasks) =>{
				res.render("index.ejs", {
					hTasks: allTasks.filter(task => task.priority === "high" && !task.completed && task.relatedTo.includes(req.params.relatedTo)),
					mTasks: allTasks.filter(task => task.priority === "medium" && !task.completed && task.relatedTo.includes(req.params.relatedTo)),
					lTasks: allTasks.filter(task => task.priority === "low" && !task.completed && task.relatedTo.includes(req.params.relatedTo)),
					cTasks: allTasks.filter(task => task.completed && task.relatedTo.includes(req.params.relatedTo)),
					hDates: createAllDateArray(allTasks.filter(task => task.priority === "high" && !task.completed && task.relatedTo.includes(req.params.relatedTo))),
					mDates: createAllDateArray(allTasks.filter(task => task.priority === "medium" && !task.completed && task.relatedTo.includes(req.params.relatedTo))),
					lDates: createAllDateArray(allTasks.filter(task => task.priority === "low" && !task.completed && task.relatedTo.includes(req.params.relatedTo))),
					relatedTo: createRelatedList(allTasks),
					currentUser: req.session.currentUser
				})
			})
		}
	}else{
		res.redirect("/sessions/new")
	}
	
})

router.post("/filter/relatedTo", (req,res) =>{
	res.redirect("/tasks/filter/"+req.body.relatedTo)
})

//byDate
router.get("/sort/date/filter/:relatedTo", (req,res) =>{
	if(req.session.currentUser){
		if(req.session.currentUser.username == "admin"){
			Task.find({}).sort("dueDate").exec((err, allTasks) =>{
				res.render("index_date.ejs",{
					tasks: allTasks.filter(task => !task.completed && task.relatedTo.includes(req.params.relatedTo)),
					relatedTo: createRelatedList(allTasks.filter(task => !task.completed)),
					dates: createDateArray(allTasks.filter(task => !task.completed && task.relatedTo.includes(req.params.relatedTo))),
					currentUser: req.session.currentUser
				})
			})
		}else{
			Task.find({user: req.session.currentUser.username}).sort("dueDate").exec((err, allTasks) =>{
				res.render("index_date.ejs",{
					tasks: allTasks.filter(task => !task.completed && task.relatedTo.includes(req.params.relatedTo)),
					relatedTo: createRelatedList(allTasks.filter(task => !task.completed)),
					dates: createDateArray(allTasks.filter(task => !task.completed && task.relatedTo.includes(req.params.relatedTo))),
					currentUser: req.session.currentUser
				})
			})

		}
	}else{
		res.redirect("/sessions/new")
	}
	
})
router.post("/sort/date/filter/relatedTo", (req,res)=>{
	res.redirect("/tasks/sort/date/filter/" + req.body.relatedTo)
})



module.exports = router
