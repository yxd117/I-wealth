'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 5));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	firstName: {
		type: String,
		trim: true,
		default: '',
		//validate: [validateLocalStrategyProperty, 'Please fill in your first name']
	},
	lastName: {
		type: String,
		trim: true,
		default: '',
		//validate: [validateLocalStrategyProperty, 'Please fill in your last name']
	},
	displayName: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true,
		unique: 'Email already exists',
		required: 'Please fill in your email',
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	username: {
		type: String,
		default:'',
		trim: true
	},
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should contain more than 5 characters']
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	providerData: {},
	additionalProvidersData: {},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		default: ['user']
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	},

	//Start of questionnaire Related Fields
	completeQns : {
		type: Boolean,
		default: false
	},
	currentCreditRating: {
		type: Number
	},
	completePersonalQns: {
		type: Boolean,
		default: false
	},
	completeJobQns: {
		type: Boolean,
		default: false
	},
	completeFinanceQns: {
		type: Boolean,
		default: false
	},
	personalRating: {
		type: Number
	},
	jobRating: {
		type: Number
	},
	financeRating: {
		type: Number
	},
	creditGrade: {
		type: Array
	},

	//Start of Questionnaire scores for the different fields
	//END of Score Results
	creditProfileScore: {
		type: Object
	},
	// Actual user Data Fields
	dateOfBirth: {
		type: Date
	},
	gender: {			//1
		type: String
	},
	educationLevel: {	//2
		type: String
	},
	locativeType: { 		//3
		type: String
	},
	locativeSituation: {	//4
		type: String
	},
	age: {				//5
		type: Number
	},
	maritalStatus: {
		type: String	//6
	},
	noOfDependents: {
		type: Number	//7
	},
	currentOccupation: {
		type: String 	//8 
	},
	currentWorkPeriod: {
		type: Number 	//9
	},
	lastWorkPeriod: {
		type: Number 	//10
	},
	monthlyIncome: {
		type: Number	//11
	},
	monthlyExpense: {
		type: Number 	//12
	},
	monthlySavings: {
		type: Number 	//13
	},
	creditHistory: {
		type: Number 	//14
	},
	bankruptStatus: {
		type: Number 	//15
	},
	numberOfCreditCards: {
		type: Number 	//16
	},

	// Additional Work Details
	description:{
		type:String
	},
	industry: {
		type: String
	},
	jobPosition: {
		type: String
	},
	employmentType: {
		type: String
	},
	privacy: {
		type: String,
		default: 'public'
	},
	contact: {
		type: Object
	},
	profilePic: {
		type: String,
		default: 'default_avatar.jpg'
	},
	profilePicType: {
		type: String
	}, 
	assetsRecords: {
		type: Array
	},
	assetsRecordsPeriod: {
		type: Object
	},
	liabilitiesRecords:{
		type: Array
	},
	liabilitiesRecordsPeriod: {
		type: Object
	},
	incomeExpenseRecords: {
		type: Array
	},
	incomeExpenseRecordsPeriod: {
		type: Object
	},

	//Check for Profile completeness
	updatedAssets: {
		type: Boolean,
		default: false
	},
	updatedLiabilities: {
		type: Boolean,
		default: false
	},
	updatedIncomeExpense: {
		type: Boolean,
		default: false
	},
	updatedMilestones: {
		type: Boolean,
		default: false
	},
	updatedBudget: {
		type: Boolean,
		default: false
	},
	updatedProfileSettings: {
		type: Boolean,
		default: false
	},
	updatedManageDebt:{
		type: Boolean,
		default: false
	},
	updatedAddFriend: {
		type: Boolean,
		default: false
	}, 

	
	debtsInfoArr: {
		type: Array
	},
	//Milestones
	mileStones: {
		type: Array
	},
	completedMilestones: {
		type: Array
	}, 
	lastUpdate: {
		type: String
	},
	lastUpdateDebts: {
		type: String
	},
	debtsCompletedArr: {
		type: Array
	},

	//FriendList
	// friendList: {
	// 	type: Array
	// },
	friendList:[({
		email: {
			type:String
		},
		id:{
			type:Schema.ObjectId,
			ref:'User'
		},
		friendStatus:{
			type:Number
		}
	})],

	budgetLimits:{
		type:Array
	},
	//posts by users
	posts: [{
		type: Schema.ObjectId,
		ref: 'Post'
	}],
	socialPoints:{
		type: Number,
		default: 0
	},
	socialRankPic: {
		type: String,
		default: 'rank1newbie.png'		
	},
	insurancesInfoArr: {
		type: Array
	}

});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if (this.password && this.password.length > 6) {
		this.salt = crypto.randomBytes(16).toString('base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

mongoose.model('User', UserSchema);
