const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
	name: {type: String, required: true},
	priority: {type: String, enum: ["high", "medium", "low"]},
	dueDate: Date,
	relatedTo: [String],
	description: String
})

const Task = mongoose.model("Task", taskSchema)

module.exports = Task