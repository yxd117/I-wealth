'use strict';

// Articles controller
angular.module('milestones').controller('MilestonesController', ['$scope', '$stateParams', '$location', 'Authentication', 'MilestoneService', 'Users', 
	function($scope, $stateParams, $location, Authentication, MilestoneService, Users) {
		$scope.authentication = Authentication;

		$scope.user = Authentication.user;
		
		//!!--View Milestones Page!!//
		//View Milestones: text suggesting to start creating goals
		$scope.showNewGoals = true;	

		//View Milestones: Add new milestone bar
		$scope.addNewMilestone = false; 

		//View Milestones: After clicking Create New Goal
		$scope.afterClick = true;	
	
		$scope.readonly = true;
		$scope.noMileStoneDeleted = true;

		//default user details
		$scope.userCopy = {};
		angular.copy($scope.user, $scope.userCopy);

		this.$setScope = function (context) {
			$scope = context;
		};
		
			
		$scope.qnsTitle = MilestoneService.qnsTitle();	
		$scope.qnsType = MilestoneService.qnsType();
		$scope.qnsTargetAmount = MilestoneService.qnsTargetAmount();		
		$scope.qnsCurrentAmount = MilestoneService.qnsCurrentAmount();
		$scope.qnsTargetDate = MilestoneService.qnsTargetDate();

		//View Milestones: Generate new new in table to create goal
		$scope.generateNewLine = function() {
			$scope.addNewMilestone = true;
			$scope.showNewGoals = false;
			$scope.afterClick = false;
			$scope.updateButton= false;
		};

		//View Milestones: Check for existing milestones
		$scope.tableEmptyCheck = function () {
			var tableCheck = $scope.user.mileStones;			
			if (tableCheck.length===0) {
				$scope.noMilestones = true;
				$scope.showNewGoals = true;
				return false;
			} else {
				$scope.noMilestones = false;
				$scope.showNewGoals = false;
				return true;
			}
		};

		$scope.tableEmptyCheck();

		$scope.getMonthString = function(monthNm) {
			var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			var monthString = months[monthNm];
			return monthString;
		};

		$scope.calculateMonthsBtw = function(d1, d2) {
		    
		    var months;
		    months = (d2.getFullYear() - d1.getFullYear()) * 12;
		    months -= d1.getMonth() + 1;
		    months += d2.getMonth();
		    return months <= 0 ? 0 : months;
		};

		$scope.paymentAdvice = function() {

			if ($scope.user.mileStones.length>0) {
				for (var i = 0;  i<$scope.user.mileStones.length; i++) {
		    		
		    		var dateUsed = new Date();

	    			var today = new Date();
	    			var startDate = new Date($scope.user.mileStones[i].startDate);
	    			if (today>startDate) {
	    				dateUsed = today;
	    			} else {	    				
	    				dateUsed = startDate;
	    			}

	    			var targetDate = new Date($scope.user.mileStones[i].targetDate);
	    			var monthsLeft = $scope.calculateMonthsBtw(dateUsed,targetDate);
	    			var paymentAmount = 0;

	    			if (monthsLeft===0) {
	    				paymentAmount = ($scope.user.mileStones[i].targetAmount)-($scope.user.mileStones[i].currentAmount);
	    			} else {
	    				paymentAmount = (($scope.user.mileStones[i].targetAmount)-($scope.user.mileStones[i].currentAmount))/monthsLeft;
	    			}

	    			var paymentAmountAdj = paymentAmount.toFixed(2);

	    			if (paymentAmountAdj<0) {
	    				paymentAmountAdj = 0;
	    			}

	    			var goalTitle = $scope.user.mileStones[i].goalTitle;
	    			var goalType = $scope.user.mileStones[i].goalType;
	    			var currentAmount = $scope.user.mileStones[i].currentAmount;
	    			var targetAmount = $scope.user.mileStones[i].targetAmount;	    			
	    			var startDateFormatted = $scope.user.mileStones[i].startDateFormatted;	    			
	    			var targetDateFormatted = $scope.user.mileStones[i].targetDateFormatted;
	    			var progress = $scope.user.mileStones[i].progress;

		    		$scope.user.mileStones[i] = {goalTitle,goalType,currentAmount,targetAmount,startDate,startDateFormatted,targetDate,targetDateFormatted,progress,paymentAmountAdj,monthsLeft};				
				}

				$scope.success = $scope.error = null;			
				var user = new Users($scope.user);
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
					$scope.user = Authentication.user;
					}, function(response) {
						$scope.error = response.data.message;
				});
			}
		};
		

		$scope.addMilestone = function(isValid) {
			
			if(isValid) {
				var goalTitle = $scope.title;
				var goalType = $scope.goalType;
				var currentAmount = 0;
				var targetAmount = $scope.targetAmount;
				

				//Check for unique goal title ONE MORE VALIDATION TO BE DONE
				var existingTitleCheck = 0;
				var userNow = $scope.user;
				for (var i = 0;  i<userNow.mileStones.length; i++) {
		    		var mileStone = userNow.mileStones[i];
		    			
		    		if (mileStone.goalTitle.toLowerCase()===goalTitle.toLowerCase()) {
		    			existingTitleCheck++;
		    		}
				}

				if (currentAmount<targetAmount&&existingTitleCheck===0) {

					var progress = Math.floor((currentAmount/targetAmount)*100);

					var startDate = $scope.startDate;
					console.log('added start date'+startDate);
					var startDateD = startDate.getDate();					
					//var startDateMth = $scope.getMonthString(startDate.getMonth());
					var startDateYr = startDate.getFullYear();
					var startDateFormatted = startDateD+'/'+(startDate.getMonth()+1)+'/'+startDateYr;

					var targetDate = $scope.targetDate;
					var targetDateD = targetDate.getDate();																				
					//var targetDateMth = $scope.getMonthString(targetDate.getMonth());
					var targetDateYr = targetDate.getFullYear();
					var targetDateFormatted = targetDateD+'/'+(targetDate.getMonth()+1)+'/'+targetDateYr;

					//var startDate1 = new Date(startDateYr+'-'+(startDate.getMonth()+1)+'-'+startDateD);
					//console.log(startDate1);

					var goalObj = {goalTitle,goalType,currentAmount,targetAmount,startDate,startDateFormatted,targetDate,targetDateFormatted,progress};

					
					$scope.user.mileStones.push(goalObj);
					
					//reset scope
					$scope.title = '';
					$scope.goalType = '';
					$scope.startDate = '';
					$scope.targetDate = '';
					$scope.targetAmount = '';	
					
					alert('Milestone Added!');
					$scope.user.updatedMilestones = true;
					$scope.afterClick = true;					
					$scope.addNewMilestone=false;
					
					$scope.paymentAdvice();
					
				} else if (currentAmount>=targetAmount){
					alert('Current Amount cannot be equals to or more than Target Amount!');
				} else if (existingTitleCheck>0) {
					alert('Goal Title already exists! Please use another title name.');
				}
				
			}else {
				$scope.error = 'Form Incomplete. Please Check again.';
			}	

			
		};

		$scope.makeContribution = function() {
			console.log('entered');
			$scope.user.mileStones[$scope.user.updateMilestonePos].currentAmount += $scope.contribution;
			
			console.log('scope is'+$scope.contribution);

			$scope.user.mileStones[$scope.user.updateMilestonePos].progress = Math.floor(($scope.user.mileStones[$scope.user.updateMilestonePos].currentAmount/$scope.user.mileStones[$scope.user.updateMilestonePos].targetAmount)*100);
			
			if ($scope.user.mileStones[$scope.user.updateMilestonePos].progress>100) {
				$scope.user.mileStones[$scope.user.updateMilestonePos].progress=100;
			}

			alert('Contribution Added!');
			$scope.contribution = 0;						
			var user = new Users($scope.user);			
			$scope.paymentAdvice();

		};

		$scope.updateMilestone = function () {


			var goalTitle = $scope.userCopy.mileStones[$scope.userCopy.updateMilestonePos].goalTitle;
			var goalType = $scope.userCopy.mileStones[$scope.userCopy.updateMilestonePos].goalType;
			var currentAmount = $scope.user.mileStones[$scope.user.updateMilestonePos].currentAmount;
			var targetAmount = $scope.userCopy.mileStones[$scope.userCopy.updateMilestonePos].targetAmount;								

			if (currentAmount<targetAmount) {

				//calculate latest Progress score
				var progress = Math.floor((currentAmount/targetAmount)*100);
				//cap progress at 100
				if(progress>=100) {
					progress = 100;

				}		

				var startDate = new Date($scope.userCopy.mileStones[$scope.userCopy.updateMilestonePos].startDate);				
				var startDateD = startDate.getDate();
				var startDateYr = startDate.getFullYear();
				var startDateFormatted = startDateD+'/'+(startDate.getMonth()+1)+'/'+startDateYr;

				var targetDate = new Date($scope.userCopy.mileStones[$scope.userCopy.updateMilestonePos].targetDate);
				var targetDateD = targetDate.getDate();
				var targetDateYr = targetDate.getFullYear();
				var targetDateFormatted = targetDateD+'/'+(targetDate.getMonth()+1)+'/'+targetDateYr;				
				
				$scope.user.mileStones[$scope.user.updateMilestonePos] = {goalTitle,goalType,currentAmount,targetAmount,startDate,startDateFormatted,targetDate,targetDateFormatted,progress};

				$scope.success = $scope.error = null;
				alert('Milestone Updated!');			
				

				$scope.paymentAdvice();
			} else if (currentAmount>=targetAmount){
				alert('Current Amount cannot be more than Target Amount!');			
				
			} 
			$scope.uneditMilestone();
		};

		$scope.cancel = function() {

			$scope.showNewGoals = true;	

			//View Milestones: Add new milestone bar
			$scope.addNewMilestone = false; 

			//View Milestones: After clicking Create New Goal
			$scope.afterClick = true;	
			$scope.tableEmptyCheck();

			//reset scope
			$scope.title = '';
			$scope.goalType = '';
			$scope.startDate = '';
			$scope.targetDate = '';
			$scope.targetAmount = 0;
		};

		$scope.redirectUpdateMilestone = function(x) {
			
			
			
			var arrayPos = null;
			for(var i=0; i<$scope.user.mileStones.length; i++) {
				var mileStone = $scope.user.mileStones[i];
				if (mileStone.goalTitle===x.goalTitle) {
					arrayPos = i;
					console.log('Enter liao');
				}
			}
			console.log('check'+arrayPos);
				
			
			$scope.user.updateMilestonePos = arrayPos;
			var userNow = new Users($scope.user);

			userNow.$update(function(response) {
				$scope.success = true;
				Authentication.user = response;	
				$scope.user = Authentication.user;			
				$location.path('/milestones/updatemilestone');
			
			}, function(response) {
				$scope.error = response.data.message;
			});								
		};

		$scope.markComplete = function() {
			var confirmComplete = confirm('Confirm Completion of: '+$scope.user.mileStones[$scope.user.updateMilestonePos].goalTitle +' goal?');
			var completedObj = $scope.user.mileStones[$scope.user.updateMilestonePos];			
			console.log(completedObj);
			if(confirmComplete) {
				$scope.user.completedMilestones.push(completedObj);

				$scope.user.mileStones.splice($scope.user.updateMilestonePos,1);

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

			}
		};

		
		$scope.deleteMilestone = function(x) {

			var position = 0;
			
			console.log(x.goalTitle);

		  	var confirmDelete = confirm('Confirm delete milestone: '+x.goalTitle);
			  	if (confirmDelete) {

					for (var i = 0;  i<$scope.user.mileStones.length; i++) {
		    			var mileStone = $scope.user.mileStones[i];
		    			
		    			if (mileStone.goalTitle===x.goalTitle) {
		    			   				
		    				$scope.user.mileStones.splice(i,1);
		    			}
					}					
					$scope.noMileStoneDeleted = false;
					
					$scope.success = $scope.error = null;			

					var userNow = new Users($scope.user);
					userNow.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
					$scope.user = Authentication.user;

					}, function(response) {
						$scope.error = response.data.message;

					});
				}

			$scope.tableEmptyCheck();
		};

		$scope.alerts = [    		
    		{ type: 'success', msg: 'You have successfully deleted your Milestone!' },
    		{type: 'error', msg:'400 error'}
  		];

  		$scope.deleteCompletedMilestone = function(x) {

			var position = 0;
			
			console.log(x.goalTitle);

		  	var confirmDelete = confirm('Confirm delete milestone: '+x.goalTitle);
			  	if (confirmDelete) {

					for (var i = 0;  i<$scope.user.completedMilestones.length; i++) {
		    			var mileStone = $scope.user.completedMilestones[i];
		    			
		    			if (mileStone.goalTitle===x.goalTitle) {
		    			   				
		    				$scope.user.completedMilestones.splice(i,1);
		    			}
					}					
					//$scope.noMileStoneDeleted = false;
					
					$scope.success = $scope.error = null;			

					var userNow = new Users($scope.user);
					userNow.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
					$scope.user = Authentication.user;

					}, function(response) {
						$scope.error = response.data.message;

					});
				}

			//$scope.tableEmptyCheck();
		};

		$scope.closeAlert = function(index) {
    		$scope.alerts.splice(index, 1);
  		};

  		$scope.editMilestone = function() {
  			$scope.readonly = false;
  			
  		};

  		$scope.uneditMilestone = function() {
  			$scope.readonly = true;
  			$scope.userCopy.mileStones[$scope.userCopy.updateMilestonePos].goalTitle = $scope.user.mileStones[$scope.user.updateMilestonePos].goalTitle;
			$scope.userCopy.mileStones[$scope.userCopy.updateMilestonePos].goalType = $scope.user.mileStones[$scope.user.updateMilestonePos].goalType;			
			$scope.userCopy.mileStones[$scope.userCopy.updateMilestonePos].targetAmount = $scope.user.mileStones[$scope.user.updateMilestonePos].targetAmount;
			$scope.userCopy.mileStones[$scope.userCopy.updateMilestonePos].startDate = $scope.user.mileStones[$scope.user.updateMilestonePos].startDate;
			$scope.userCopy.mileStones[$scope.userCopy.updateMilestonePos].targetDate = $scope.user.mileStones[$scope.user.updateMilestonePos].targetDate;
  		};
		
		$scope.today = function() {
		    $scope.dt = new Date();
		 };
		  $scope.today();

		  $scope.clear = function () {
		    $scope.dt = null;
		 };

		  // Disable weekend selection
		$scope.disabled = function(date, mode) {
		  return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
		};

		$scope.toggleMin = function() {
		    $scope.minDate = $scope.minDate ? null : new Date();
		};
		$scope.toggleMin();

		$scope.open = function($event) {
		    $scope.opened = true;
		};

		$scope.dateOptions = {
		    formatYear: 'yy',
		    startingDay: 1
		 };

		  $scope.formats = ['yyyy-MM-dd','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		  $scope.format = $scope.formats[0];

		  var tomorrow = new Date();
		  tomorrow.setDate(tomorrow.getDate() + 1);
		  var afterTomorrow = new Date();
		  afterTomorrow.setDate(tomorrow.getDate() + 2);
		  $scope.events =
		    [
		      {
		        date: tomorrow,
		        status: 'full'
		      },
		      {
		        date: afterTomorrow,
		        status: 'partially'
		      }
		    ];

		  $scope.getDayClass = function(date, mode) {
		    if (mode === 'day') {
		      var dayToCheck = new Date(date).setHours(0,0,0,0);

		      for (var i=0;i<$scope.events.length;i++){
		        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

		        if (dayToCheck === currentDay) {
		          return $scope.events[i].status;
		        }
		      }
		    }

		    return '';
		  };


			}
]);