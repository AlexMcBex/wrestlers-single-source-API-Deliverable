const mongoose = require('mongoose')

//Pet -> has a owner a name a type, age, adoptable(bool)
//eventually a toys array
//this model will use virtuals to produce additional data on each pet

const wrestlerSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		weight:{
			type: Number,
			required: true
		},
		active:{
			type: Boolean,
			required: true
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
		// since we're adding virtuals to our pet model we need to tell express to include them when we want them
		toObject: {virtuals: true},
		toJSON: {virtuals: true}
	}
)

//before our export virtuals go here
//virtual properties use existing data to add a property whenever we retrieve these documents

// petSchema.virtual('fullTitle')

module.exports = mongoose.model('Wrestler', wrestlerSchema)
