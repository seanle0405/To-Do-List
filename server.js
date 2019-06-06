const express = require("express")
const app = express()
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const tasksController = require("./controllers/tasks.js")

app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.use("/tasks", tasksController)
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/basiccrud", {userNewUrlParser: true})
mongoose.connection.once("open", ()=>{
	console.log("connected to mongo")
})

app.listen(3000, ()=>{
	console.log("listening")
})