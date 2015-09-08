'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Post = mongoose.model('Post'),
	async = require('async');


exports.viewProfileByEmail = function(req, res, next, profileId){
	console.log(profileId);

	var pid = mongoose.Types.ObjectId(profileId);
	console.log(pid);
	User.findOne({'_id': pid}).select('email firstName lastName profilePic friendList description age created socialRankPic industry jobPosition').populate({path:'friendList'}).exec(function(err, user){
		var friendDetails = {
			path:'friendList.id',
			select: 'id firstName lastName profilePic',
			model:'User'
		};
		User.populate(user, friendDetails, function(err, userProfile){
			if(err) return next(err);
			if(!userProfile){
				return res.status(404).send({
					message: 'User not found'
				});
			}
			var yearJoined = new Date(userProfile.created).getFullYear();
			var age = 'N/A';
			var description = 'N/A';
			var socialRankPic = 'rank1newbie.png';
			var friendStatus = 0;
			
			if(req.user.friendList){
				console.log(req.user.friendList);
				req.user.friendList.forEach(function(fr){
						console.log(req.user.email);
						console.log(fr.email);
						console.log(userProfile.email);
					if(fr.email === userProfile.email){

						friendStatus = fr.friendStatus;
					}
				});

			}

			var cloneDetails = _.clone(userProfile);

			_.merge(cloneDetails._doc, {'yearJoined' : yearJoined});
			if(!userProfile.age) _.merge(cloneDetails._doc, {'age' : age});
			if(!userProfile.description) _.merge(cloneDetails._doc, {'description' : description});
			if(!userProfile.socialRankPic) _.merge(cloneDetails._doc, {'socialRankPic': socialRankPic});
			if(!userProfile.friendStatus) _.merge(cloneDetails._doc, {'friendStatus': friendStatus});
			console.log('here' + cloneDetails._doc);


			req.userProfile = cloneDetails._doc;		
			next();			
		});

	});
	

	// User.findOne({'_id': pid}, function(err, user){

	//     if (err) {
	//       return next(err);
	//     } else if (!user) {
	//       return res.status(404).send({
	//         message: 'No user with that email found'
	//       });
	//     }
	//     if(req.user.friendList){
	// 	    req.user.friendList.forEach(function(friend){
	// 	    	if(friend.email === user.email){
	// 	    		friendStatus = friend.friendStatus;
	// 	    	}
	// 	    });	    	
	//     }

	//     if(!friendStatus) friendStatus = 0;

	//    	yearJoined = new Date(user.created).getFullYear();

	//    	if(!user.description){
	//    		description = 'N/A';
	//    	}else{
	//    		description = user.description;
	//    	}

	//    	if(!user.age){
	//    		profileAge = 'N/A';
	//    	}else{
	//    		profileAge = user.age;
	//    	}
 		
	//    	async.waterfall([
	//    		function(done){
	// 		   	if(user.friendList){
	// 		   		user.friendList.forEach(function(fr){
	// 		   			if(fr.friendStatus === 3){
	// 		   				User.findOne({'_id': fr.id}, function(err, u){
	// 		   					fr.profilePic = u.profilePic;
	// 		   					fr.firstName = u.firstName;
	// 		   					fr.lastName = u.lastName;
	// 		   					console.log(fr);
	// 		   					friendList.push(fr);
	// 		   				});
			   				
	// 		   			}
	// 		   		});
	// 		   		console.log(friendList);
	// 		   		done(err, friendList);	
			   		
	// 		   	}	
	//    		}, function(friendList, done){
	// 			userProfile = {
	// 				userObjectId: user._id,
	// 				email: user.email,
	// 				firstName: user.firstName,
	// 				lastName: user.lastName,
	// 				profilePic: user.profilePic,
	// 				friendStatus: friendStatus,
	// 				description: description,
	// 				yearJoined: yearJoined,
	// 				profileAge: profileAge,
	// 				friendList: friendList
	// 			};	   		
	// 			req.userProfile = userProfile;
	// 			done(err);		   			
	//    		}], function(err){
	//    		if(err) return next(err);
	//    		next();	
	//    	});
	// });

};

exports.viewProfile = function(req, res){
	Post.find({'user': req.userProfile._id}, function(err, posts){
		req.userProfile.posts = posts;

		res.json(req.userProfile);
	});
	
	
};