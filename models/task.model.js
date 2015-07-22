var mongoose = require('mongoose')
var _ = require('lodash')
var Task;
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
  // setup schema here
  parent: { type: Schema.Types.ObjectId, ref: 'Task'},
  name: { type: String, required: true },
  complete: { type: Boolean, required: true, default: false },
  due: Date
  
});

//virtuals

TaskSchema.virtual('timeRemaining').get(function() {
  var due = this.due;
  if (!due) {
  	return Infinity;
  }
  return due - Date.now();
})

TaskSchema.virtual('overdue').get(function() {
	if (!this.complete && this.due - Date.now() < 0) {
		return true;
	}
	return false;
})

//methods

TaskSchema.methods.addChild = function(params) {
	// add parent id
	params.parent = this._id;
	// create child
	return Task.create(params);
}

TaskSchema.methods.getChildren = function() {
	// children's parent is this task
	return Task.find({parent: this._id}).exec();
}

TaskSchema.methods.getSiblings = function() {
	// siblings have same parent (exclude this task)
	return Task.find({
		parent: this.parent,
		_id: {$ne: this._id}
	}).exec();
}

Task = mongoose.model('Task', TaskSchema);


module.exports = Task;