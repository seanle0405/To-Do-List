const express = require("express")
const app = express()
const mongoose = require("mongoose")
const session = require("express-session")
const methodOverride = require("method-override")
const tasksController = require("./controllers/tasks.js")
const usersController = require("./controllers/users.js")
const sessionsController = require("./controllers/sessions.js")

app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.use(express.static("public"))
app.use(session({
	secret: "feedmeseymour",
	resave: false,
	saveUninitialized: false
}))

mongoose.connect("mongodb://localhost:27017/basiccrud", {userNewUrlParser: true})
mongoose.connection.once("open", ()=>{
	console.log("connected to mongo")
})

app.use("/sessions", sessionsController)
app.use("/users", usersController)
app.use("/tasks", tasksController)
app.listen(3000, ()=>{
	console.log("listening")
})