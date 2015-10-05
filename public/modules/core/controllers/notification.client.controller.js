'use strict';

angular.module('core').controller('NotificationController', ['$rootScope', '$scope', 'Authentication', 'Menus', '$http', '$state', 
	function($rootScope, $scope, Authentication, Menus, $http, $state) {
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');


		$scope.redirectHome = '/#!/';
		if($scope.user) $scope.redirectHome = '/#!/home';
		if(!$scope.user) $scope.redirectHome = '/#!/';


		// 

		$scope.getNotification = function(){
			$http.get('/notification/retrieveAll').then(function(response){
				var notificationAll = response.data.notificationListAll;
				var notificationListNew = response.data.notificationListNew;
				$scope.numNotification = notificationListNew.length;
				$scope.list = notificationListNew;
				$scope.listAll = notificationAll;
				if(notificationListNew.length === 0){
					$scope.list[0] = {
						title: 'No new notification'
					};
				}
				console.log($scope.listAll);
			});
		};

		$scope.viewNotification = function(){
			if($scope.numNotification !== 0){
				$http.put('/notification/viewedNotification', {notificationListNew: $scope.list}).success(function(response){
					$scope.numNotification = 0;
				}).error(function(){
					console.log('error updating notication');
				});				
			}

		};


	}
]);