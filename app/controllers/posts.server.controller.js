'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Post = mongoose.model('Post'),
	User = mongoose.model('User'),
	_ = require('lodash');



var updateSocialRankPic = function(socialPoints){
	var lvl1 = 0;
	var lvl2 = 1;
	var lvl3 = 50;
	var lvl4 = 100;
	var lvl5 = 250;
	var lvl6 = 500;
	var lvl7 = 800;
	var lvl8 = 1000;
	var lvl9 = 1200;
	var lvl10 = 1500;

	var totalPts = socialPoints;
	var socialRankPic;
	if(totalPts >= lvl2 && totalPts < lvl3){
		socialRankPic = 'rank2member.png';
	}else if(totalPts >= lvl3 && totalPts < lvl4){
		socialRankPic = 'rank3regular.png';
	}else if(totalPts >= lvl4 && totalPts < lvl5){
		socialRankPic = 'rank4advanced.png';
	}else if(totalPts >= lvl5 && totalPts < lvl6){
		socialRankPic = 'rank5super.png';
	}else if(totalPts >= lvl6 && totalPts < lvl7){
		socialRankPic = 'rank6hyper.png';
	}else if(totalPts >= lvl7 && totalPts < lvl8){
		socialRankPic = 'rank7extreme.png';
	}else if(totalPts >= lvl8 && totalPts < lvl9){
		socialRankPic = 'rank8ultimate.png';
	}else if(totalPts >= lvl9 && totalPts < lvl10){
		socialRankPic = 'rank9enthusiast.png';
	}else if(totalPts >= lvl10){
		socialRankPic = 'rank10expert.png';
	}
	return socialRankPic;

};
/**
 * Create a Post
 */
exports.create = function(req, res) {
	var newPost = new Post(req.body);
	newPost.user = req.user;

	//to update points
	newPost.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log(req.user.socialPoints);
			var addPoints = req.user.socialPoints + 1;
			console.log(addPoints);
			var socialRankPic = updateSocialRankPic(addPoints);
			console.log(socialRankPic);
			User.update({
				_id: req.user.id
			}, {$push: {posts: newPost}, $set: {socialPoints: addPoints, socialRankPic: socialRankPic}},
			function(err, results){
				res.json(newPost);
			});
			
		}
	});
};

/**
 * Show the current Post
 */
exports.read = function(req, res) {
	res.json(req.Post);
};

/**
 * Update a Post
 */
exports.update = function(req, res) {
	var post = req.Post;
	post = _.extend(post, req.body);
	console.log(post._id);
	Post.update({'_id': post._id}, {'title': post.title, 'content': post.content, 'privacy': post.privacy}, function(err){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(post);
		}
	});
	// post.save(function(err) {
	// 	console.log(err);
	// 	if (err) {
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {
	// 		res.json(post);
	// 	}
	// });
};

//Add Comment
exports.comment = function(req, res){

	//to update points
	Post.update({'_id': req.body.postId}, {$push: {comments: {userId: req.user.id, comment: req.body.comment}}}, function(err){
	        if(err){
	            console.log(err);
	        }else{
                console.log('Successfully added');

                console.log(req.user.socialPoints);
				var addPoints = req.user.socialPoints + 1;
				console.log(addPoints);
				var socialRankPic = updateSocialRankPic(addPoints);
				console.log(socialRankPic);

                User.update({_id: req.user.id}, {$set: {socialPoints: addPoints, socialRankPic:socialRankPic}},
					function(err, results){
						console.log('points added Successfully');
					});
                Post.findOne({'_id': req.body.postId}).populate([{path: 'comments'}, {path: 'user', select: '_id firstName lastName profilePic'}]).exec(function(err, post){
                	var options = {
                		path: 'comments.userId',
                		model: 'User'
                	};
                	Post.populate(post, options, function(err, p){
                		console.log(p);
						res.json(p);
                	});
                	
                });      
	        }			
		});
	// 

};

