const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
	name: {type: String, required: true},
	priority: String,
	dueDate: Date,
	relatedTo: [String],
	Description: String
})

const Task = mongoose.model("Task", taskSchema)

module.exports = Task