'use strict';

angular.module('core').controller('HeaderController', ['$rootScope', '$scope', 'Authentication', 'Menus', '$http', '$state', 
	function($rootScope, $scope, Authentication, Menus, $http, $state) {
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$scope.redirectHome = '/#!/';
		if($scope.user) $scope.redirectHome = '/#!/home';
		if(!$scope.user) $scope.redirectHome = '/#!/';

		$scope.$watch('authentication.user', function(){
			$scope.user = Authentication.user;
			if($scope.user){
				$scope.imageUrl = 'https://hexapic.s3.amazonaws.com/' + $scope.user.profilePic + '?decache=' + Math.random();
				$http.get($scope.imageUrl).then(function(response){
					$scope.imageReady = true;
				}, function(response){
					$scope.imageReady = false;
				});				
			}

        });

		$rootScope.$watch('profileImgUrl', function(){
			if($rootScope.profileImgUrl){
				$scope.imageUrl = $rootScope.profileImgUrl + '?decache=' + Math.random();
				$http.get($scope.imageUrl).then(function(response){
					$scope.imageReady = true;
					$state.go($state.current, {}, {reload: true});
				}, function(response){
					$scope.imageReady = false;
				});				
			}			
		});

		// SocketService.on('news', function (data) {
		// 	console.log(data.numNotification);
		// 	$scope.numNotification = data.numNotification;
		// 	SocketService.emit('my other event', { my: 'data' });
		// });
	}
]);