//Edit comment
exports.editComment = function(req, res){
	
	Post.update({'comments._id': req.body.commentId},
		{$set: {'comments.$.comment': req.body.comment}},
		{overwrite: true}, function(err){
			if(err){
				console.log(err);
			}else{
				console.log('Edit Comment Successfully');

				Post.findOne({'_id': req.body.postId}).populate([{path: 'comments'}, {path: 'user', select: '_id firstName lastName profilePic'}]).exec(function(err, post){
			    	var options = {
			    		path: 'comments.userId',
			    		model: 'User'
			    	};
			    	Post.populate(post, options, function(err, p){
						if (!p) {
							return res.status(404).send({
								message: 'Post not found'
							});
						}
						console.log(p);
						res.json(p);
			    	});
			    	
			  	});

			}
		});
};
//remove comment
exports.removeComment = function(req, res){
	
	Post.update({'_id': req.body.postId},
		{$pull: {'comments': {'_id':req.body.commentId}}},
			function(err){
			if(err){
				console.log(err);
			}else{
				console.log('Edit Comment Successfully');

				Post.findOne({'_id': req.body.postId}).populate([{path: 'comments'}, {path: 'user', select: '_id firstName lastName profilePic'}]).exec(function(err, post){
			    	var options = {
			    		path: 'comments.userId',
			    		model: 'User'
			    	};
			    	Post.populate(post, options, function(err, p){
						if (!p) {
							return res.status(404).send({
								message: 'Post not found'
							});
						}
						console.log(p);
						res.json(p);
			    	});
			    	
			  	});

			}
		});
};


/**
 * Delete an Post
 */
exports.delete = function(req, res) {
	var post = req.Post;
	// var ObjectId = require('mongoose').Types.ObjectId; 
	// Post._id = new ObjectId(Post._id);
	Post.find({'_id': req.Post._id}).remove().exec(function(err, p){
		console.log('here');
		console.log(p);
		res.json(p);
		// p.remove(function(err) {
		// 	if (err) {
		// 		return res.status(400).send({
		// 			message: errorHandler.getErrorMessage(err)
		// 		});
		// 	} else {
		// 		res.json(Post);
		// 	}
		// });		
	});


};

/**
 * List of Posts
 */

var listAllPosts = function(req, res){
	var friendIdList = [];
	req.user.friendList.forEach(function(friend){
		if(friend.friendStatus === 3){
			friendIdList.push(friend.id);
		}
	});

	var postToReturn = [];
	Post.find().sort('-created').populate('user', '_id firstName lastName profilePic').lean().exec(function(err, Posts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Posts.forEach(function(post){
				post.upVote.forEach(function(upId){
					if(upId === req.user.id){
						post.up = true;

					}
				});
				if(post.privacy === 'public'){
					postToReturn.push(post);

				}else if(post.user._id.equals(req.user.id)){
					postToReturn.push(post);
				
				}else{
					friendIdList.forEach(function(friendId){
						if(post.user._id.equals(friendId) && post.privacy !== 'private'){
							postToReturn.push(post);
						}
					});
				}

			});
			res.json(postToReturn);
		}
	});	
};
exports.listAll = function(req, res) {
	listAllPosts(req, res);
};
var listFriendsPost = function(req, res){
	var friendIdList = [];
	req.user.friendList.forEach(function(friend){
		if(friend.friendStatus === 3){
			friendIdList.push(friend.id);
		}
	});

	var postToReturn = [];
	Post.find().sort('-created').populate('user', '_id firstName lastName profilePic').lean().exec(function(err, Posts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Posts.forEach(function(post){
				post.upVote.forEach(function(upId){
					if(upId === req.user.id){
						post.up = true;

					}
				});
				friendIdList.forEach(function(friendId){
					if(post.user._id.equals(friendId) && post.privacy !== 'private'){
						postToReturn.push(post);
					}
				});
			});
			res.json(postToReturn);
		}
	});	
};
exports.listFriends = function(req, res) {
	listFriendsPost(req, res);
};

var listPersonalPosts = function(req, res){
	var postToReturn = [];
	Post.find().sort('-created').populate('user', '_id firstName lastName profilePic').lean().exec(function(err, Posts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Posts.forEach(function(post){
				post.upVote.forEach(function(upId){
					if(upId === req.user.id){
						post.up = true;

					}
				});
				if(post.user._id.equals(req.user.id)){
					postToReturn.push(post);
				}
			});
			res.json(postToReturn);
		}
	});
};
exports.listPersonal = function(req, res) {
	listPersonalPosts(req, res);
};

var listUserPostsFn = function(req, res){
	var friendIdList = [];
	req.user.friendList.forEach(function(friend){
		if(friend.friendStatus === 3){
			friendIdList.push(friend.id);
		}
	});
	//Check if friends
	var postToReturn = [];
	Post.find().sort('-created').populate('user', '_id firstName lastName profilePic').lean().exec(function(err, Posts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Posts.forEach(function(post){
				post.upVote.forEach(function(upId){
					if(upId === req.user.id){
						post.up = true;

					}
				});
				if(post.user._id.equals(req.query._id)){
					postToReturn.push(post);
					console.log(postToReturn);
				}else if(post.user._id.equals(req.query.userId)){
					if(post.privacy ===' public'){
						postToReturn.push(post);
					}else{
						friendIdList.forEach(function(friendId){
							if(post.user._id.equals(friendId) && post.privacy !== 'private'){
								postToReturn.push(post);
							}
						});
					}
					
				}
			});
			res.json(postToReturn);
		}
	});
};
exports.listUserPosts = function(req, res){
	listUserPostsFn(req, res);
};
/**
 * Post middleware
 */
