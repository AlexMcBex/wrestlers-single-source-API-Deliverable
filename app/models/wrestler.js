const mongoose = require('mongoose')
const titleSchema = require('./title')

//Pet -> has a owner a name a type, age, adoptable(bool)
//eventually a titles array
//this model will use virtuals to produce additional data on each pet

const wrestlerSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		weight: {
			type: Number,
			required: true
		},
		active: {
			type: Boolean,
			required: true
		},
		federation: {
			type: String,
			enum: ['WWE', 'WWF', 'WCW', 'ECW', 'AEW', 'NJPW', 'Wrestling Fed.'],
			default: 'WWE'
		},
		titles: [titleSchema],
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
		// since we're adding virtuals to our pet model we need to tell express to include them when we want them
		toObject: { virtuals: true },
		toJSON: { virtuals: true }
	}
)

//before our export virtuals go here
//virtual properties use existing data to add a property whenever we retrieve these documents

wrestlerSchema.virtual('fullTitle').get(function(){
	if (this.federation !== 'Wrestling Fed.'){
		if(this.active){
			return `${this.federation} Superstar - ${this.name}`
		}else{
			return `${this.federation} Legend - ${this.name}`
		}
	} else {
		if(this.active){
			return `Superstar - ${this.name}`
		}else{
			return `Legend - ${this.name}`
		}
	}
})

wrestlerSchema.virtual('weightClass').get(function(){
	if(this.weight < 190){
		return 'lightweight'
	} else if (this.weight > 250){
		return 'heavyweight'
	}else{
		return 'middleweight'
	}
})

module.exports = mongoose.model('Wrestler', wrestlerSchema)
