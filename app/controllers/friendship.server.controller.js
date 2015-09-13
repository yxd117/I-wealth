'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Friendship = mongoose.model('Friendship'),
	User = mongoose.model('User'),
	_ = require('lodash');

//User.friendStatus = 1 Send FriendRequest / 2 Accept Friend Request / 3 Friends
//Friendship.status = 1 Pending / 2 Accepted

exports.addFriend = function(req, res){

			var friendship = new Friendship(req.body);
			friendship.userEmail= req.user.email;
			friendship.friendEmail = req.body.friendEmail;
			friendship.status = 1;
			console.log('add friend: ' + req.body.friendId);
			User.update({'email': req.user.email}, 
				{$push: {friendList: {email: req.body.friendEmail, id: req.body.friendId, friendStatus: 1}}}, 
				{upsert:true}, function(err){
			        if(err){
			                console.log(err);
			        }else{
			                console.log('Successfully added');
			        }					
				});
			User.update({'email': req.body.friendEmail}, 
				{$push: {friendList: {email: req.user.email, id: req.user.id, friendStatus: 2}}}, 
				{upsert:true}, function(err){
			        if(err){
			                console.log(err);
			        }else{
			                console.log('Successfully added');
			        }					
				});

			friendship.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					console.log(friendship);
					res.json(friendship);
					
				}
			});	

};

exports.acceptFriend = function(req, res){
	Friendship.findOne({
		userEmail: req.body.friendEmail,
		friendEmail: req.user.email
	}, function (err, friendship){
		friendship.status = 2;
		var user1;
		var user2;

		User.findOne({'email': req.user.email}, function(err, user){
			user1 = user;
			user1.friendList.forEach(function(user){
				if(user.email === req.body.friendEmail){
					user.friendStatus = 3;
				}
			});		
			User.update({'email': req.user.email}, 
				{$set: {friendList: user1.friendList}}, 
				{overwrite:true}, function(err){
			        if(err){
			                console.log(err);
			        }else{
			                console.log('Successfully added');
			        }					
				});

		});
		User.findOne({'email': req.body.friendEmail}, function(err, user){
			user2 = user;
			user2.friendList.forEach(function(user){
				if(user.email === req.user.email){
					user.friendStatus = 3;
				}
			});				

			User.update({'email': req.body.friendEmail}, 
				{$set: {friendList: user2.friendList}},
				{overwrite:true}, function(err){
			        if(err){
			                console.log(err);
			        }else{
			                console.log('Successfully added');
			        }					
				});
		});

		friendship.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.json(friendship);
			}
		});

	});

};

exports.retrieveUserList = function(req, res){
	User.find({}, function(err, users){
		var userEmail = req.user.email;
		var userProfile;
		var userEmailList = [];
		var friendStatus;
		var doc = 'hello';
		for(var i = 0; i < users.length; i++){
			friendStatus = 0;
			if(users[i].email !== userEmail){
				//Check if already friends with user
				for(var f = 0; f< req.user.friendList.length; f++){
					if(req.user.friendList[f].email === users[i].email){
						friendStatus = req.user.friendList[f].friendStatus;
					}
				}
				if(users[i].privacy === 'public'){

					userProfile = {
						userObjectId: users[i].id,
						email: users[i].email,
						firstName: users[i].firstName,
						lastName: users[i].lastName,
						profilePic: users[i].profilePic,
						friendStatus: friendStatus
					};
					userEmailList.push(userProfile);
				}

			}			
		}
		 res.json(userEmailList);
	});
};

exports.retrieveFriendsList = function(req, res){
	var userFriendsEmailArr = [];
	var userSentReqEmailArr = [];
	var userPendingReqEmailArr = [];
	if(req.user.friendList){
		req.user.friendList.forEach(function(friend){
			if(friend.friendStatus === 3) userFriendsEmailArr.push(friend.email);
			if(friend.friendStatus === 1) userSentReqEmailArr.push(friend.email);
			if(friend.friendStatus === 2) userPendingReqEmailArr.push(friend.email);

		});		
	}

	console.log(userFriendsEmailArr);

	User.find({}, function(err, users){
		var friendProfileList = [];
		var userProfile;
		users.forEach(function(user){
			userProfile = {
				userObjectId: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				profilePic: user.profilePic
			};
			userFriendsEmailArr.forEach(function(friendEmail){
				if(user.email === friendEmail){
					userProfile.friendStatus = 3;
					friendProfileList.push(userProfile);
				}
			});	
			userSentReqEmailArr.forEach(function(friendEmail){
				if(user.email === friendEmail){
					userProfile.friendStatus = 1;
					friendProfileList.push(userProfile);
				}
			});	
			userPendingReqEmailArr.forEach(function(friendEmail){
				if(user.email === friendEmail){
					userProfile.friendStatus = 2;
					friendProfileList.push(userProfile);
				}
			});	


		});

		console.log(friendProfileList);
		res.json(friendProfileList);
	});
	
	
	
};
