'use strict';

// Articles controller
angular.module('financial').controller('DebtsController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Users', '$q',
    function($scope, $rootScope, $stateParams, $location, Authentication, Users, $q) {
        $scope.user = Authentication.user;

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');
        
        this.$setScope = function(context) {
            $scope = context;
        };

        $scope.showAdd = false; // hide the Add New Debt button.
        // When "Add New Debt" button is clicked
        $scope.onAddDebt = function () {
            $scope.model = {}; // clear any data leftover from our last transaction
            $scope.showAdd = true; // show the Add Debt form.
            //$scope.cancel(); // hide any edit rows
        };


    //      $scope.debtsInfoArr = [
		  //   { id: 1, lender: 'UOB', type: 'Housing', amt: 30000, interestRate: 3, lenOfLoan: 10, dateStarted: '10/09/2012', NoOfRepayment: 10},
		  //   { id: 2, lender: 'OCBC', type: 'Education', amt: 18000, interestRate: 4.5, lenOfLoan: 20, dateStarted: '20/01/2013', NoOfRepayment: 20 },
		  //   { id: 3, lender: 'DBS', type: 'Car', amt: 40000, interestRate: 5, lenOfLoan: 30, dateStarted: '23/06/2011', NoOfRepayment: 40 },
		  // ];

		/*

		DebtsService.all().success(function(data) {
   			$scope.debtsInfoArr = data;
		}); 

		$scope.create = function() {
		  debtsInfoArr.create($scope.newDebt).success(function(data) {
		    $scope.debtsInfoArr.push(data);
		    $scope.newDebt = null;
		    $scope.showAdd = false;
		  });
		};

		$scope.delete = function(debt) {
		  $scope.showAdd = false;
		  return debtsInfoArr.delete(debt.id).success(function(data) {
		    var index = $scope.debtsInfoArr.indexOf(debt);
		    $scope.debtsInfoArr.splice(index, 1);
		  });
		};

		$scope.update = function(debt) {
		  $scope.showAdd = false;
		  debtsInfoArr.update(debt).success(function(data) {
		    $scope.selectedDebtRecord = null;
		  });
		}; 

		*/

		$scope.create = function() {
			$scope.newDebt.id = $scope.user.debtsInfoArr.length + 1;
			$scope.user.debtsInfoArr.push($scope.newDebt);
			$scope.newDebt = null;
			$scope.showAdd = false;
			$scope.user.updatedManageDebt = true;
			var user = new Users($scope.user);
	        user.$update(function(response) {
	            $scope.success = true;

	            Authentication.user = response;
	            $scope.user = Authentication.user;
	        }, function(response) {
	            $scope.error = response.data.message;
	        });
		};

		$scope.edit = function(debt) {
			$scope.showAdd = false;
			$scope.selectedDebtRecord = debt;
		};

		$scope.update = function(debt) {
			$scope.showAdd = false;
			$scope.selectedDebtRecord = null;
		};

		$scope.delete = function(debt) {
		 	$scope.showAdd = false;
		  	var index = $scope.user.debtsInfoArr.indexOf(debt);
		  	$scope.user.debtsInfoArr.splice(index, 1);

		  	var user = new Users($scope.user);
	        user.$update(function(response) {
	            $scope.success = true;

	            Authentication.user = response;
	            $scope.user = Authentication.user;
	        }, function(response) {
	            $scope.error = response.data.message;
	        });
		};

		$scope.cancel = function() {
		  	$scope.showAdd = false;
		  	$scope.selectedDebtRecord = null;
		};

    }
]);