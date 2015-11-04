'use strict';

// Articles controller
angular.module('financial').controller('InsurancesController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication',  'Users', '$q',
	function($scope, $rootScope, $stateParams, $location, Authentication, Users, $q) {
		$scope.user = Authentication.user;
        //Check for authentication
        if (!$scope.user) $location.path('/');

        this.$setScope = function(context) {
            $scope = context;
        };
        
        var dt = new Date();
        $scope.year = dt.getFullYear();

        var loadPolicies = function() {
            $scope.displayInsuranceInfo = angular.copy($scope.user.insurancesInfoArr);    
        };
        loadPolicies();        

        $scope.viewModal = function(insurance) {
            $scope.insurance = insurance;            
        };
        
        $scope.addNewPolicy = function() {
            $scope.insurance.id = $scope.user.insurancesInfoArr.length+1;
            $scope.insurance.year = $scope.selectedYear;
            $scope.user.insurancesInfoArr.push($scope.insurance);

            var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });

            $scope.success = true;
            loadPolicies();
        };

        $scope.editModal = function (insurance) {                        

            for (var i = 0; i<$scope.user.insurancesInfoArr.length; i++) {
                if($scope.user.insurancesInfoArr[i].id===insurance.id) {
                    $scope.insurance = $scope.user.insurancesInfoArr[i];                    
                }
            }
        };

        $scope.editPolicy = function() {
            if ($scope.editForm.$dirty) {
                for (var i = 0; i<$scope.user.insurancesInfoArr.length; i++) {
                    if($scope.user.insurancesInfoArr[i].id===$scope.insurance.id) {
                        $scope.user.insurancesInfoArr[i] = $scope.insurance;                    
                    }
                }
                var userNow = new Users($scope.user);
                userNow.$update(function(response) {
                    $scope.success = true;
                    Authentication.user = response;
                    $scope.user = Authentication.user;
                }, function(response) {
                    $scope.error = response.data.message;
                });

                $scope.success = true;
                loadPolicies(); 
                $scope.editForm.$setPristine();           
            } else {
                $scope.error = 'No Changes Detected';
            }
        };

        $scope.deleteModal = function(insurance) {
            $scope.insurance = insurance;
        };

        $scope.deletePolicy = function() {

            var index = $scope.user.insurancesInfoArr.indexOf($scope.insurance);
            $scope.user.insurancesInfoArr.splice(index, 1);

            for (var b = 0; b<$scope.user.insurancesInfoArr.length; b++) {
                var insuranceRe = $scope.user.insurancesInfoArr[b];
                insuranceRe.id = $scope.user.insurancesInfoArr.indexOf(insuranceRe)+1;
            }
            
            var user = new Users($scope.user);
            user.$update(function(response) {
                $scope.success = true;

                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });
            $scope.success = true;
            loadPolicies();
        };

        $scope.cancel = function() {
            $scope.success = false;
            $scope.insurance = null;
            $scope.error = '';
        };

	}
]);