'use strict';

// Articles controller
angular.module('milestones').controller('MilestonesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Users', 
	function($scope, $stateParams, $location, Authentication, Users) {
		
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;

		this.$setScope = function (context) {
			$scope = context;
		};
		
		//Setting up Dates
		var updater = false;
		var today = new Date();
		
		$scope.today= new Date();
		today.setHours(0,0,0,0);
		var displayMonth = today.getMonth();
		var displayDate = today.getDate();
		var todayFullDate = today.getFullYear()+'-'+today.getMonth()+'-'+today.getDate();							


		if (((today.getMonth()+1).toString()).length===1) {
			displayMonth = '0'+(today.getMonth()+1).toString();			
		} else {
			displayMonth = (today.getMonth()+1).toString();
		}

		if (((today.getDate()+1).toString()).length===1) {
			displayDate = '0'+today.getDate().toString();
		}

		$scope.fixedToday = today.getFullYear()+'-'+displayMonth+'-'+displayDate; 
		$scope.startDate = today.getFullYear()+'-'+displayMonth+'-'+displayDate;
		$scope.minDater = today.getFullYear()+'-'+displayMonth+'-'+displayDate;	
		$scope.endDate = $scope.startDate;
				

		$scope.$watch('goal.type', function() {
			if (typeof $scope.goal!== 'undefined') {
                if($scope.goal.type==='Others') {
                	$scope.others = true;
                	$scope.requiredCheck = true;
                } else {
                	$scope.others = false;
                	$scope.requiredCheck = false;
                }
            }
        });        

		$scope.$watch('startDate', function() {
			var newDate = new Date($scope.startDate);
			if(newDate<today) {
			
				$scope.minDater = today.getFullYear()+'-'+displayMonth+'-'+displayDate;	
				$scope.endDate = $scope.minDater;
			} else {			
				$scope.endDate = $scope.startDate;
				$scope.minDater = $scope.startDate;			
			}
		});


		//UPDATE METHOD (runs every update of milestone OR new day)
		var updateMethod = function() {

			if (!$scope.user.lastUpdate || $scope.user.lastUpdate!==todayFullDate || updater===true) {
				
				$scope.user.lastUpdate = todayFullDate;
				
				for (var i =0; i<$scope.user.mileStones.length; i++) {
					
					var mileStone = $scope.user.mileStones[i];
					var dateUsed;
					var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds			
					var startDate = new Date(mileStone.startDate);
					var endDate = new Date(mileStone.endDate);
					startDate.setHours(0,0,0,0);
					endDate.setHours(0,0,0,0);

					//1. Updates latest Progress					
					mileStone.progress = Math.floor((mileStone.amtSaved/mileStone.targetAmt)*100);
					if (mileStone.progress>100) {
						mileStone.progress = 100;
					}
					
					//2. Updates milestone based on Present Day & update respective status
					if (today<startDate) {	    				
						dateUsed = startDate;
						mileStone.status = 'Not Started';
						mileStone.countDownToStart = Math.round(Math.abs((today.getTime() - startDate.getTime())/(oneDay)));						
						mileStone.daysLeftFromToday = Math.round(Math.abs((dateUsed.getTime() - endDate.getTime())/(oneDay))); //today till end date
						mileStone.monthsLeft = Math.floor(mileStone.daysLeftFromToday/30);						
						mileStone.dateProgress = 0;
						console.log('A');
					} else  if (today<endDate && mileStone.progress<100) {
						dateUsed = today;
						mileStone.status = 'In-Progress';
						mileStone.countDownToStart = 0;
						mileStone.daysLeftFromToday = Math.round(Math.abs((dateUsed.getTime() - endDate.getTime())/(oneDay))); //today till end date
						mileStone.monthsLeft = Math.floor(mileStone.daysLeftFromToday/30);						
						mileStone.dateProgress= Math.floor((((Math.abs(startDate.getTime()-today.getTime())/(oneDay))/mileStone.totalDurationDays)*100)); 
						console.log('B');
					} else if (today>=endDate||mileStone.progress===100) {						
						mileStone.status = 'Completed';
						mileStone.countDownToStart = 0;
						
						if (today>=endDate) {
							mileStone.daysLeftFromToday = 0;
							mileStone.monthsLeft = 0;
							mileStone.dateProgress = 100;
						}
						if (mileStone.progress===100) {
							dateUsed = today;
							mileStone.daysLeftFromToday = Math.round(Math.abs((dateUsed.getTime() - endDate.getTime())/(oneDay))); //today till end date
							mileStone.monthsLeft = Math.floor(mileStone.daysLeftFromToday/30);
							mileStone.dateProgress = Math.floor(Math.abs((((startDate.getTime()-today.getTime())/(oneDay))/mileStone.totalDurationDays)*100));
							
							//This scenario arises when someone completes a goal after contributing
							if (typeof mileStone.completionDate === 'undefined' ||$scope.goal.completionDate ==='undefined') {
								var month = $scope.getMonthString(today.getMonth());
								mileStone.completionDate = today.getDate()+'-'+month+'-'+today.getFullYear();
							}							
						}
						console.log('C');
					}
					//3. Monthly Payment Advice
			    	if (mileStone.daysLeftFromToday>=30) {
			    		mileStone.monthlyPayment = (mileStone.targetAmt-mileStone.amtSaved)/(Math.round(mileStone.daysLeftFromToday/30));
			    	} else {
			    		mileStone.monthlyPayment = mileStone.targetAmt-mileStone.amtSaved;
			    	}
			    	if(mileStone.monthlyPayment<0) {
			    		mileStone.monthlyPayment = 0;
			    	}

				}
				$scope.success = $scope.error = null;			
				var user = new Users($scope.user);
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
					$scope.user = Authentication.user;					
				}, function(response) {
					$scope.error = response.data.message;				
					location.reload();
				});
			}
			updater = false;
		};
		updateMethod();	// END.

		$scope.addNewMilestoneFnc = function() {
			console.log($scope.goal);
			var errorCheck = 0;	

			$scope.goal.uniqueId = $scope.goal.name+$scope.goal.type;	

			if ($scope.goal.targetAmt<=$scope.goal.amtSaved) {
				errorCheck++;
				alert('Amount saved so far cannot be equal/higher than Amount to Save.');
			} else {
				$scope.goal.progress = Math.floor(($scope.goal.amtSaved/$scope.goal.targetAmt)*100);
			}

			if ($scope.startDate===$scope.endDate||$scope.endDate===$scope.fixedToday) {
				errorCheck++;
				alert('Error! Please select another completion date!');
			} else {
				$scope.goal.startDate = $scope.startDate;
				$scope.goal.endDate = $scope.endDate;
			}

			if (errorCheck===0) {

				var dateUsed;
				var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds			
				var startDate = new Date($scope.goal.startDate);
				var endDateObj = new Date($scope.goal.endDate);
				startDate.setHours(0,0,0,0);

				if (today<startDate) {	    				
					$scope.goal.status = 'Not Started';
					$scope.goal.countDownToStart = Math.round(Math.abs((today.getTime() - startDate.getTime())/(oneDay)));
					dateUsed = startDate;
				} else {
					dateUsed = today;
					$scope.goal.status = 'In-Progress';
					$scope.goal.countDownToStart = 0;
				}

				var month = $scope.getMonthString(dateUsed.getMonth());
		    	$scope.goal.startDateFormatted = dateUsed.getDate()+'-'+month+'-'+dateUsed.getFullYear();															    	
				$scope.goal.daysLeftFromToday = Math.round(Math.abs((dateUsed.getTime() - endDateObj.getTime())/(oneDay))); //today till end date
				$scope.goal.monthsLeft = Math.floor($scope.goal.daysLeftFromToday/30);
				$scope.goal.totalDurationDays = Math.round(Math.abs((startDate.getTime() - endDateObj.getTime())/(oneDay))); //start date to end date
				$scope.goal.contributionRecords = [];
		    	
		    	if($scope.goal.status=== 'In-Progress') {
		    		$scope.goal.dateProgress= Math.floor((((Math.abs(startDate.getTime()-today.getTime())/(oneDay))/$scope.goal.totalDurationDays)*100)); 
		    	} else {
		    		$scope.goal.dateProgress = 0;
		    	}
		    	
		    	if ($scope.goal.daysLeftFromToday>=30) {
		    		$scope.goal.monthlyPayment = (($scope.goal.targetAmt-$scope.goal.amtSaved)/(Math.round($scope.goal.daysLeftFromToday/30)));
		    	} else {		    		
		    		$scope.goal.monthlyPayment = $scope.goal.targetAmt-$scope.goal.amtSaved;
		    	}
		    	
		    	
				$scope.user.mileStones.push($scope.goal);
				$scope.success = $scope.error = null;			
				var user = new Users($scope.user);
				user.$update(function(response) {
					$scope.successMsg = true;
					Authentication.user = response;
					$scope.user = Authentication.user;					
				}, function(response) {
						$scope.error = response.data.message;
						alert('Update Failed! Please Try Again.');
						location.reload();
				});
				$scope.startDate = today.getFullYear()+'-'+displayMonth+'-'+displayDate;
				$scope.minDater = today.getFullYear()+'-'+displayMonth+'-'+displayDate;	
				$scope.endDate = $scope.startDate;

			}

		};
		$scope.viewSelector = function(x) {
			$scope.goal = x;
		};
		$scope.updateSelector = function(x) {
			$scope.goal = x;
		};
		$scope.earlyStartSelector = function(x) {
			$scope.goal = x;
			$scope.earlyStart = true;
		};
		$scope.confirmDelete = function(x) {
			$scope.goal = x; 
		};
		$scope.confirmComplete = function(x) {
			$scope.goal = x;
		};

		$scope.updateMilestoneFnc = function() {
			if ($scope.updateMilestoneForm.$dirty) {
				var errorCheck = 0;			

				$scope.goal.completionDate = 'undefined';


				var dateUsed;
				var month;
				var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds			
				var startDate = new Date($scope.goal.startDate);
				startDate.setHours(0,0,0,0);
				var endDate = new Date($scope.goal.endDate);
				endDate.setHours(0,0,0,0);

				$scope.goal.totalDurationDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));

				//1. Check for new updated goal progress
				$scope.goal.progress = Math.floor(($scope.goal.amtSaved/$scope.goal.targetAmt)*100);				
				if ($scope.goal.progress>100) {
					$scope.goal.progress= 100;
				}

				//2. Updates milestone based on Present Day & update respective status
				if (today<startDate) {	    				
					dateUsed = startDate;
					$scope.goal.status = 'Not Started';
					$scope.goal.countDownToStart = Math.round(Math.abs((today.getTime() - startDate.getTime())/(oneDay)));						
					$scope.goal.daysLeftFromToday = Math.round(Math.abs((dateUsed.getTime() - endDate.getTime())/(oneDay))); //today till end date
					$scope.goal.monthsLeft = Math.floor($scope.goal.daysLeftFromToday/30);						
					$scope.goal.dateProgress = 0;
					console.log('A');
				} else  if (today<endDate && $scope.goal.progress<100) {
					dateUsed = today;
					$scope.goal.status = 'In-Progress';
					$scope.goal.countDownToStart = 0;
					$scope.goal.daysLeftFromToday = Math.round(Math.abs((dateUsed.getTime() - endDate.getTime())/(oneDay))); //today till end date
					$scope.goal.monthsLeft = Math.floor($scope.goal.daysLeftFromToday/30);
					console.log((startDate.getTime()-today.getTime())/(oneDay));
					$scope.goal.dateProgress= Math.floor((((Math.abs(startDate.getTime()-today.getTime())/(oneDay))/$scope.goal.totalDurationDays)*100)); 
					console.log('B');
				} else if (today>=endDate||$scope.goal.progress===100) {						
					$scope.goal.status = 'Completed';
					$scope.goal.countDownToStart = 0;
					
					if (today>=endDate) {
						$scope.goal.daysLeftFromToday = 0;
						$scope.goal.monthsLeft = 0;
						$scope.goal.dateProgress = 100;
					}
					if ($scope.goal.progress===100) {
						dateUsed = today;
						$scope.goal.daysLeftFromToday = Math.round(Math.abs((dateUsed.getTime() - endDate.getTime())/(oneDay))); //today till end date
						$scope.goal.monthsLeft = Math.floor($scope.goal.daysLeftFromToday/30);
						$scope.goal.dateProgress = Math.floor(Math.abs((((startDate.getTime()-today.getTime())/(oneDay))/$scope.goal.totalDurationDays)*100));
						
						//This scenario arises when someone completes a goal after contributing
						if (typeof $scope.goal.completionDate === 'undefined' ||$scope.goal.completionDate ==='undefined') {
							month = $scope.getMonthString(today.getMonth());
							$scope.goal.completionDate = today.getDate()+'-'+month+'-'+today.getFullYear();
						}							
					}
					console.log('C');
				}
				//3. Monthly Payment Advice
				if ($scope.goal.daysLeftFromToday>=30) {
					$scope.goal.monthlyPayment = ($scope.goal.targetAmt-$scope.goal.amtSaved)/(Math.round($scope.goal.daysLeftFromToday/30));
				} else {
					$scope.goal.monthlyPayment = $scope.goal.targetAmt-$scope.goal.amtSaved;
				}
				if($scope.goal.monthlyPayment<0) {
					$scope.goal.monthlyPayment = 0;
				}
				//4. Reassign start date based on changes
				month = $scope.getMonthString(startDate.getMonth());
		    	$scope.goal.startDateFormatted = startDate.getDate()+'-'+month+'-'+startDate.getFullYear();															    	
		    	$scope.goal.contributionRecords = [];
				
				if(confirm('Editing your milestone will cause you to lose contribution data. Are you sure?')) { 
					for (var i=0; i<$scope.user.mileStones.length; i++) {
						var mileStone = $scope.user.mileStones[i];
						if (mileStone.uniqueId===$scope.goal.uniqueId) {							
							mileStone = $scope.goal; 
						}
					}
					$scope.success = $scope.error = null;			
					var user = new Users($scope.user);
					user.$update(function(response) {
						$scope.successMsg = true;
						Authentication.user = response;
						$scope.user = Authentication.user;					
					}, function(response) {
						$scope.error = response.data.message;
						alert('Update Failed! Please Try Again.');
						location.reload();
					});
				} else {
					location.reload();
				}
				
			} else {
				$scope.error = 'No Changes Detected';
			}
			$scope.earlyStart = false;			
		};


		$scope.resetModal = function() {
			$scope.successMsg = false;
			$scope.goal = '';
			$scope.error = '';
			$scope.earlyStart = false;
		};

		
		$scope.getMonthString = function(monthNm) {
			var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			var monthString = months[monthNm];
			return monthString;
		};

		$scope.makeContribution = function(x) {
			
			console.log(x);
			console.log(x.contribution);
			if (x.contribution!==0) {
				for (var i = 0; i<$scope.user.mileStones.length; i++) {
					if ($scope.user.mileStones[i].name===x.name && $scope.user.mileStones[i].startDate===x.startDate) {
						$scope.user.mileStones[i].amtSaved += x.contribution; 
						var id = $scope.user.mileStones[i].contributionRecords.length+1;
						var month = $scope.getMonthString(today.getMonth());
						var contributionDate = today.getDate()+'-'+month+'-'+today.getFullYear();	
						var record = {
							date : contributionDate,
							contribution : x.contribution,
							id: id
						};
						
						$scope.user.mileStones[i].contributionRecords.push(record);
					}
				}
				x.contribution = 0;
				updater = true;
				updateMethod();
				alert('Contribution added');
			} else {
				alert('Enter an amount greater than $0.00');
			}
		};


		$scope.markComplete = function() {
			
			var completedObj = $scope.goal;
			completedObj.id = $scope.user.completedMilestones.length+1;			
			console.log(completedObj);

			if (typeof completedObj.completionDate === 'undefined' || $scope.goal.completionDate ==='undefined') {
				var month = $scope.getMonthString(today.getMonth());
				completedObj.completionDate = today.getDate()+'-'+month+'-'+today.getFullYear();
			}

			$scope.user.completedMilestones.push(completedObj);

			for (var i = 0;  i<$scope.user.mileStones.length; i++) {
    			var mileStone = $scope.user.mileStones[i];
    			
    			if (mileStone.uniqueId===$scope.goal.uniqueId) {
    			   				
    				$scope.user.mileStones.splice(i,1);
    			}
			}

			$scope.success = $scope.error = null;			

			var user = new Users($scope.user);
			user.$update(function(response) {
				$scope.success = true;
				Authentication.user = response;
				$scope.user = Authentication.user;
				$location.path('/milestones');

			}, function(response) {
				$scope.error = response.data.message;
			});
			$scope.goal = '';
			
		};

		
		$scope.cancelDelete = function () {
			$scope.goal = '';
		};
		
		$scope.deleteMilestone = function() {			
			
			console.log($scope.goal);

			for (var i = 0;  i<$scope.user.mileStones.length; i++) {
    			var mileStone = $scope.user.mileStones[i];
    			
    			if (mileStone.uniqueId===$scope.goal.uniqueId) {
    			   				
    				$scope.user.mileStones.splice(i,1);
    			}
			}								
			
			$scope.success = $scope.error = null;			

			var userNow = new Users($scope.user);
			userNow.$update(function(response) {
				$scope.success = true;
				Authentication.user = response;
				$scope.user = Authentication.user;

			}, function(response) {
				$scope.error = response.data.message;

			});
			$scope.goal = '';
							
		};

		$scope.deleteCompletedMilestone = function() {			
			
			console.log($scope.goal);

			for (var i = 0;  i<$scope.user.completedMilestones.length; i++) {
    			var mileStone = $scope.user.completedMilestones[i];
    			
    			if (mileStone.uniqueId===$scope.goal.uniqueId) {
    			   				
    				$scope.user.completedMilestones.splice(i,1);
    			}
			}
			for (var b = 0; b<$scope.user.completedMilestones.length; b++) {
                var completedMilestone = $scope.user.completedMilestones[b];
                completedMilestone.id = $scope.user.completedMilestones.indexOf(completedMilestone)+1;
            }								
			
			$scope.success = $scope.error = null;			

			var userNow = new Users($scope.user);
			userNow.$update(function(response) {
				$scope.success = true;
				Authentication.user = response;
				$scope.user = Authentication.user;

			}, function(response) {
				$scope.error = response.data.message;

			});
			$scope.goal = '';
							
		};		
	}
]);