exports.postByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Post is invalid'
		});
	}

	Post.findById(id).populate([{path: 'comments'}, {path: 'user', select: '_id firstName lastName profilePic'}]).lean().exec(function(err, post){
    	var options = {
    		path: 'comments.userId',
    		model: 'User'
    	};
    	Post.populate(post, options, function(err, p){
			if (err) return next(err);
			if (!p) {
				return res.status(404).send({
					message: 'Post not found'
				});
			}
			p.upVote.forEach(function(upId){
				if(upId === req.user.id){
					p.up = true;

				}
			});
			req.Post = p;
			console.log(p);
			next();
    	});
    	
    });   
};

/**
 * Post authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	console.log('here');
	console.log(req.Post.user._id);
	console.log(req.user._id);
	if (!req.Post.user._id.equals(req.user._id)) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};


exports.upPost = function(req, res){
	Post.update({'_id': req.body.postId}, {$push: {upVote: req.user.id}}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log('Successfully upPost');
            if(req.body.postFilter === 'public'){
            	listAllPosts(req, res);
            }else if(req.body.postFilter === 'friends'){
            	listFriendsPost(req, res);
            }else if(req.body.postFilter === 'personal'){
            	listPersonalPosts(req, res);
            }
        }			
	});
};

exports.downPost = function(req, res){
	Post.update({'_id': req.body.postId}, {$pull: {upVote: req.user.id}}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log('Successfully upPost');
            if(req.body.postFilter === 'public'){
            	listAllPosts(req, res);
            }else if(req.body.postFilter === 'friends'){
            	listFriendsPost(req, res);
            }else if(req.body.postFilter === 'personal'){
            	listPersonalPosts(req, res);
            }
 
        }			
	});
};

var findOnePost = function(req, res){
	Post.findById(req.body.postId).populate([{path: 'comments'}, {path: 'user', select: '_id firstName lastName profilePic'}]).lean().exec(function(err, post){
		var options = {
			path: 'comments.userId',
			model: 'User'
		};
		Post.populate(post, options, function(err, p){
			if (err) console.log(err);
			if (!p) {
				return res.status(404).send({
					message: 'Post not found'
				});
			}
			p.upVote.forEach(function(upId){
				if(upId === req.user.id){
					p.up = true;

				}
			});
			res.json(p);
		});
	});
    	
};

exports.upOnePost = function(req, res){
	Post.update({'_id': req.body.postId}, {$push: {upVote: req.user.id}}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log('Successfully upPost');
            findOnePost(req, res);
        }			
	});
};

exports.downOnePost = function(req, res){
	Post.update({'_id': req.body.postId}, {$pull: {upVote: req.user.id}}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log('Successfully upPost');
            findOnePost(req, res);
        }			
	});
};

var listUserPostsUpdateFn = function(req, res){
	var friendIdList = [];
	req.user.friendList.forEach(function(friend){
		if(friend.friendStatus === 3){
			friendIdList.push(friend.id);
		}
	});
	//Check if friends
	var postToReturn = [];
	Post.find().sort('-created').populate('user', '_id firstName lastName profilePic').lean().exec(function(err, Posts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Posts.forEach(function(post){
				post.upVote.forEach(function(upId){
					if(upId === req.user.id){
						post.up = true;

					}
				});
				if(post.user._id.equals(req.body._id)){
					postToReturn.push(post);
					console.log(postToReturn);
				}else if(post.user._id.equals(req.body.userId)){
					if(post.privacy ===' public'){
						postToReturn.push(post);
					}else{
						friendIdList.forEach(function(friendId){
							if(post.user._id.equals(friendId) && post.privacy !== 'private'){
								postToReturn.push(post);
							}
						});
					}
					
				}
			});
			res.json(postToReturn);
		}
	});
};
exports.upUserPosts = function(req, res){
	Post.update({'_id': req.body.postId}, {$push: {upVote: req.user.id}}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log('Successfully upPost');
            listUserPostsUpdateFn(req, res);
        }			
	});
};

exports.downUserPosts = function(req, res){
	Post.update({'_id': req.body.postId}, {$pull: {upVote: req.user.id}}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log('Successfully upPost');
            listUserPostsUpdateFn(req, res);
        }			
	});
};
