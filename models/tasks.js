const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
	name: {type: String, required: true},
	priority: {type: String, enum: ["high", "medium", "low"]},
	completed: {type: Boolean, default: false},
	dueDate: {type: Date, default: Date.now},
	relatedTo: [String],
	description: String,
	user: String
})

const Task = mongoose.model("Task", taskSchema)

module.exports = Task