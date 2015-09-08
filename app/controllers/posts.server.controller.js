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
	var Post = req.Post;

	Post = _.extend(Post, req.body);

	Post.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(Post);
		}
	});
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
	var Post = req.Post;

	Post.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(Post);
		}
	});
};

/**
 * List of Posts
 */
exports.listAll = function(req, res) {
	var friendIdList = [];
	req.user.friendList.forEach(function(friend){
		if(friend.friendStatus === 3){
			friendIdList.push(friend.id);
		}
	});

	var postToReturn = [];
	Post.find().sort('-created').populate('user', '_id firstName lastName profilePic').exec(function(err, Posts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Posts.forEach(function(post){
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

exports.listFriends = function(req, res) {
	var friendIdList = [];
	req.user.friendList.forEach(function(friend){
		if(friend.friendStatus === 3){
			friendIdList.push(friend.id);
		}
	});

	var postToReturn = [];
	Post.find().sort('-created').populate('user', '_id firstName lastName profilePic').exec(function(err, Posts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Posts.forEach(function(post){

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

exports.listPersonal = function(req, res) {
	var postToReturn = [];
	Post.find().sort('-created').populate('user', '_id firstName lastName profilePic').exec(function(err, Posts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Posts.forEach(function(post){
				if(post.user._id.equals(req.user.id)){
					postToReturn.push(post);
				}
			});
			res.json(postToReturn);
		}
	});
};

exports.listUserPosts = function(req, res){
	var friendIdList = [];
	req.user.friendList.forEach(function(friend){
		if(friend.friendStatus === 3){
			friendIdList.push(friend.id);
		}
	});
	//Check if friends
	var postToReturn = [];
	Post.find().sort('-created').populate('user', '_id firstName lastName profilePic').exec(function(err, Posts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Posts.forEach(function(post){
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
/**
 * Post middleware
 */
exports.postByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Post is invalid'
		});
	}

	Post.findById(id).populate([{path: 'comments'}, {path: 'user', select: '_id firstName lastName profilePic'}]).exec(function(err, post){
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
	if (req.Post.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};



