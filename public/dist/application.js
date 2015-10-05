'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'mean';
	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngSanitize','ui.router', 'ui.bootstrap', 'ui.utils', 'ngFileUpload', 'chart.js', 'angular-toArrayFilter', '720kb.tooltips', 'ngRoute','n3-line-chart','btford.socket-io', 'ngWYSIWYG'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!/home';
		//if (!completeQns)$location.path('/settings/questionnaire');
		//else $location.path('/creditworthiness');
	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('admin', ['users']);
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('core', ['users']);

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('financial');
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('financialtools');
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('milestones');
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('social');
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('admin').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('adminUsers', {
			url: '/admin/users',
			templateUrl: 'modules/admin/views/admin-users.client.view.html'
		}).
		state('adminAssets', {
			url: '/admin/assets',
			templateUrl: 'modules/admin/views/admin-assets.client.view.html'
		}).
		state('adminStatistics', {
			url: '/admin/statistics',
			templateUrl: 'modules/admin/views/admin-statistics.client.view.html'
		});
	}
]);
'use strict';

angular.module('admin').controller('AdminController', ['$scope', '$http', '$location', 'Authentication', '$window', '$state', 
	function($scope, $http, $location, Authentication, $window, $state) {
		$scope.user = Authentication.user;

		// If user is signed in then redirect back home
		
		if (!$scope.user) {
			$location.path('/');
		}else{
			var userType = $scope.user.roles;
			if (userType[0].localeCompare('admin') !== 0) $location.path('/');
		}


		$scope.emailSelected = null;

		$scope.goToDB =function(){
            $window.open('https://mongolab.com/databases/fyphexa');
		};

		$scope.goToAWS = function(){
			$window.open('https://console.aws.amazon.com/s3/home?bucket=hexapic&prefix=assets%2F&region=us-west-2#');
		};

		$scope.retrieveUserRecordsInit = function(){
			$scope.success = $scope.error = null;
			$scope.successRetrieve = null;
			$http.get('/admin/retrieveUsers').then(function(response){
				$scope.userList = response.data;
				$scope.emailSelected = null;
				$scope.userRecord = null;
			});			
		};
		$scope.retrieveUserRecords = function(){
			$scope.success = $scope.error = null;
			$scope.successRetrieve = null;
			$http.get('/admin/retrieveUsers').then(function(response){
				$scope.userList = response.data;
				$scope.emailSelected = null;
				$scope.userRecord = null;
				$scope.successRetrieve = true;
			});
		};

		$scope.showRecord = function(email){
			$scope.successRetrieve = false;
			$scope.emailSelected = email;
			$scope.userList.forEach(function(user){
				if(user.email === email){
					$scope.userRecord = angular.toJson(user, true);
				}
			});
		};

		$scope.updateRecord = function(){
			$http.put('/admin/updateUser', {userEmail: $scope.emailSelected, userRecord: $scope.userRecord}).success(function(response){
				$http.get('/admin/retrieveUsers').then(function(response){
					$scope.userList = response.data;
				});
				$scope.userRecord = angular.toJson(response, true);
				$scope.success = true;
			}).error(function(response){
				console.log(response.data.message);
				$scope.error = response.data.message;
			});
		};

		$scope.deleteRecord = function(){
			console.log($scope.emailSelected);
			if(!$scope.emailSelected){
				console.log('lol');
				$scope.errorDelete = 'User not selected';
			}else{
				$http.put('/admin/deleteUser', {userEmail: $scope.emailSelected, userRecord: $scope.userRecord}).success(function(response){
					console.log(response);
					$scope.userList = response;
					$scope.successDelete = true;
					$scope.userRecord = null;
					$scope.emailSelected = null;
					
				}).error(function(response){
					$scope.errorDelete = response.data.message;
				});				
			}

		};
		$scope.checkDelete = function(){
			$scope.successDelete = null;
			$scope.errorDelete = null;
			if(!$scope.emailSelected){
				$scope.errorDelete = 'User not selected';
			}
		};

		$scope.createNewUser = function(){
			$http.post('/admin/createUser', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				console.log(response);
				$scope.userList = response;
				$scope.successCreate = true;
			}).error(function(response) {
				$scope.errorCreate = response.message;
			});			
		};

		// Upload functions
		$scope.decachedImageUrl = 'https://hexapic.s3.amazonaws.com/assets/default'+ '?decache=' + Math.random();
      
		var upload_file = function(file, signed_request, url){
			$http.put(signed_request, file).success(function(response) {

				$scope.uploaded = true;
				var newImage = url + '?decache=' + Math.random();
				$http.get(newImage).then(function(response){
					$scope.decachedImageUrl = newImage;
				}, function(response){

				});
				
			}).error(function(response) {
				alert('Could not upload file.'); 
			});

		};
		/*
		    Function to get the temporary signed request from the app.
		    If request successful, continue to upload the file using this signed
		    request.
		*/

	    var upload = function (file) {

			// var str = angular.copy(file.name).split('.');
			// $scope.assetName = str[0];
			$scope.assetName = $scope.assetDetails.name;
			$scope.assetType = file.type;			

		    $http.put('/signawsAdmin', {'assetName': $scope.assetName, 'assetType': $scope.assetType}).success(function(response) {
				// If successful 
				upload_file(file, response.signed_request, response.url);
			}).error(function(response) {
				alert('Could not get signed URL.');
			});
	    };

	    $scope.addNewAsset = function(file){
	    	upload(file);
	    	console.log($scope.assetDetails.name);
	    	$scope.assetDetails.image = $scope.assetDetails.name;
	    	$http.post('/admin/addNewAsset', $scope.assetDetails).success(function(response) {
				// If successful we assign the response to the global user model
				console.log(response);
				$scope.assets = response;
				$scope.successAddAsset = true;
				$scope.successUpdateRecords = $scope.errorUpdateRecords = null;
				$scope.successRetrieveAssets = null;
				$http.get('/admin/retrieveAssets').then(function(response){
					$scope.assetList = response.data;
					$scope.assetSelected = null;
					$scope.assetRecord = null;
				});
			}).error(function(response) {
				$scope.errorAddAsset = response.message;
			});	

	    };


	    $scope.retrieveAssetRecordsInit = function(){
			$scope.successUpdateRecords = $scope.errorUpdateRecords = null;
			$scope.successRetrieveAssets = null;
			$http.get('/admin/retrieveAssets').then(function(response){
				$scope.assetList = response.data;
				$scope.assetSelected = null;
				$scope.assetRecord = null;
			});	
	    };

	    $scope.retrieveAssetRecords = function(){
			$scope.successUpdateRecords = $scope.errorUpdateRecords = null;
			$scope.successRetrieveAssets = null;
			$scope.assetRecordShow = false;
			$http.get('/admin/retrieveAssets').then(function(response){
				$scope.assetList = response.data;
				$scope.assetSelected = null;
				$scope.assetRecord = null;
				$scope.successRetrieveAssets = true;
			});		    	
	    };

		$scope.showAssetRecord = function(assetName){
			$scope.assetRecordShow = true;
			$scope.successUpdateAssets = $scope.successAssetDelete = $scope.errorAssetDelete = null;
			var imageUrl = 'https://hexapic.s3.amazonaws.com/assets/';
			$scope.assetImageUrl = imageUrl + assetName + '?decache=' + Math.random();

			$scope.successRetrieveAssets = false;
			$scope.assetSelected = assetName;
			$scope.assetList.forEach(function(asset){
				if(asset.name === assetName){
					$scope.assetRecord = asset;
				}
			});
		};

		$scope.updateAssetRecord = function(){
			$http.put('/admin/updateAsset', {assetName: $scope.assetSelected, assetRecord: $scope.assetRecord}).success(function(response){
				$http.get('/admin/retrieveAssets').then(function(response){
					$scope.assetList = response.data;
				});
				$scope.assetRecord = response;
				$scope.successUpdateAssets = true;
			}).error(function(response){
				console.log(response.data.message);
				$scope.errorUpdateAssets = response.data.message;
			});
		};

		$scope.deleteAssetRecord = function(){
			$http.put('/admin/deleteAsset', {assetName: $scope.assetSelected, assetRecord: $scope.assetRecord}).success(function(response){
				console.log(response);
				$scope.assetList = response;
				$scope.successAssetDelete = true;
				$scope.assetRecord = null;
				$scope.assetSelected = null;
				// $scope.assetRecordShow = false;
				
			}).error(function(response){
				$scope.errorAssetDelete = response.data.message;
			});	
		};
	}
]);
'use strict';

// Configuring the Articles module
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Home', 'home', '/home');
		//Menus.addSubMenuItem('topbar', 'creditworthiness', 'view Creditworthiness', 'creditworthiness');
		Menus.addMenuItem('topbar', 'Financial Health', 'financialhealth', '/financialhealth');

		Menus.addMenuItem('topbar', 'Manage Finances', 'financialrecord','/financialrecord');

		Menus.addMenuItem('topbar', 'Budget', 'budget', '/budget');
		// Menus.addSubMenuItem('topbar', 'financial', 'Manage Debt', 'financial/debt');
		// Menus.addSubMenuItem('topbar', 'financial', 'Manage Insurance', 'financial/insurance');
		// Menus.addSubMenuItem('topbar', 'financial', 'Manage Investment', 'financial/investment');
		// Menus.addSubMenuItem('topbar', 'financial', 'Manage Cashflow', 'financial/cashflow');

		Menus.addMenuItem('topbar', 'Milestones', 'milestones', '/milestones');


		Menus.addMenuItem('topbar', 'Financial Tools', 'financialtools', 'dropdown', '/financialtools');
		Menus.addSubMenuItem('topbar', 'financialtools', 'Loan Calculator', 'financialtools/loancalculator');

		Menus.addMenuItem('topbar', 'Social', 'social', 'dropdown','/social');
		Menus.addSubMenuItem('topbar', 'social', 'View Posts', 'social/posts');
		Menus.addSubMenuItem('topbar', 'social', 'Manage Friends', 'social/friends');
		Menus.addSubMenuItem('topbar', 'social', 'Find Users', 'social/users');

	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('landing', {
			url: '/',
			templateUrl: 'modules/core/views/landing.client.view.html'
		}).
		state('home', {
			url: '/home',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).


		state('financialhealth', {
			url: '/financialhealth',
			templateUrl: 'modules/financial/views/financialhealth.client.view.html'
		}).

		state('financial', {
			url: '/financialrecord',
			templateUrl: 'modules/financial/views/overview.client.view.html'
		}).

		state('manageAssets', {
			url: '/financialrecord/assets',
			templateUrl: 'modules/financial/views/manage-assets.client.view.html'
		}).
		state('manageLiabilities', {
			url: '/financialrecord/liabilities',
			templateUrl: 'modules/financial/views/manage-liabilities.client.view.html'
		}).
		state('manageIncomeExpense', {
			url: '/financialrecord/incomeExpense',
			templateUrl: 'modules/financial/views/manage-incomeExpense.client.view.html'
		}).
		state('manageDebts', {
			url: '/financialrecord/debts',
			templateUrl: 'modules/financial/views/manage-debts.client.view.html'
		}).
		state('manageInsurances', {
			url: '/financialrecord/insurances',
			templateUrl: 'modules/financial/views/manage-insurances.client.view.html'
		}).

		//Financial Tools
		state('repaymentTool', {
			url: '/financialtools/loancalculator',
			templateUrl: 'modules/financialtools/views/repaymentCalculator.client.view.html'
		}).		
		state('amtBorrow', {
			url: '/financialtools/amtborrow',
			templateUrl: 'modules/financialtools/views/amtToBorrowCalculator.client.view.html'
		}).
		state('timeRepay', {
			url: '/financialtools/timetorepay',
			templateUrl: 'modules/financialtools/views/timeToRepayCalculator.client.view.html'
		}).

		//Milestones
		state('milestones', {
			url: '/milestones',
			templateUrl: 'modules/milestones/views/view-milestones.client.view.html'
		}).
		
		state('updateMilestone', {
			url:'/milestones/updatemilestone',
			templateUrl: 'modules/milestones/views/update-Milestone.client.view.html'
		}).


		// state('milestones', {
		// 	url: '/milestones',
		// 	templateUrl: 'modules/milestones/views/milestones.client.view.html'
		// }).
		// state('shortTermMilestones',{
		// 	url: '/milestones/shortterm',
		// 	templateUrl: 'modules/milestones/views/short-term.client.view.html'
		// }).
		// state('longTermMilestones',{
		// 	url: '/milestones/longterm',
		// 	templateUrl: 'modules/milestones/views/long-term.client.view.html'
		// }).


		// state('manageFriend',{
		// 	url: '/social/managefriends',
		// 	templateUrl: 'modules/social/views/manage-friends.client.view.html'
		// }).
		state('manageBudget', {
			url: '/budget',
			templateUrl: 'modules/financial/views/manage-budget.client.view.html'
		 }).
		state('socialPost',{
			url: '/social/posts',
			templateUrl: 'modules/social/views/socialpost.client.view.html'
		}).
		state('socialFriends',{
			url: '/social/friends',
			templateUrl: 'modules/social/views/socialfriends.client.view.html'
		}).
		state('socialUsers',{
			url: '/social/users',
			templateUrl: 'modules/social/views/socialusers.client.view.html'
		}).
		state('notification',{
			url: '/settings/notification',
			templateUrl: 'modules/core/views/notification.client.view.html'
		});

	}
]);
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
				console.log($scope.user.profilePic);
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
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'CreditService', '$location',
	function($scope, Authentication, CreditService, $location) {
		// This provides Authentication context.
		$scope.user = Authentication.user;
		if (!$scope.user) $location.path('/');
		
		$scope.rankIcon = './img/rank/diamond0.jpg';

		if(!$scope.user.currentCreditRating) $scope.user.currentCreditRating = 0;
		$scope.creditGrade = CreditService.creditGrade($scope.user.currentCreditRating);
		if($scope.creditGrade[0] === 'D'){
			$scope.rankIcon = './img/rank/diamond2.png';
		} else if($scope.creditGrade[0] === 'C'){
			$scope.rankIcon = './img/rank/diamond3.png';
		} else if($scope.creditGrade[0] === 'B'){
			$scope.rankIcon = './img/rank/diamond4.png';
		} else if($scope.creditGrade[0] === 'A'){
			$scope.rankIcon = './img/rank/diamond5.png';
		}

		//Calc completeness
		var score = 0;
		if($scope.user.completeQns) score = score + 1;
		if($scope.user.updatedAssets) score = score + 1;
		if($scope.user.updatedLiabilities) score = score + 1;
		if($scope.user.updatedIncomeExpense) score = score + 1;
		if($scope.user.updatedManageDebt) score = score + 1;
		if($scope.user.updatedMilestones) score = score + 1;
		if($scope.user.updatedProfileSettings) score = score + 1;

		$scope.completeBar = Number((score / 7 * 100)).toFixed(2);
		
		$scope.profileCompleteness = false;
		if($scope.user.completeQns && $scope.user.updatedAssets  && $scope.user.updatedLiabilities && $scope.user.updatedIncomeExpense && $scope.user.updatedManageDebt && $scope.user.updatedMilestones && $scope.user.updatedProfileSettings){
			$scope.profileCompleteness = true;
		}
	}
]);
'use strict';


angular.module('core').controller('LandingController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.user = Authentication.user;
	}
]);
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
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

angular.module('core').factory('SocketService', ['socketFactory', function(socketFactory){
	
	// var mySocket = socketFactory();

	// mySocket.forward('error');
	// return mySocket;

}]);
'use strict';

// Setting up route
angular.module('financial').config(['$stateProvider',
	function($stateProvider) {
		// Credit Rating state routing
		/*
		$stateProvider.
		state('viewCreditWorthiness', {
			url: '/creditworthiness',
			templateUrl: 'modules/financialprofile/views/view-creditworthiness.client.view.html'
		}).
		state('viewFinancialHealth', {
			url: '/financialhealth',
			templateUrl: 'modules/financialprofile/views/view-financialhealth.client.view.html'
		}).
		state('viewFinancialPlan', {
			url: '/financialplan',
			templateUrl: 'modules/financialprofile/views/view-financialplan.client.view.html'
		});
	*/
	}
]);
'use strict';

// Articles controller
angular.module('financial').controller('AssetsController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'AssetsService', 'Users', '$q',
    function($scope, $rootScope, $stateParams, $location, Authentication, AssetsService, Users, $q) {
        $scope.user = Authentication.user;

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');
        
        this.$setScope = function(context) {
            $scope = context;
        };
        //Questions
        $scope.oneAtATime = false;
        
        $scope.assetChartDisplay = true;
        $scope.assetsDoughnutData = [1]; 
        $scope.assetsDoughnutLabels = ['No Data'];

        $scope.updateUserFinances = function(isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                //ONLY when they update
                if (!$scope.user.assetsRecordsPeriod) {
                    //If there is no existing record
                    $scope.user.assetsRecordsPeriod = {};
                    $scope.user.assetsRecordsPeriod.minMonth = $scope.month;
                    $scope.user.assetsRecordsPeriod.minYear = $scope.year;
                    $scope.user.assetsRecordsPeriod.maxMonth = $scope.month;
                    $scope.user.assetsRecordsPeriod.maxYear = $scope.year;

                } else {

                    //To review
                    //If there is only 1 rec
                    if ($scope.user.assetsRecordsPeriod.minYear === $scope.user.assetsRecordsPeriod.maxYear && $scope.user.assetsRecordsPeriod.minMonth === $scope.user.assetsRecordsPeriod.maxMonth) {
                        if ($scope.year === $scope.user.assetsRecordsPeriod.minYear) {
                            if ($scope.month < $scope.user.assetsRecordsPeriod.minMonth) {
                                $scope.user.assetsRecordsPeriod.minMonth = $scope.month;
                            } else if ($scope.month > $scope.user.assetsRecordsPeriod.maxMonth) {
                                $scope.user.assetsRecordsPeriod.maxMonth = $scope.month;
                            }
                        } else if ($scope.year < $scope.user.assetsRecordsPeriod.minYear) {
                            $scope.user.assetsRecordsPeriod.minYear = $scope.year;
                            $scope.user.assetsRecordsPeriod.minMonth = $scope.month;
                        } else if ($scope.year > $scope.user.assetsRecordsPeriod.maxYear) {
                            $scope.user.assetsRecordsPeriod.maxYear = $scope.year;
                            $scope.user.assetsRecordsPeriod.maxMonth = $scope.month;
                        }
                    } else {
                        //If more than 1 rec
                        //If smaller
                        if ($scope.year < $scope.user.assetsRecordsPeriod.minYear || $scope.year === $scope.user.assetsRecordsPeriod.minYear && $scope.month < $scope.user.assetsRecordsPeriod.minMonth) {
                            $scope.user.assetsRecordsPeriod.minYear = $scope.year;
                            $scope.user.assetsRecordsPeriod.minMonth = $scope.month;

                        } else if ($scope.year > $scope.user.assetsRecordsPeriod.maxYear || $scope.year === $scope.user.assetsRecordsPeriod.maxYear && $scope.month > $scope.user.assetsRecordsPeriod.maxMonth) {
                            //If bigger
                            $scope.user.assetsRecordsPeriod.maxYear = $scope.year;
                            $scope.user.assetsRecordsPeriod.maxMonth = $scope.month;
                        }
                    }

                }

                var cashEquivalentsArr = $scope.displayAssetsRecords.cashEquivalents;
                var cashEquivalentsTotal = 0;
                angular.forEach(cashEquivalentsArr, function(value, key){
                    cashEquivalentsTotal = cashEquivalentsTotal + Number(value.value);
                });

                var personalUseAssetsArr = $scope.displayAssetsRecords.personalUseAssets;
                var personalUseAssetsTotal = 0;
                angular.forEach(personalUseAssetsArr, function(value, key){
                    personalUseAssetsTotal = personalUseAssetsTotal + Number(value.value);
                });

                var investedAssetsArr = $scope.displayAssetsRecords.investedAssets;
                var investedAssetsTotal = 0;
                angular.forEach(investedAssetsArr, function(value, key){
                    investedAssetsTotal = investedAssetsTotal + Number(value.value);
                });

                var cpfSavingsArr = $scope.displayAssetsRecords.cpfSavings;
                var cpfSavingsTotal = 0;
                angular.forEach(cpfSavingsArr, function(value, key){
                    cpfSavingsTotal = cpfSavingsTotal + Number(value.value);
                });

                var otherAssetsArr = $scope.displayAssetsRecords.otherAssets;
                var otherAssetsTotal = 0;
                angular.forEach(otherAssetsArr, function(value, key){
                    otherAssetsTotal = otherAssetsTotal  + Number(value.value);
                });

                var assetsTotal = cashEquivalentsTotal + personalUseAssetsTotal + investedAssetsTotal + cpfSavingsTotal + otherAssetsTotal;

                $scope.displayAssetsRecords.cashEquivalentsAmt = cashEquivalentsTotal.toFixed(2);
                $scope.displayAssetsRecords.personalUseAssetsAmt = personalUseAssetsTotal.toFixed(2);
                $scope.displayAssetsRecords.investedAssetsAmt = investedAssetsTotal.toFixed(2);
                $scope.displayAssetsRecords.cpfSavingsAmt = cpfSavingsTotal.toFixed(2);
                $scope.displayAssetsRecords.otherAssetsAmt = otherAssetsTotal.toFixed(2);
                $scope.displayAssetsRecords.totalAmt = assetsTotal.toFixed(2);

                if (!$scope.user.assetsRecords) {
                    $scope.user.assetsRecords = [];
                    $scope.user.assetsRecords.push($scope.displayAssetsRecords);
                } else {
                    var recordExist = false;
                    for (var num = 0; num < $scope.user.assetsRecords.length; num++) {
                        if ($scope.user.assetsRecords[num].year === $scope.year && $scope.user.assetsRecords[num].month === $scope.month) {
                            //If exist, update	
                            $scope.user.assetsRecords[num] = $scope.displayAssetsRecords;
                            recordExist = true;
                        }
                    }
                    //else insert
                    console.log(recordExist);
                    console.log($scope.displayAssetsRecords);
                    console.log($scope.user.assetsRecords);
                    if (recordExist === false) {
                        var toInsertArr = angular.copy($scope.displayAssetsRecords);
                        toInsertArr.year = angular.copy($scope.year);
                        toInsertArr.month = angular.copy($scope.month);
                        $scope.user.assetsRecords.push(toInsertArr);
                    }
                }

                $scope.user.updatedAssets = true;
                var user = new Users($scope.user);
                console.log(user);
                user.$update(function(response) {
                    $scope.success = true;
                    Authentication.user = response;
                    $scope.user = Authentication.user;  

                }, function(response) {
                    console.log(response);
                    $scope.error = response.data.message;
                });
            } else {
                $scope.submitted = true;
            }
        };


        //--DATE Selected
        var current = function() {
            $scope.dt = new Date();
            $scope.month = $scope.dt.getMonth();
            $scope.year = Number($scope.dt.getFullYear());
            $scope.monthDisplay = $scope.selectedMonth;
            $scope.selectedYear = $scope.year;
            // ng-init="selectedYear = year"
            console.log($scope.month);
            console.log($scope.year);
        };

        current();
        $scope.monthArr = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
            ];
    
        var reloadData = function(){
            if (!$scope.user.assetsRecordsPeriod || ($scope.user.assetsRecordsPeriod.minMonth > $scope.month && $scope.user.assetsRecordsPeriod.minYear >= $scope.year) || ( $scope.user.assetsRecordsPeriod.minYear > $scope.year)) {

                $scope.displayAssetsRecords = angular.copy(AssetsService.assetsRecords);
                $scope.displayAssetsRecords.year = angular.copy($scope.year);
                $scope.displayAssetsRecords.month = angular.copy($scope.month);

            } else {

                if ($scope.user.assetsRecordsPeriod.minMonth === $scope.user.assetsRecordsPeriod.maxMonth && $scope.user.assetsRecordsPeriod.minYear === $scope.user.assetsRecordsPeriod.maxYear) {
                    $scope.displayAssetsRecords = angular.copy($scope.user.assetsRecords[0]);
                } else {
                    // IF there is multiple record

                    //TO review
                    var targetYear;
                    var targetMonth;
                    var minimumYear = $scope.user.assetsRecordsPeriod.minYear;
                    var minimumMonth = $scope.user.assetsRecordsPeriod.minMonth;
                    var maximumYear = $scope.user.assetsRecordsPeriod.maxYear;
                    var maximumMonth = $scope.user.assetsRecordsPeriod.maxMonth;

                    var latestYear = minimumYear;
                    var latestMonth = minimumMonth;

                    var latestRecord;

                    if ($scope.year > maximumYear || $scope.year === maximumYear && $scope.month >= maximumMonth) {
                        //Date after max
                        targetYear = maximumYear;
                        targetMonth = maximumMonth;
                        for (var r2 in $scope.user.assetsRecords) {
                            if ($scope.user.assetsRecords[r2].year === targetYear && $scope.user.assetsRecords[r2].month === targetMonth) {
                                latestRecord = angular.copy($scope.user.assetsRecords[r2]);
                            }
                        }
                    } else {
                        //Date in between
                        targetYear = $scope.year;
                        targetMonth = $scope.month;
                        for (var r3 in $scope.user.assetsRecords) {
                            if ($scope.user.assetsRecords[r3].year < targetYear || $scope.user.assetsRecords[r3].year === targetYear && $scope.user.assetsRecords[r3].month <= targetMonth) {
                                if ($scope.user.assetsRecords[r3].year === latestYear && $scope.user.assetsRecords[r3].month >= latestMonth) {
                                    latestRecord = angular.copy($scope.user.assetsRecords[r3]);
                                    latestMonth = angular.copy($scope.user.assetsRecords[r3].month);
                                } else if ($scope.user.assetsRecords[r3].year > latestYear) {
                                    latestRecord = angular.copy($scope.user.assetsRecords[r3]);
                                    latestMonth = angular.copy($scope.user.assetsRecords[r3].month);
                                    latestYear = angular.copy($scope.user.assetsRecords[r3].year);
                                }
                            }
                        }
                    }
                    $scope.displayAssetsRecords = latestRecord;
                }
            }

            if (!$scope.displayAssetsRecords.cashEquivalentsAmt && !$scope.displayAssetsRecords.personalUseAssetsAmt && !$scope.displayAssetsRecords.investedAssetsAmt && !$scope.displayAssetsRecords.cpfSavingsAmt && !$scope.displayAssetsRecords.otherAssetsAmt){
                $scope.assetsDoughnutData = [1];
                $scope.assetsDoughnutLabels = ['No Data'];
            } else {
                $scope.assetsDoughnutData = [$scope.displayAssetsRecords.cashEquivalentsAmt, $scope.displayAssetsRecords.personalUseAssetsAmt, $scope.displayAssetsRecords.investedAssetsAmt, $scope.displayAssetsRecords.cpfSavingsAmt, $scope.displayAssetsRecords.otherAssetsAmt]; 
                $scope.assetsDoughnutLabels = ['Cash & Cash Equivalents', 'Personal Use Assets', 'Invested Assets', 'CPF Savings', 'Other Assets'];
            }
        };



        var retrieveRecord = function() {
            $scope.month = $scope.monthArr.indexOf($scope.selectedMonth);
            $scope.monthDisplay = $scope.selectedMonth;
            $scope.year = $scope.selectedYear;

            if ($scope.success || $scope.error) {
                $scope.success = false;
                $scope.error = false;
            }

            $scope.$watch('user', function() {
                reloadData();
            });
        };

        $scope.$watch('selectedMonth', function(){
            retrieveRecord();
        });
        $scope.$watch('selectedYear', function(){
            retrieveRecord();
        });

        $scope.$watch('user', function(){
            $scope.month = $scope.monthArr.indexOf($scope.selectedMonth);
            $scope.monthDisplay = $scope.selectedMonth;
            $scope.year = $scope.selectedYear;

            console.log($scope.user.assetsRecords);

            reloadData();
        });

        $scope.clearSuccessMessage = function(){
            if ($scope.success || $scope.error) {
                $scope.success = false;
                $scope.error = false;
            }
        };

    }
]);
'use strict';

// Articles controller
angular.module('financial').controller('BudgetController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Users', '$q', 'IncomeExpenseService', 'BudgetService',
    function($scope, $rootScope, $stateParams, $location, Authentication, Users, $q, IncomeExpenseService, BudgetService) {
        $scope.user = Authentication.user;

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');
        
        this.$setScope = function(context) {
            $scope = context;
        };

        $scope.displayIncomeExpenseRecords = angular.copy(IncomeExpenseService.incomeExpenseRecords);
        var thisMonthExpense;
        
        $scope.fixedExpense = $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense;
        $scope.transportExpense = $scope.displayIncomeExpenseRecords.monthlyExpense.transport;
        $scope.utilityExpense = $scope.displayIncomeExpenseRecords.monthlyExpense.utilityHousehold;
        $scope.foodExpense = $scope.displayIncomeExpenseRecords.monthlyExpense.foodNecessities;
        $scope.miscExpense = $scope.displayIncomeExpenseRecords.monthlyExpense.misc;
        
        //actual copy
        var incomeExpense = $scope.user.incomeExpenseRecords;       
        var today = new Date();
        //Retrieve records for present month
        var presentMonth = today.getMonth();
        var presentYear = today.getYear() +1900;

        //Date Limits initialized
        var dateObjStart = new Date(today.getFullYear(),today.getMonth(),1);
        if (((dateObjStart.getMonth()+1).toString()).length===1) {
            $scope.firstDay = dateObjStart.getFullYear()+'-0'+(dateObjStart.getMonth()+1)+'-0'+dateObjStart.getDate();
        } else {
            $scope.firstDay = dateObjStart.getFullYear()+'-'+(dateObjStart.getMonth()+1)+'-0'+dateObjStart.getDate();
        }
        var dateObjEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0); 
        if (((dateObjEnd.getMonth()+1).toString()).length===1) {
            $scope.lastDay = dateObjEnd.getFullYear()+'-0'+(dateObjEnd.getMonth()+1)+'-'+dateObjEnd.getDate();   
        } else {
            $scope.lastDay = dateObjEnd.getFullYear()+'-'+(dateObjEnd.getMonth()+1)+'-'+dateObjEnd.getDate();   
        }


        $scope.feStatus =true;        
        $scope.tStatus =true;
        $scope.fStatus =true;
        $scope.uStatus =true;
        $scope.mStatus =true;

        $scope.formSubmitted = false;
        
        var mth = [];
        mth[0] = 'January';
        mth[1] = 'February';
        mth[2] = 'March';
        mth[3] = 'April';
        mth[4] = 'May';
        mth[5] = 'June';
        mth[6] = 'July';
        mth[7] = 'August';
        mth[8] = 'September';
        mth[9] = 'October';
        mth[10] = 'November';
        mth[11] = 'December';
        var monthString = mth[presentMonth];            
        $scope.displayDate = monthString+', '+presentYear;        

        var dateFormatter = function(date) {
            var mth = [];
            mth[0] = 'Jan';
            mth[1] = 'Feb';
            mth[2] = 'Mar';
            mth[3] = 'Apr';
            mth[4] = 'May';
            mth[5] = 'Jun';
            mth[6] = 'Jul';
            mth[7] = 'Aug';
            mth[8] = 'Sept';
            mth[9] = 'Oct';
            mth[10] = 'Nov';
            mth[11] = 'Dec';
            var monthString = mth[date.getMonth()];
            var dateString = date.getDate();
            var yearString = date.getYear()+1900;
            var final_String = dateString+'-'+monthString+'-'+yearString;
            return final_String;
        };

        var progressInfo = function(value) {
            var type;
            if (value < 25) {
              type = 'success';
            } else if (value < 50) {
              type = 'info';
            } else if (value < 75) {
              type = 'warning';
            } else {
              type = 'danger';
            }
            return type; 
        };

        var standingCheck = function (actual, budget) {
            if (actual<= budget) {                
                return true;
                
            } else {                
                return false;
            }
        }; 
        

        $scope.loadTables = function() {


            $scope.incomeExpenseChartDisplay = true;
            $scope.incomeExpenseDoughnutData = [1]; 
            $scope.incomeExpenseDoughnutLabels = ['No Data'];            
            
            
            //INITIALIZING BUDGET LIMITS & PROGRESS BARS
            if (typeof $scope.user.budgetLimits === 'undefined') {     
                console.log('First time bitch');
                $scope.user.budgetLimits = angular.copy(BudgetService.budgetLimits);                
                var userNow = new Users($scope.user);
                userNow.$update(function(response) {
                    $scope.success = true;
                    Authentication.user = response;
                    $scope.user = Authentication.user;
                }, function(response) {
                    $scope.error = response.data.message;
                });
            }
            $scope.fixedExpenseB = $scope.user.budgetLimits.fixedExpenseB;
            $scope.transportB = $scope.user.budgetLimits.transportB;
            $scope.foodB = $scope.user.budgetLimits.foodB;
            $scope.miscB = $scope.user.budgetLimits.miscB;
            $scope.utilitiesB = $scope.user.budgetLimits.utilitiesB;

            $scope.feBudgetSet = false;
            $scope.tBudgetSet = false;
            $scope.fBudgetSet = false;
            $scope.mBudgetSet = false;
            $scope.uBudgetSet = false;
            $scope.allBudgetSet = false;

            if ($scope.user.budgetLimits.fixedExpenseB!==0) {
                $scope.feBudgetSet = true;
            }
            if ($scope.user.budgetLimits.transportB!==0) {
                $scope.tBudgetSet = true;   
            }
            if ($scope.user.budgetLimits.foodB!==0) {
                $scope.fBudgetSet = true;
            }
            if ($scope.user.budgetLimits.miscB!==0) {
                $scope.mBudgetSet = true;
            }
            if ($scope.user.budgetLimits.utilitiesB!==0) {
                $scope.uBudgetSet = true;
            }
            if($scope.feBudgetSet && $scope.tBudgetSet && $scope.fBudgetSet && $scope.mBudgetSet && $scope.uBudgetSet) {
                $scope.allBudgetSet = true;
            }

            $scope.userExpenseCopy = [];
            angular.copy($scope.user.incomeExpenseRecords, $scope.userExpenseCopy);            
            $scope.thisMonthFixedExpenseTotal = '0.00';
            $scope.thisMonthTransportTotal = '0.00';
            $scope.thisMonthMiscTotal = '0.00';
            $scope.thisMonthUtilitiesTotal = '0.00';
            $scope.thisMonthFoodTotal = '0.00';
            $scope.totalExpense = '0.00';


            $scope.displayFixedExpenseB = $scope.user.budgetLimits.fixedExpenseB;
            $scope.displayTransportB = $scope.user.budgetLimits.transportB;
            $scope.displayFoodB = $scope.user.budgetLimits.foodB;
            $scope.displayUtilitiesB = $scope.user.budgetLimits.utilitiesB;
            $scope.displayMiscB = $scope.user.budgetLimits.miscB;

            $scope.displayThisMonthFixedExpenseTotal = 0;
            $scope.displayThisMonthTransportTotal = 0;
            $scope.displayThisMonthFoodTotal = 0;
            $scope.displayThisMonthUtilitiesTotal = 0;
            $scope.displayThisMonthMiscTotal = 0;
            
            for(var i=0;i<$scope.userExpenseCopy.length; i++) {            
                var record = $scope.userExpenseCopy[i];
                
                if (record.month===presentMonth&&record.year===presentYear) {
                                                         
                    //Load Fixed Expense Table
                    var fixedExpenseArr = record.monthlyExpense.fixedExpense;
                    $scope.thisMonthFixedExpenseTotal = record.fixedExpenseAmt;
                    $scope.displayThisMonthFixedExpenseTotal = Number(record.fixedExpenseAmt);

                    var  valueE = ($scope.thisMonthFixedExpenseTotal/$scope.fixedExpenseB)*100;                    
                    var typeE = progressInfo(valueE);                   
                    $scope.dynamicE = Math.floor(valueE);
                    $scope.typeE = typeE;
                    $scope.feStatus = standingCheck($scope.thisMonthFixedExpenseTotal,$scope.fixedExpenseB);                    
                    $scope.displayFeExceed = ($scope.displayThisMonthFixedExpenseTotal-$scope.fixedExpenseB).toFixed(2);
                    
                    //Load Transport Expense Table
                    var transportArr = record.monthlyExpense.transport;                    
                    $scope.thisMonthTransportTotal = record.transportAmt;                    
                    $scope.displayThisMonthTransportTotal = Number(record.transportAmt);

                    var valueT = ($scope.thisMonthTransportTotal/$scope.transportB)*100;
                    var typeT = progressInfo(valueT);
                    $scope.dynamicT = Math.floor(valueT);                    
                    $scope.typeT =typeT;
                    $scope.tStatus = standingCheck($scope.thisMonthTransportTotal,$scope.transportB);
                    $scope.displayTExceed = ($scope.displayThisMonthTransportTotal-$scope.transportB).toFixed(2);
                    
                    //Load Food Expense Table
                    var foodArr = record.monthlyExpense.foodNecessities;
                    $scope.thisMonthFoodTotal = record.foodNecessitiesAmt;
                    $scope.displayThisMonthFoodTotal = Number(record.foodNecessitiesAmt);

                    var valueF = ($scope.thisMonthFoodTotal/$scope.foodB)*100;
                    var typeF = progressInfo(valueF);
                    $scope.dynamicF = Math.floor(valueF);
                    $scope.typeF =typeF;
                    $scope.fStatus = standingCheck($scope.thisMonthFoodTotal,$scope.foodB);
                    $scope.displayFExceed = ($scope.displayThisMonthFoodTotal-$scope.foodB).toFixed(2);

                    //Load Utilities Expense Table
                    var utilitiesArr = record.monthlyExpense.utilityHousehold;
                    $scope.thisMonthUtilitiesTotal = record.utilityHouseholdAmt;
                    $scope.displayThisMonthUtilitiesTotal = Number(record.utilityHouseholdAmt);

                    var valueU = ($scope.thisMonthUtilitiesTotal/$scope.utilitiesB)*100;
                    var typeU = progressInfo(valueU);
                    $scope.dynamicU = Math.floor(valueU);
                    $scope.typeU =typeU;
                    $scope.uStatus = standingCheck($scope.thisMonthUtilitiesTotal,$scope.utilitiesB);
                    $scope.displayUExceed = ($scope.displayThisMonthUtilitiesTotal-$scope.utilitiesB).toFixed(2);

                    //Load Misc Expense Table
                    var miscArr = record.monthlyExpense.misc;
                    $scope.thisMonthMiscTotal = record.miscAmt;
                    $scope.displayThisMonthMiscTotal = Number(record.miscAmt);

                    var valueM = ($scope.thisMonthMiscTotal/$scope.miscB)*100;
                    var typeM = progressInfo(valueM);
                    $scope.dynamicM = Math.floor(valueM);
                    $scope.typeM =typeM;
                    $scope.mStatus = standingCheck($scope.thisMonthMiscTotal,$scope.miscB);
                    $scope.displayMExceed = ($scope.displayThisMonthMiscTotal-$scope.miscB).toFixed(2);
                    //Load Charts

                    if(!record.fixedExpenseAmt && !record.transportAmt && !record.utilityHouseholdAmt && !record.foodNecessitiesAmt && !record.miscAmt) {
                        $scope.incomeExpenseDoughnutData = [1]; 
                        $scope.incomeExpenseDoughnutLabels = ['No Data'];
                                                
                        
                    } else {
                        $scope.incomeExpenseDoughnutData = [record.fixedExpenseAmt, record.transportAmt, record.utilityHouseholdAmt, record.foodNecessitiesAmt, record.miscAmt]; 
                        $scope.incomeExpenseDoughnutLabels = ['Fixed Expense', 'Transport', 'Utilities & Household Maintenance', 'Food & Necessities', 'Miscellaneous'];                        
                        $scope.totalExpense = record.monthlyExpenseAmt;                        
                    }

                    $scope.feDiffTable = [];
                    $scope.tDiffTable = [];
                    $scope.fDiffTable = [];
                    $scope.mDiffTable =[];
                    $scope.uDiffTable = [];

                    $scope.fixedExpenseTable = [];
                    $scope.transportTable = [];
                    $scope.foodTable = [];
                    $scope.miscTable = [];
                    $scope.utilitiesTable = []; 
                    

                    var rt;
                    var feType;
                    var feRecords;
                    var recordsTotal;
                    var diff;
                    var diffObj;
                    var indRecord;                    
                    var a;
                    var dateFormatted;
                    var amount;
                    var modRecord;
                    for (rt in fixedExpenseArr) {
                        feType = fixedExpenseArr[rt];
                        feRecords = feType.records;
                        recordsTotal = feType.recordsTotal;                       
                        
                        if (feType.value>feType.recordsTotal) {
                            diff = (feType.value-feType.recordsTotal).toFixed(2);                                
                            diffObj = {
                                type : feType.description,
                                diff : diff
                            };
                            $scope.feDiffTable.push(diffObj);
                        }                         

                        for(a=0; a<feRecords.length;a++) {
                            indRecord = feRecords[a];
                            dateFormatted = dateFormatter(new Date(feRecords[a].date));                        
                            amount = feRecords[a].amount.toFixed(2);

                            modRecord = {
                                detail: feRecords[a].detail,
                                date: dateFormatted,
                                amount: amount,
                                description:feType.description
                            };                            
                            $scope.fixedExpenseTable.push(modRecord);                        
                        }
                    }
                    for (rt in transportArr) {
                        feType = transportArr[rt];
                        feRecords = feType.records;
                        recordsTotal = feType.recordsTotal;                       
                        
                        if (feType.value>feType.recordsTotal) {
                            diff = (feType.value-feType.recordsTotal).toFixed(2);                                
                            diffObj = {
                                type : feType.description,
                                diff : diff
                            };
                            $scope.tDiffTable.push(diffObj);
                        }
                        

                        for(a=0; a<feRecords.length;a++) {
                            indRecord = feRecords[a];
                            dateFormatted = dateFormatter(new Date(feRecords[a].date));                        
                            amount = feRecords[a].amount.toFixed(2);

                            modRecord = {
                                detail: feRecords[a].detail,
                                date: dateFormatted,
                                amount: amount,
                                description:feType.description
                            };
                            $scope.transportTable.push(modRecord);
                        }
                    }

                    for (rt in foodArr) {
                        feType = foodArr[rt];
                        feRecords = feType.records;
                        recordsTotal = feType.recordsTotal;                       
                        
                        if (feType.value>feType.recordsTotal) {
                            diff = (feType.value-feType.recordsTotal).toFixed(2);                                
                            diffObj = {
                                type : feType.description,
                                diff : diff
                            };
                            $scope.fDiffTable.push(diffObj);
                        }
                        

                        for(a=0; a<feRecords.length;a++) {
                            indRecord = feRecords[a];
                            dateFormatted = dateFormatter(new Date(feRecords[a].date));                        
                            amount = feRecords[a].amount.toFixed(2);
                            //var modRecord = {feRecords[a].detail,}
                            //console.log(typeof feRecords[a].date); 

                            modRecord = {
                                detail: feRecords[a].detail,
                                date: dateFormatted,
                                amount: amount,
                                description:feType.description
                            };
                            $scope.foodTable.push(modRecord);
                        }
                    }

                    for (rt in utilitiesArr) {
                        feType = utilitiesArr[rt];
                        feRecords = feType.records;
                        recordsTotal = feType.recordsTotal;                       
                        
                        if (feType.value>feType.recordsTotal) {
                            diff = (feType.value-feType.recordsTotal).toFixed(2);                                
                            diffObj = {
                                type : feType.description,
                                diff : diff
                            };
                            $scope.uDiffTable.push(diffObj);
                        }
                        

                        for(a=0; a<feRecords.length;a++) {
                            indRecord = feRecords[a];
                            dateFormatted = dateFormatter(new Date(feRecords[a].date));                        
                            amount = feRecords[a].amount.toFixed(2);
                            //var modRecord = {feRecords[a].detail,}
                            //console.log(typeof feRecords[a].date); 

                            modRecord = {
                                detail: feRecords[a].detail,
                                date: dateFormatted,
                                amount: amount,
                                description:feType.description
                            };
                            $scope.utilitiesTable.push(modRecord);
                        }
                    }

                    for (rt in miscArr) {
                        feType = miscArr[rt];
                        feRecords = feType.records;
                        recordsTotal = feType.recordsTotal;                       
                        
                        if (feType.value>feType.recordsTotal) {
                            diff = (feType.value-feType.recordsTotal).toFixed(2);                                
                            diffObj = {
                                type : feType.description,
                                diff : diff
                            };
                            $scope.mDiffTable.push(diffObj);
                        }
                        

                        for(a=0; a<feRecords.length;a++) {
                            indRecord = feRecords[a];
                            dateFormatted = dateFormatter(new Date(feRecords[a].date));                        
                            amount = feRecords[a].amount.toFixed(2);
                            //var modRecord = {feRecords[a].detail,}
                            //console.log(typeof feRecords[a].date); 

                            modRecord = {
                                detail: feRecords[a].detail,
                                date: dateFormatted,
                                amount: amount,
                                description:feType.description
                            };
                            $scope.miscTable.push(modRecord);
                        }
                    }
                }
            }
                    
        };
        $scope.loadTables();

        $scope.addNewExpense = function() {


            $scope.type = $scope.type.trim();                

            if (!$scope.user.incomeExpenseRecordsPeriod) {
                //If there is no existing record
                console.log('do you enter?');
                $scope.user.incomeExpenseRecordsPeriod = {};
                $scope.user.incomeExpenseRecordsPeriod.minMonth = presentMonth;
                $scope.user.incomeExpenseRecordsPeriod.minYear = presentYear;
                $scope.user.incomeExpenseRecordsPeriod.maxMonth = presentMonth;
                $scope.user.incomeExpenseRecordsPeriod.maxYear = presentYear;                

            } else if (($scope.user.incomeExpenseRecordsPeriod.maxMonth <= presentMonth && $scope.user.incomeExpenseRecordsPeriod.maxYear <= presentYear) || ($scope.user.incomeExpenseRecordsPeriod.maxMonth > presentMonth && $scope.user.incomeExpenseRecordsPeriod.maxYear < presentYear)) {

                console.log('do you enter2?');
                //ASSUMING THAT THE USER NEVER INSERTS DATA FOR THE FUTURE (HE CANT POSSIBLY DO SO ALSO)
                //SETS RECORDS MAX PERIOD TO PRESENT MONTH & YEAR
                //I ALSO CURRENTLY DONT ALLOW USERS TO SET BUDGET FOR THE FUTURE (ONLY FOR PRESENT MONTH)
                $scope.user.incomeExpenseRecordsPeriod.maxMonth = presentMonth;
                $scope.user.incomeExpenseRecordsPeriod.maxYear = presentYear;
            }

             
            
            if($scope.user.incomeExpenseRecords.length===0) { //in the event of an empty record (FIRSTTIME)                
                console.log('1st');
                $scope.displayIncomeExpenseRecords.year = presentYear;
                $scope.displayIncomeExpenseRecords.month = presentMonth;                                
                $scope.user.incomeExpenseRecords.push($scope.displayIncomeExpenseRecords); 
            } else { //Existing record but no record of that month
                var existenceCheck = 0;
                for (var j=0;j<$scope.user.incomeExpenseRecords.length; j++) {   
                    var recordChecker = $scope.user.incomeExpenseRecords[j];                                                         
                    if (recordChecker.month===presentMonth&&recordChecker.year===presentYear) {
                        existenceCheck++;
                        console.log('2nd');
                    }
                }
                if (existenceCheck===0) {
                    $scope.displayIncomeExpenseRecords.year = presentYear;
                    $scope.displayIncomeExpenseRecords.month = presentMonth;                                
                    $scope.user.incomeExpenseRecords.push($scope.displayIncomeExpenseRecords);  
                    console.log('3rd');
                }
            }
            
            for(var i=0;i<$scope.user.incomeExpenseRecords.length; i++) {            
                var expenseRecord = $scope.user.incomeExpenseRecords[i];  

                if (expenseRecord.month===presentMonth&&expenseRecord.year===presentYear) {
                    
                    var thisMonthSpecExpense = {};
                    
                    if($scope.formRef==='fixedExpense') {                        
                        thisMonthSpecExpense = expenseRecord.monthlyExpense.fixedExpense;
                    } else if ($scope.formRef==='transport') {
                        thisMonthSpecExpense = expenseRecord.monthlyExpense.transport;
                    } else if ($scope.formRef==='utility') {
                        thisMonthSpecExpense = expenseRecord.monthlyExpense.utilityHousehold ;
                    } else if ($scope.formRef==='food') {
                        thisMonthSpecExpense = expenseRecord.monthlyExpense.foodNecessities;
                    } else if ($scope.formRef==='misc') {
                        thisMonthSpecExpense = expenseRecord.monthlyExpense.misc;
                    }

                    var record = {
                        detail: $scope.detail,
                        date: $scope.date,
                        amount: $scope.expenseAmt
                    };

                    console.log('Almost THERE');
                    
                    for (var get in thisMonthSpecExpense) {                        
                        var obj = thisMonthSpecExpense[get];
                        if($scope.type=== obj.description) {
                            console.log('SUCCESS');
                            obj.recordsTotal += $scope.expenseAmt;
                            obj.records.push(record);
                            if (obj.recordsTotal>=obj.value) {
                                obj.value = obj.recordsTotal;
                            }
                        }
                    }
                    //thisMonthSpecExpense                                                                      
                                           
                }
                var fixedExpenseArr = expenseRecord.monthlyExpense.fixedExpense;
                var fixedExpenseTotal = 0;
                for (var rt in fixedExpenseArr) {
                    var obj1 = fixedExpenseArr[rt];
                    fixedExpenseTotal += obj1.value;
                }
                expenseRecord.fixedExpenseAmt = fixedExpenseTotal.toFixed(2);

                var transportArr = expenseRecord.monthlyExpense.transport;
                var transportTotal = 0;
                for (var rt1 in transportArr) {
                    var obj2 = transportArr[rt1];
                    transportTotal += obj2.value;
                }
                expenseRecord.transportAmt = transportTotal.toFixed(2);

                var utilityHouseholdArr = expenseRecord.monthlyExpense.utilityHousehold;
                var utilityHouseholdTotal = 0;
                for (var rt2 in utilityHouseholdArr) {
                    var obj3 = utilityHouseholdArr[rt2];
                    utilityHouseholdTotal += obj3.value;
                }
                expenseRecord.utilityHouseholdAmt = utilityHouseholdTotal.toFixed(2);

                var foodNecessitiesArr = expenseRecord.monthlyExpense.foodNecessities;
                var foodNecessitiesTotal = 0;
                for (var rt3 in foodNecessitiesArr) {
                    var obj4 = foodNecessitiesArr[rt3];
                    foodNecessitiesTotal += obj4.value;
                }
                expenseRecord.foodNecessitiesAmt = foodNecessitiesTotal.toFixed(2);

                var miscArr = expenseRecord.monthlyExpense.misc;
                var miscTotal = 0;
                for (var rt4 in miscArr) {
                    var obj5 = miscArr[rt4];
                    miscTotal += obj5.value;
                }
                expenseRecord.miscAmt = miscTotal.toFixed(2);

                var monthlyIncomeAmt = Number(expenseRecord.monthlyIncomeAmt);                
                var monthlyExpenseAmt = fixedExpenseTotal + transportTotal + utilityHouseholdTotal + foodNecessitiesTotal + miscTotal;
                var netCashFlow = monthlyIncomeAmt - monthlyExpenseAmt;                
                expenseRecord.monthlyIncomeAmt = monthlyIncomeAmt.toFixed(2);                
                expenseRecord.monthlyExpenseAmt = monthlyExpenseAmt.toFixed(2);
                expenseRecord.netCashFlow = netCashFlow.toFixed(2);  
            }

            var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });
            //alert('Expense Added!');
            $scope.formSubmitted = true;
            $scope.detail = '';
            $scope.date = '';
            $scope.expenseAmt = '';
            $scope.type = '';
            $scope.loadTables();            
            //location.reload(); 
                           
        };

        $scope.resetModal = function () {            
            $scope.formSubmitted = false;
        };

        $scope.forms = {};        
        $scope.$watch('forms.addFixedExpenseForm.$valid', function() {
            console.log('watching feForm' + $scope.forms.addFixedExpenseForm.$valid); 
         });

        $scope.setFixedExpenseBudget = function() {

            $scope.user.budgetLimits.fixedExpenseB = $scope.fixedExpenseB;

            var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });
            alert('Budget Set!');
            $scope.loadTables();
         };
        $scope.setTransportBudget = function() {
            
            $scope.user.budgetLimits.transportB = $scope.transportB;

            var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });
            alert('Budget Set!');
            $scope.loadTables();
         };
        $scope.setUtilitiestBudget = function() {
            
            $scope.user.budgetLimits.utilitiesB = $scope.utilitiesB;

            var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });
            alert('Budget Set!');
            $scope.loadTables();
         };
        $scope.setFoodBudget = function() {

            $scope.user.budgetLimits.foodB = $scope.foodB;

            var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });
            alert('Budget Set!');
            $scope.loadTables();
         };
         $scope.setMiscBudget = function() {

            $scope.user.budgetLimits.miscB = $scope.miscB;

            var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });
            alert('Budget Set!');
            $scope.loadTables();
         };

        $scope.standbyForDelete = function (item,expenseType) {
            $scope.item = item;
            $scope.expenseType = expenseType; 

        };

        $scope.cancelDelete = function () {
            $scope.item = '';
            $scope.expenseType = '';             
        };

        $scope.deleteRecord = function() {
                         
            for(var i=0;i<$scope.user.incomeExpenseRecords.length; i++) {            
                var expenseRecord = $scope.user.incomeExpenseRecords[i];  
                if (expenseRecord.month===presentMonth&&expenseRecord.year===presentYear) {
                    console.log('level1');
                    var expenseSelected;
                    
                    if($scope.expenseType==='fixedExpense') {
                        expenseSelected = expenseRecord.monthlyExpense.fixedExpense;
                        console.log('level2.1');                                                
                    } else if($scope.expenseType==='transport') {
                        expenseSelected = expenseRecord.monthlyExpense.transport;
                        console.log('level2.2');
                    } else if($scope.expenseType==='utility') {
                        expenseSelected = expenseRecord.monthlyExpense.utilityHousehold;
                        console.log('level2.3');
                    } else if($scope.expenseType==='food') {
                        expenseSelected = expenseRecord.monthlyExpense.foodNecessities;
                        console.log('level2.4');
                    } else if($scope.expenseType==='misc') {
                        expenseSelected = expenseRecord.monthlyExpense.misc;
                        console.log('level2.5');
                    }

                    for (var get in expenseSelected) {                        
                        var obj = expenseSelected[get];                        
                        
                        if($scope.item.description=== obj.description) {
                            console.log('SUCCESS');
                            for (var a =0; a<obj.records.length; a++) {
                                var specRec = obj.records[a];
                                var itemNo = Number($scope.item.amount);
                                if (specRec.detail===$scope.item.detail&&specRec.amount===itemNo){
                                    obj.recordsTotal -= itemNo;
                                    obj.value -= itemNo;
                                    obj.records.splice(a,1);
                                    console.log('Make it?');
                                    //MORE DETAILED CHECK REQUIRED
                                    //CHANGE RECORDS TOTAL                                        
                                }
                            }
                        }
                    }
                    var fixedExpenseArr = expenseRecord.monthlyExpense.fixedExpense;
                    var fixedExpenseTotal = 0;
                    for (var rt in fixedExpenseArr) {
                        var obj1 = fixedExpenseArr[rt];
                        fixedExpenseTotal += obj1.value;
                    }
                    expenseRecord.fixedExpenseAmt = fixedExpenseTotal.toFixed(2);

                    var transportArr = expenseRecord.monthlyExpense.transport;
                    var transportTotal = 0;
                    for (var rt1 in transportArr) {
                        var obj2 = transportArr[rt1];
                        transportTotal += obj2.value;
                    }
                    expenseRecord.transportAmt = transportTotal.toFixed(2);

                    var utilityHouseholdArr = expenseRecord.monthlyExpense.utilityHousehold;
                    var utilityHouseholdTotal = 0;
                    for (var rt2 in utilityHouseholdArr) {
                        var obj3 = utilityHouseholdArr[rt2];
                        utilityHouseholdTotal += obj3.value;
                    }
                    expenseRecord.utilityHouseholdAmt = utilityHouseholdTotal.toFixed(2);

                    var foodNecessitiesArr = expenseRecord.monthlyExpense.foodNecessities;
                    var foodNecessitiesTotal = 0;
                    for (var rt3 in foodNecessitiesArr) {
                        var obj4 = foodNecessitiesArr[rt3];
                        foodNecessitiesTotal += obj4.value;
                    }
                    expenseRecord.foodNecessitiesAmt = foodNecessitiesTotal.toFixed(2);

                    var miscArr = expenseRecord.monthlyExpense.misc;
                    var miscTotal = 0;
                    for (var rt4 in miscArr) {
                        var obj5 = miscArr[rt4];
                        miscTotal += obj5.value;
                    }
                    expenseRecord.miscAmt = miscTotal.toFixed(2);

                    var monthlyIncomeAmt = Number(expenseRecord.monthlyIncomeAmt);                
                    var monthlyExpenseAmt = fixedExpenseTotal + transportTotal + utilityHouseholdTotal + foodNecessitiesTotal + miscTotal;
                    var netCashFlow = monthlyIncomeAmt - monthlyExpenseAmt;                
                    expenseRecord.monthlyIncomeAmt = monthlyIncomeAmt.toFixed(2);                
                    expenseRecord.monthlyExpenseAmt = monthlyExpenseAmt.toFixed(2);
                    expenseRecord.netCashFlow = netCashFlow.toFixed(2); 
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
            $scope.item = '';
            $scope.expenseType = '';
            $scope.loadTables();            
        };

        $scope.setFixedExpense = function() {
            $scope.selectedExpense = $scope.fixedExpense;
            $scope.formRef = 'fixedExpense';
        };
        $scope.setTransportExpense = function() {
            $scope.selectedExpense = $scope.transportExpense;
            $scope.formRef = 'transport';
        };
        $scope.setUtilityExpense = function() {
            $scope.selectedExpense = $scope.utilityExpense;
            $scope.formRef = 'utility';
        };
        $scope.setFoodExpense = function() {
            $scope.selectedExpense = $scope.foodExpense;
            $scope.formRef = 'food';
        };
        $scope.setMiscExpense = function() {
            $scope.selectedExpense = $scope.miscExpense;            
            $scope.formRef = 'misc';
        };
     }

]);
'use strict';

// Articles controller
angular.module('financial').controller('DebtsController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Users', '$q', 'LiabilitiesService', 'IncomeExpenseService',
    function($scope, $rootScope, $stateParams, $location, Authentication, Users, $q, LiabilitiesService, IncomeExpenseService) {
        $scope.user = Authentication.user;

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');
        
        this.$setScope = function(context) {
            $scope = context;
        };

        $scope.add1show = true;
        $scope.add2show = false;

		$scope.mth = [];	
        $scope.mth[0] = 'January';
        $scope.mth[1] = 'February';
        $scope.mth[2] = 'March';
        $scope.mth[3] = 'April';
        $scope.mth[4] = 'May';
        $scope.mth[5] = 'June';
        $scope.mth[6] = 'July';
        $scope.mth[7] = 'August';
        $scope.mth[8] = 'September';
        $scope.mth[9] = 'October';
        $scope.mth[10] = 'November';
        $scope.mth[11] = 'December';

        //var dt = new Date('2015-10-01');
        var dt = new Date();
		var month = dt.getMonth();
		$scope.month = dt.getMonth();
        $scope.monthDisplay = $scope.mth[month];
        var year = dt.getFullYear();  
        $scope.year = dt.getFullYear();
        $scope.displayDate = $scope.mth[month]+', '+year;

        $scope.selectedYear = $scope.year;
        $scope.selectedMonth = $scope.mth[$scope.month];

        // When "Add New Debt" button is clicked
        $scope.displayIncomeExpenseRecords = angular.copy(IncomeExpenseService.incomeExpenseRecords);
        var displayLiabilitiesRecords = angular.copy(LiabilitiesService.liabilitiesRecords);
        var loanMortgageArr = displayLiabilitiesRecords.loansMortgages;
        $scope.liabilities = [];
        angular.forEach(loanMortgageArr, function(value, key){
            $scope.liabilities.push(value); 
        });

        
        $scope.$watch('selectedMonth', function() {
        	
        	$scope.selectedMonthNo = $scope.mth.indexOf($scope.selectedMonth);
        	setDebtRecord();
        	console.log($scope.selectedMonthNo);
        });
        $scope.$watch('selectedYear',function() {
        	setDebtRecord();
        });
		
		var setDebtRecord = function () {
			var debtRe = $scope.debt;
			
			//console.log(debtRe);
			var counterCheckAgn =0;
			if (typeof debtRe !== 'undefined') {
				for(var c=0; c<debtRe.records.length;c++) {
					var recordDebt = debtRe.records[c];
					if (recordDebt.year===$scope.selectedYear&&recordDebt.month===$scope.selectedMonthNo) {
						$scope.recordReq = recordDebt;
						counterCheckAgn++;
						console.log('exist?');
						$scope.noRecordsToDisplay = false;
						if ($scope.selectedYear===year&&$scope.selectedMonthNo===month) {
							$scope.presentMonthCheck = true;
							console.log('Tester');
						} else {
							$scope.presentMonthCheck = false;
						}
					}
				}
			} 
			if(counterCheckAgn===0){
				console.log('No Records');
				$scope.noRecordsToDisplay = true;
			}
		};
		
        
		
        $scope.updateRecordsForNewMonth = function () {        	

        	var needToUpdate = false;
        	//contribution status
        	for (var b = 0; b<$scope.user.debtsInfoArr.length; b++) {
        		var debtRe = $scope.user.debtsInfoArr[b];
        		debtRe.id = $scope.user.debtsInfoArr.indexOf(debtRe)+1;
        		if(debtRe.status==='In Progress') {    					    				
    			
	        		var counterCheck = 0;
	    			//debtRe.monthlyPayStatus = false;
	    			for(var c=0; c<debtRe.records.length;c++) {
	    				var recordDebt = debtRe.records[c];	    				
	    				if (recordDebt.year===year&&recordDebt.month===month) {
	    					console.log('enter or not?');
							counterCheck++;
	    				}
	    			}

	    			if(counterCheck===0) {
	    				needToUpdate = true;
	    				console.log('CREATING NEW RECORDS');
	    				var record = {
			        		month: month,
			        		year: year,
			        		loanBalance: debtRe.loanBalance,
			        		monthly: 0,
			        		monthlyPayStatus: false,
			        		repaymentNo: debtRe.repaymentNo
			        	};        
			        	        	
			        	debtRe.records.push(record);


	    				if (($scope.user.liabilitiesRecordsPeriod.maxMonth <= month && $scope.user.liabilitiesRecordsPeriod.maxYear <= year) || ($scope.user.liabilitiesRecordsPeriod.maxMonth > month && $scope.user.liabilitiesRecordsPeriod.maxYear < year)) {

			        		$scope.user.liabilitiesRecordsPeriod.maxMonth = month;
			                $scope.user.liabilitiesRecordsPeriod.maxYear = year;
			        	} 

		        	 	//Existing record but no record of that month
		                var existenceCheck = 0;
		                for (var j=0;j<$scope.user.liabilitiesRecords.length; j++) {   
		                    var recordChecker = $scope.user.liabilitiesRecords[j];                                                         
		                    if (recordChecker.month===month&&recordChecker.year===year) {
		                        existenceCheck++;
		                        console.log('2nd');
		                    }
		                }
		                if (existenceCheck===0) {
		                    displayLiabilitiesRecords.year = year;
		                    displayLiabilitiesRecords.month = month;                                
		                    $scope.user.liabilitiesRecords.push(displayLiabilitiesRecords);  
		                    console.log('3rd');
		                }
			            

						for(var i=0;i<$scope.user.liabilitiesRecords.length; i++) {            
			                var liabilityRecord = $scope.user.liabilitiesRecords[i];  

			            	if (liabilityRecord.month===month&&liabilityRecord.year===year) {
			            		var loansMortgagesRec = liabilityRecord.loansMortgages;

			            		//update new loan balance
			            		for (var get in loansMortgagesRec) {                        
			                        var obj = loansMortgagesRec[get];
			                        if(debtRe.type=== obj.description) {
			                        	obj.value += debtRe.loanBalance;
			                        	obj.minValue += debtRe.loanBalance;
			                        }
			                    }
			                	
			                	//update totals
			            	    var shortTermCreditArr = liabilityRecord.shortTermCredit;
				                var shortTermCreditTotal = 0;
				                for (var rt in shortTermCreditArr) {
				                    var obj1 = shortTermCreditArr[rt];
				                    shortTermCreditTotal += obj1.value;
				                }
				                
				                var loansMortgagesArr = liabilityRecord.loansMortgages;
				                var loansMortgagesTotal = 0;
				                for (var rt1 in loansMortgagesArr) {
				                    var obj2 = loansMortgagesArr[rt1];
				                    loansMortgagesTotal += obj2.value;
				                }
				                
				                var otherLiabilitiesArr = liabilityRecord.otherLiabilities;
				                var otherLiabilitiesTotal = 0;
				                for (var rt2 in otherLiabilitiesArr) {
				                    var obj3 = otherLiabilitiesArr[rt2];
				                    otherLiabilitiesTotal += obj3.value;
				                }
				                
				                var liabilitiesTotal = shortTermCreditTotal + loansMortgagesTotal + otherLiabilitiesTotal;

				                liabilityRecord.shortTermCreditAmt = shortTermCreditTotal.toFixed(2);
				                liabilityRecord.loansMortgagesAmt = loansMortgagesTotal.toFixed(2);
				                liabilityRecord.otherLiabilitiesAmt = otherLiabilitiesTotal.toFixed(2);
				                liabilityRecord.totalAmt = liabilitiesTotal.toFixed(2);
			            	}
			            }
	    			}
	    		}    			
        	}
        	console.log(needToUpdate);
        	if (needToUpdate) {
				var userNow = new Users($scope.user);
	            userNow.$update(function(response) {
	                $scope.success = true;
	                Authentication.user = response;
	                $scope.user = Authentication.user;
	            }, function(response) {
	                $scope.error = response.data.message;
	            });
	            console.log('logic works');
			}
        };
        $scope.updateRecordsForNewMonth();

        $scope.contributionModal = function (debt) {
        	$scope.debtDetails = true;
        	$scope.contributionConfirm = false;
        	$scope.success = false;
        	$scope.debt = debt;

        	var debtRe = $scope.debt;
			//console.log(debtRe);
			console.log($scope.selectedYear);
			console.log($scope.selectedMonth);
			for(var c=0; c<debtRe.records.length;c++) {
				var recordDebt = debtRe.records[c];
				if (recordDebt.year===$scope.selectedYear&&recordDebt.month===$scope.selectedMonthNo) {
					$scope.recordReq = recordDebt;
					console.log($scope.recordReq);
					$scope.noRecordsToDisplay = false;
					$scope.presentMonthCheck = true;
					
				}
			}
			       	        	
        };

        $scope.contribute = function() {
        	$scope.debtDetails = false;
        	$scope.contributionConfirm = true;         	
        };

        $scope.confirmContribute = function() {
        	
        	var expenseChecker;
        	if ($scope.debt.linkedStatus==='Yes') {
        		//Update LIABILITIES
	        	for(var j=0;j<$scope.user.liabilitiesRecords.length; j++) {            
	                var liabilityRecord = $scope.user.liabilitiesRecords[j];  

	            	if (liabilityRecord.month===month&&liabilityRecord.year===year) {
	            		var loansMortgagesRec = liabilityRecord.loansMortgages;

	            		//update new loan balance
	            		for (var get in loansMortgagesRec) {                        
	                        var obj = loansMortgagesRec[get];
	                        if($scope.debt.type=== obj.description) {
	                        	obj.value -= $scope.debt.monthly;
	                        	obj.minValue -= $scope.debt.monthly;
	                        }
	                    }
	                	
	                	//update totals
	            	    var shortTermCreditArr = liabilityRecord.shortTermCredit;
		                var shortTermCreditTotal = 0;
		                for (var rt in shortTermCreditArr) {
		                    var obj1 = shortTermCreditArr[rt];
		                    shortTermCreditTotal += obj1.value;
		                }
		                
		                var loansMortgagesArr = liabilityRecord.loansMortgages;
		                var loansMortgagesTotal = 0;
		                for (var rt1 in loansMortgagesArr) {
		                    var obj2 = loansMortgagesArr[rt1];
		                    loansMortgagesTotal += obj2.value;
		                }
		                
		                var otherLiabilitiesArr = liabilityRecord.otherLiabilities;
		                var otherLiabilitiesTotal = 0;
		                for (var rt2 in otherLiabilitiesArr) {
		                    var obj3 = otherLiabilitiesArr[rt2];
		                    otherLiabilitiesTotal += obj3.value;
		                }
		                
		                var liabilitiesTotal = shortTermCreditTotal + loansMortgagesTotal + otherLiabilitiesTotal;

		                liabilityRecord.shortTermCreditAmt = shortTermCreditTotal.toFixed(2);
		                liabilityRecord.loansMortgagesAmt = loansMortgagesTotal.toFixed(2);
		                liabilityRecord.otherLiabilitiesAmt = otherLiabilitiesTotal.toFixed(2);
		                liabilityRecord.totalAmt = liabilitiesTotal.toFixed(2);
	            	}
	            }

	            //Update INCOME&EXPENSE
	            if (!$scope.user.incomeExpenseRecordsPeriod) {
                	//If there is no existing record
	                console.log('do you enter?');
	                $scope.user.incomeExpenseRecordsPeriod = {};
	                $scope.user.incomeExpenseRecordsPeriod.minMonth = month;
	                $scope.user.incomeExpenseRecordsPeriod.minYear = year;
	                $scope.user.incomeExpenseRecordsPeriod.maxMonth = month;
	                $scope.user.incomeExpenseRecordsPeriod.maxYear = year;                

	            } else if (($scope.user.incomeExpenseRecordsPeriod.maxMonth <= month && $scope.user.incomeExpenseRecordsPeriod.maxYear <= year) || ($scope.user.incomeExpenseRecordsPeriod.maxMonth > month && $scope.user.incomeExpenseRecordsPeriod.maxYear < year)) {

	                console.log('do you enter2?');
	                //ASSUMING THAT THE USER NEVER INSERTS DATA FOR THE FUTURE (HE CANT POSSIBLY DO SO ALSO)
	                //SETS RECORDS MAX PERIOD TO PRESENT MONTH & YEAR
	                //I ALSO CURRENTLY DONT ALLOW USERS TO SET BUDGET FOR THE FUTURE (ONLY FOR PRESENT MONTH)
	                $scope.user.incomeExpenseRecordsPeriod.maxMonth = month;
	                $scope.user.incomeExpenseRecordsPeriod.maxYear = year;
	            }

	             
	            
	            if($scope.user.incomeExpenseRecords.length===0) { //in the event of an empty record (FIRSTTIME)                
	                console.log('1st');
	                $scope.displayIncomeExpenseRecords.year = year;
	                $scope.displayIncomeExpenseRecords.month = month;                                
	                $scope.user.incomeExpenseRecords.push($scope.displayIncomeExpenseRecords); 
	            } else { //Existing record but no record of that month
	                var existenceCheck = 0;
	                for (var k=0;k<$scope.user.incomeExpenseRecords.length; k++) {   
	                    var recordChecker = $scope.user.incomeExpenseRecords[k];                                                         
	                    if (recordChecker.month===month&&recordChecker.year===year) {
	                        existenceCheck++;
	                        console.log('2nd');
	                    }
	                }
	                if (existenceCheck===0) {
	                    $scope.displayIncomeExpenseRecords.year = year;
	                    $scope.displayIncomeExpenseRecords.month = month;                                
	                    $scope.user.incomeExpenseRecords.push($scope.displayIncomeExpenseRecords);  
	                    console.log('3rd');
	                }
	            }

	            for(var a=0;a<$scope.user.incomeExpenseRecords.length; a++) {            
	                var expenseRecord = $scope.user.incomeExpenseRecords[a];  

	                if (expenseRecord.month===month&&expenseRecord.year===year) {
	                    
	                    var thisMonthSpecExpense = {};
	                    console.log('DIE HERE');
	                    if($scope.debt.type!=='Car Loan') {                        
	                    	thisMonthSpecExpense = expenseRecord.monthlyExpense.fixedExpense;
	                   
		                    for (var get10 in thisMonthSpecExpense) {                        
		                        var obj10 = thisMonthSpecExpense[get10];
		                        if($scope.debt.type === 'Mortgage Loan' && obj10.description==='Mortgage Repayments') {        	
		                            console.log('SUCCESS');
		                            //need validation
		                            obj10.value += $scope.debt.monthly;	
		                            expenseChecker = obj10.description;                            
		                        } else if($scope.debt.type !== 'Mortgage Loan' && obj10.description==='Other Loan Repayments') {
		                        	obj10.value += $scope.debt.monthly;
		                        	expenseChecker = obj10.description;
	                    		}
	                    	}	

                    	} else {
	                        thisMonthSpecExpense = expenseRecord.monthlyExpense.transport;
	                        for (var get11 in thisMonthSpecExpense) {                        
		                        var obj11 = thisMonthSpecExpense[get11];
		                        if(obj11.description==='Car Loan Repayments') {        	
		                            console.log('SUCCESS');
		                            //need validation
		                            obj11.value += $scope.debt.monthly;
		                            expenseChecker = obj11.description;	                            
		                        } 
	                    	}
	                    }
                        var fixedExpenseArr = expenseRecord.monthlyExpense.fixedExpense;
		                var fixedExpenseTotal = 0;
		                for (var at in fixedExpenseArr) {
		                    var abj1 = fixedExpenseArr[at];
		                    fixedExpenseTotal += abj1.value;
		                }
		                expenseRecord.fixedExpenseAmt = fixedExpenseTotal.toFixed(2);

		                var transportArr = expenseRecord.monthlyExpense.transport;
		                var transportTotal = 0;
		                for (var at1 in transportArr) {
		                    var abj2 = transportArr[at1];
		                    transportTotal += abj2.value;
		                }
		                expenseRecord.transportAmt = transportTotal.toFixed(2);

		                var utilityHouseholdArr = expenseRecord.monthlyExpense.utilityHousehold;
		                var utilityHouseholdTotal = 0;
		                for (var at2 in utilityHouseholdArr) {
		                    var abj3 = utilityHouseholdArr[at2];
		                    utilityHouseholdTotal += abj3.value;
		                }
		                expenseRecord.utilityHouseholdAmt = utilityHouseholdTotal.toFixed(2);

		                var foodNecessitiesArr = expenseRecord.monthlyExpense.foodNecessities;
		                var foodNecessitiesTotal = 0;
		                for (var at3 in foodNecessitiesArr) {
		                    var abj4 = foodNecessitiesArr[at3];
		                    foodNecessitiesTotal += abj4.value;
		                }
		                expenseRecord.foodNecessitiesAmt = foodNecessitiesTotal.toFixed(2);

		                var miscArr = expenseRecord.monthlyExpense.misc;
		                var miscTotal = 0;
		                for (var at4 in miscArr) {
		                    var abj5 = miscArr[at4];
		                    miscTotal += abj5.value;
		                }
		                expenseRecord.miscAmt = miscTotal.toFixed(2);

		                var monthlyIncomeAmt = Number(expenseRecord.monthlyIncomeAmt);                
		                var monthlyExpenseAmt = fixedExpenseTotal + transportTotal + utilityHouseholdTotal + foodNecessitiesTotal + miscTotal;
		                var netCashFlow = monthlyIncomeAmt - monthlyExpenseAmt;                
		                expenseRecord.monthlyIncomeAmt = monthlyIncomeAmt.toFixed(2);                
		                expenseRecord.monthlyExpenseAmt = monthlyExpenseAmt.toFixed(2);
		                expenseRecord.netCashFlow = netCashFlow.toFixed(2);
                    
					}
				}      

			}

			for (var i = 0; i<$scope.user.debtsInfoArr.length; i++) {
        		var debtRe = $scope.user.debtsInfoArr[i];
        		if(debtRe.lender===$scope.debt.lender&&debtRe.amt===$scope.debt.amt) {
        			//part to change
        			debtRe.loanBalance -= debtRe.monthly;
        			debtRe.repaymentNo += 1;
        			//debtRe.monthlyPayStatus = true;
    				/*
        			var newRecord = {
        				month: month,
        				year: year,
        				monthly: debtRe.monthly,
        				loanBalance: debtRe.loanBalance,
        				expenseType: expenseChecker 
        			};
					*/
        			for(var c=0; c<debtRe.records.length;c++) {
    					var recordDebt = debtRe.records[c];
	    				if (recordDebt.year===year&&recordDebt.month===month) {
	    					console.log('Working so far');
	    					recordDebt.monthly = debtRe.monthly;
	    					recordDebt.expenseType = expenseChecker;
	    					recordDebt.loanBalance =debtRe.loanBalance;
	    					recordDebt.monthlyPayStatus = true;
	    					recordDebt.repaymentNo = debtRe.repaymentNo;
	    				}
    				} 
    				if(debtRe.loanBalance===0) {
    					debtRe.status = 'Completed';
    					debtRe.statusBoolean = true;
    				}
        			       	
        		}
        	}
        	$scope.debt.monthlyPayStatus = true;

			var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });

            $scope.contributionConfirm = false;
            $scope.success = true;
            $scope.debt = null;
        };

        $scope.addDebtOne = function () {
        	

        	$scope.loanBalance = ($scope.newDebt.monthly*$scope.newDebt.lenOfLoan) - ($scope.newDebt.monthly*$scope.newDebt.repaymentNo);
        	if ($scope.loanBalance<=0) {
        		$scope.loanBalance = 0;
        		alert('Check inputs again!');
        	}
        	else { 
	        	$scope.displayLoanBalance = $scope.loanBalance.toFixed(2);
	        	$scope.newDebt.loanBalance = $scope.loanBalance;
	        	console.log($scope.newDebt);
	        	$scope.add1show = false;
	        	$scope.add2show = true;
        	}
        };

        $scope.setNewLoanBalance = function() {
        	$scope.loanBalance = $scope.newLoanBalance;
			console.log('TESTER');
        	$scope.displayLoanBalance = $scope.loanBalance.toFixed(2);
	        $scope.newDebt.loanBalance = $scope.loanBalance;
        };

        $scope.createNoLinkedDebt = function() {
        	$scope.newDebt.linkedStatus = 'No';
        	//$scope.newDebt.monthlyPayStatus = false;
        	$scope.newDebt.status = 'In Progress';
        	$scope.newDebt.statusBoolean = false;
        	$scope.newDebt.id = $scope.user.debtsInfoArr.length + 1;
        	$scope.newDebt.creationRecord = {
        		month: month,
        		year: year,
        		loanBalance: $scope.newDebt.loanBalance,
        		repaymentNo: $scope.newDebt.repaymentNo
        	};
			$scope.newDebt.records = [];
			var record = {
        		month: month,
        		year: year,
        		loanBalance: $scope.newDebt.loanBalance,
        		monthly: 0,
        		monthlyPayStatus: false,
        		repaymentNo: $scope.newDebt.repaymentNo
        	};
        	$scope.newDebt.records.push(record);
        	$scope.user.debtsInfoArr.push($scope.newDebt);

        	var userNow = new Users($scope.user);
            userNow.$update(function(response) {
                $scope.success = true;
                Authentication.user = response;
                $scope.user = Authentication.user;
            }, function(response) {
                $scope.error = response.data.message;
            });
            $scope.add2show = false;
            $scope.add3show = true;
        };

        $scope.createLinkedDebt = function () {        
        	console.log($scope.newDebt.loanBalance);
        	$scope.newDebt.linkedStatus = 'Yes';
        	$scope.newDebt.status = 'In Progress';
        	$scope.newDebt.statusBoolean = false;
        	//$scope.newDebt.monthlyPayStatus = false;
        	$scope.newDebt.id = $scope.user.debtsInfoArr.length + 1;
        	$scope.newDebt.creationRecord = {
        		month: month,
        		year: year,
        		loanBalance: $scope.newDebt.loanBalance,
        		repaymentNo: $scope.newDebt.repaymentNo
        	};
        	$scope.newDebt.records = [];
        	
        	var record = {
        		month: month,
        		year: year,
        		loanBalance: $scope.newDebt.loanBalance,
        		monthly: 0,
        		monthlyPayStatus: false,
        		repaymentNo: $scope.newDebt.repaymentNo
        	};        
        	        	
        	$scope.newDebt.records.push(record);
        	
        	$scope.user.debtsInfoArr.push($scope.newDebt);

        	console.log(month);
        	console.log(year);
        	//creating new liabilities record period
        	if(!$scope.user.liabilitiesRecordsPeriod) {
        		$scope.user.liabilitiesRecordsPeriod = {};
        		$scope.user.liabilitiesRecordsPeriod.minMonth = month;
                $scope.user.liabilitiesRecordsPeriod.minYear = year;
                $scope.user.liabilitiesRecordsPeriod.maxMonth = month;
                $scope.user.liabilitiesRecordsPeriod.maxYear = year; 
        	}
        	else if (($scope.user.liabilitiesRecordsPeriod.maxMonth <= month && $scope.user.liabilitiesRecordsPeriod.maxYear <= year) || ($scope.user.liabilitiesRecordsPeriod.maxMonth > month && $scope.user.liabilitiesRecordsPeriod.maxYear < year)) {

        		$scope.user.liabilitiesRecordsPeriod.maxMonth = month;
                $scope.user.liabilitiesRecordsPeriod.maxYear = year;
        	} 

        	if($scope.user.liabilitiesRecords.length===0) { //in the event of an empty record (FIRSTTIME)                
                console.log('1st');
                displayLiabilitiesRecords.year = year;
                displayLiabilitiesRecords.month = month;                                                
                $scope.user.liabilitiesRecords.push(displayLiabilitiesRecords); 
            } else { //Existing record but no record of that month
                var existenceCheck = 0;
                for (var j=0;j<$scope.user.liabilitiesRecords.length; j++) {   
                    var recordChecker = $scope.user.liabilitiesRecords[j];                                                         
                    if (recordChecker.month===month&&recordChecker.year===year) {
                        existenceCheck++;
                        console.log('2nd');
                    }
                }
                if (existenceCheck===0) {
                    displayLiabilitiesRecords.year = year;
                    displayLiabilitiesRecords.month = month;                                
                    $scope.user.liabilitiesRecords.push(displayLiabilitiesRecords);  
                    console.log('3rd');
                }
            }

			for(var i=0;i<$scope.user.liabilitiesRecords.length; i++) {            
                var liabilityRecord = $scope.user.liabilitiesRecords[i];  

            	if (liabilityRecord.month===month&&liabilityRecord.year===year) {
            		var loansMortgagesRec = liabilityRecord.loansMortgages;

            		//update new loan balance
            		for (var get in loansMortgagesRec) {                        
                        var obj = loansMortgagesRec[get];
                        if($scope.newDebt.type=== obj.description) {
                        	obj.value += $scope.newDebt.loanBalance;
                        	obj.minValue += $scope.newDebt.loanBalance;
                        }
                    }
                	
                	//update totals
            	    var shortTermCreditArr = liabilityRecord.shortTermCredit;
	                var shortTermCreditTotal = 0;
	                for (var rt in shortTermCreditArr) {
	                    var obj1 = shortTermCreditArr[rt];
	                    shortTermCreditTotal += obj1.value;
	                }
	                
	                var loansMortgagesArr = liabilityRecord.loansMortgages;
	                var loansMortgagesTotal = 0;
	                for (var rt1 in loansMortgagesArr) {
	                    var obj2 = loansMortgagesArr[rt1];
	                    loansMortgagesTotal += obj2.value;
	                }
	                
	                var otherLiabilitiesArr = liabilityRecord.otherLiabilities;
	                var otherLiabilitiesTotal = 0;
	                for (var rt2 in otherLiabilitiesArr) {
	                    var obj3 = otherLiabilitiesArr[rt2];
	                    otherLiabilitiesTotal += obj3.value;
	                }
	                
	                var liabilitiesTotal = shortTermCreditTotal + loansMortgagesTotal + otherLiabilitiesTotal;

	                liabilityRecord.shortTermCreditAmt = shortTermCreditTotal.toFixed(2);
	                liabilityRecord.loansMortgagesAmt = loansMortgagesTotal.toFixed(2);
	                liabilityRecord.otherLiabilitiesAmt = otherLiabilitiesTotal.toFixed(2);
	                liabilityRecord.totalAmt = liabilitiesTotal.toFixed(2);
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
            $scope.add2show = false;
            $scope.add3show = true;
        };

        $scope.resetModal = function() {
        	$scope.add1show = true;
	        $scope.add2show = false;
	        $scope.add3show = false;
	        $scope.newDebt = null;
        };

        $scope.previousModal1 = function() {
        	$scope.add1show = true;
        	$scope.add2show = false;
        };

        $scope.selectDeleteRecord = function(debt) {
        	$scope.debt = debt;
        };

		$scope.deleteRecord = function() {
		 	
		 
		 	$scope.showAdd = false;
		  	var index = $scope.user.debtsInfoArr.indexOf($scope.debt);
		  	$scope.user.debtsInfoArr.splice(index, 1);

		  	for (var b = 0; b<$scope.user.debtsInfoArr.length; b++) {
        		var debtRe = $scope.user.debtsInfoArr[b];
        		debtRe.id = $scope.user.debtsInfoArr.indexOf(debtRe)+1;
        	}
        	
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

'use strict';

// Articles controller
angular.module('financial').controller('FinancesController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'LiabilitiesService', 'AssetsService', 'IncomeExpenseService','Users', '$q', 'FinancialHealthService',
	function($scope, $rootScope, $stateParams, $location, Authentication, LiabilitiesService, AssetsService, IncomeExpenseService,Users, $q, FinancialHealthService) {
		$scope.user = Authentication.user;
        //Check authentication
        if (!$scope.user) $location.path('/');


        $scope.displayHome = {};
        $scope.homeHealth = [{
            value: 100,
            type: 'info'
        }];
        $scope.homeHealthDisplay = false;

        //Set new record to N/A
        $scope.displayOverview ={};

        //1---Liquidity---
        //Liquidity Ratio
        $scope.displayOverview.ratioLiquidity = 'N/A';
        //Total Liquidity Ratio
        $scope.displayOverview.ratioTotalLiquidity = 'N/A';

        //2---Savings---
        //Surplus Income Ratio /Savings Ratio
        $scope.displayOverview.ratioSaving = 'N/A';
        //Basic Saving Ratio
        $scope.displayOverview.ratioBasicSaving = 'N/A';

        //3---Expenses---
        //Essential Expenses to Income Ratio
        $scope.displayOverview.ratioEssentialExpenses = 'N/A';
        //Lifestyle Expenses to Income Ratio
        $scope.displayOverview.ratioLifestyleExpenses = 'N/A';

        //4---Debt---
        //AssetDebt Ratio
        $scope.displayOverview.ratioAssetDebt = 'N/A';
        //DebtService Ratio
        $scope.displayOverview.ratioDebtService = 'N/A';
        //Housing Expense Ratio
        $scope.displayOverview.ratioHouseExpense = 'N/A';
        //Debt to Income Ratio
        $scope.displayOverview.ratioDebtIncome = 'N/A';
        //Consumer Debt Ratio
        $scope.displayOverview.ratioConsumerDebt = 'N/A';

        //5---Net Worth/ Others---
        //Net Worth Benchmark
        $scope.displayOverview.ratioNetWorthBenchmark = 'N/A';
        //Solvency Ratio
        $scope.displayOverview.ratioSolvency = 'N/A';

        //6---Asset vs Debts
        //Current Asset to Debt Ratio
        $scope.displayOverview.ratioCurrentAssetDebt = 'N/A';
        //Investment Ratio
        $scope.displayOverview.ratioInvestment = 'N/A';

        //Set Checkbox Ratio

        $scope.check = {
            ratio: 'liquidity'
        };
        // $scope.checkRatio.liquidity =true;

        //Set Checkbox Overview
        $scope.checkTotal = {};
        $scope.checkTotal.assets = true;
        $scope.checkTotal.liabilities = true;
        $scope.checkTotal.netGrossIncome = true;

        //Financial health ratio tips & Analysis from Financial Health Service
        $scope.tips = FinancialHealthService.tips;
        $scope.analysisRatio = FinancialHealthService.analysisRatio;


        //Set display analysis
        $scope.displayAnalysis = {};

        this.$setScope = function(context) {
            $scope = context;
        };
        //Questions
        $scope.oneAtATime = false;

        //--DATE Selected
        $scope.monthArr = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
            ];      
        var current = function() {
            $scope.dt = new Date();
            $scope.month = $scope.dt.getMonth();
            $scope.year = Number($scope.dt.getFullYear());
            $scope.monthDisplay = $scope.selectedMonth;
            console.log($scope.month);
            console.log($scope.year);

            $scope.selectedMonth = $scope.monthArr[$scope.month];
            console.log($scope.selectedMonth);
            $scope.selectedYear = $scope.year;
        };


        current();

        //Charts Variables display time period
        $scope.selectedChartOption = '0';

        //Ratio Arrays
        //1---Liquidity---
        //Liquidity Ratio
        var ratioLiquidityArr = [];
        var ratioIdealLiquidityMinArr = [];
        var ratioIdealLiquidityMaxArr = [];
        //Total Liquidity Ratio
        var ratioTotalLiquidityArr = [];
        var ratioIdealTotalLiquidityMinArr = [];
        var ratioIdealTotalLiquidityMaxArr = [];

        //2---Savings---
        //Surplus Income Ratio /Savings Ratio
        var ratioSavingArr = [];
        var ratioIdealSavingMinArr = [];
        var ratioIdealSavingMaxArr = [];
        //Basic Saving Ratio
        var ratioBasicSavingArr = [];
        var ratioIdealBasicSavingMinArr = [];
        var ratioIdealBasicSavingMaxArr = [];

        //3---Expenses---
        //Essential Expenses to Income Ratio
        var ratioEssentialExpensesArr = [];
        var ratioIdealEssentialExpensesMinArr = [];
        var ratioIdealEssentialExpensesMaxArr = [];
        //Lifestyle Expenses to Income Ratio
        var ratioLifestyleExpensesArr = [];
        var ratioIdealLifestyleExpensesMinArr = [];
        var ratioIdealLifestyleExpensesMaxArr = [];

        //4---Debt---
        //AssetDebt Ratio
        var ratioAssetDebtArr = [];
        var ratioIdealAssetDebtMinArr = [];
        var ratioIdealAssetDebtMaxArr = [];
        //DebtService Ratio
        var ratioDebtServiceArr = [];
        var ratioIdealDebtServiceMinArr = [];
        var ratioIdealDebtServiceMaxArr = [];
        //Housing Expense Ratio
        var ratioHouseExpenseArr = [];
        var ratioIdealHouseExpenseMinArr = [];
        var ratioIdealHouseExpenseMaxArr = [];
        //Debt to Income Ratio
        var ratioDebtIncomeArr = [];
        var ratioIdealDebtIncomeMinArr = [];
        var ratioIdealDebtIncomeMaxArr = [];
        //Consumer Debt Ratio
        var ratioConsumerDebtArr = [];
        var ratioIdealConsumerDebtMinArr = [];
        var ratioIdealConsumerDebtMaxArr = [];

        //5---Net Worth/ Others--- 
        //Net Worth Benchmark
        var ratioNetWorthBenchmarkArr = [];
        var ratioIdealNetWorthBenchmarkMinArr = [];
        var ratioIdealNetWorthBenchmarkMaxArr = [];
        //Solvency Ratio
        var ratioSolvencyArr = [];
        var ratioIdealSolvencyMinArr = [];
        var ratioIdealSolvencyMaxArr = [];

        //6---Asset vs Debts
        //Current Asset to Debt Ratio
        var ratioCurrentAssetDebtArr = [];
        var ratioIdealCurrentAssetDebtMinArr = [];
        var ratioIdealCurrentAssetDebtMaxArr = [];
        //Investment Ratio
        var ratioInvestmentArr = [];
        var ratioIdealInvestmentMinArr = [];
        var ratioIdealInvestmentMaxArr = [];

        //Change to reflect date change
        $scope.$watch('selectedMonth', function(){
            retrieveLatestRecords();

        });
        $scope.$watch('selectedYear', function(){
            retrieveLatestRecords();
        });

        var retrieveLatestRecords = function(){

            $scope.month = $scope.monthArr.indexOf($scope.selectedMonth);
            $scope.monthDisplay = $scope.selectedMonth;
            $scope.year = $scope.selectedYear;

            //Run Function to retrieve latest records
            $scope.displayAssetsRecords = retrieveAssetsRecord($scope.month, $scope.year);
            $scope.displayLiabilitiesRecords = retrieveLiabilitiesRecords($scope.month, $scope.year);
            $scope.displayIncomeExpenseRecords = retrieveIncomeExpenseRecords($scope.month, $scope.year);
            
            $scope.displayOverview.totalAssets = $scope.displayAssetsRecords.totalAmt;
            $scope.displayOverview.totalLiabilities = $scope.displayLiabilitiesRecords.totalAmt;
            $scope.displayOverview.totalNetGrossIncome = $scope.displayIncomeExpenseRecords.netCashFlow;
            $scope.displayOverview.monthlyIncome = $scope.displayIncomeExpenseRecords.monthlyIncomeAmt;
            $scope.displayOverview.monthlyExpense = $scope.displayIncomeExpenseRecords.monthlyExpenseAmt;   
            calculateRatios();

            $scope.$watch('selectedChartOption', function() {
                updateChart();
            });
        };
        
        $scope.r = function(){
            retrieveLatestRecords();
        };
        //Change time period of chart
        $scope.$watch('selectedChartOption', function() {
            updateChart();
        });

        //For Financial Health Page checkboxes
        $scope.$watch('check.ratio', function() {
            updateChart();
        });

        //For Overview Page Checkboxes
        $scope.$watch('checkTotal.assets', function() {
            updateChart();
        });
        $scope.$watch('checkTotal.liabilities', function() {
            updateChart();
        });
        $scope.$watch('checkTotal.netGrossIncome', function() {
            updateChart();
        });
        $scope.$watch('checkTotal.monthlyIncome', function() {
            updateChart();
        });
        $scope.$watch('checkTotal.monthlyExpense', function() {
            updateChart();
        });

        var updateChart = function(){
            var ratioMthArr =[];
            var ratioMthNum;
            var ratioMth = angular.copy($scope.month);
            var ratioYear = angular.copy($scope.year);

            var aRecords;
            var lRecords;
            var ieRecords;   

            var aRecordsTotalAmtArr = [];
            var lRecordsTotalAmtArr = [];
            var ieRecordsTotalAmtArr = []; 
            var ieRecordsIncomeArr = [];
            var ieRecordsExpenseArr = [];         

            //for past 3 mth
            if($scope.selectedChartOption === '0'){
                ratioMthNum = 2;
                for(ratioMthNum; ratioMthNum >=0; ratioMthNum--){
                    ratioMthArr[ratioMthNum] = $scope.monthArr[ratioMth];
                    aRecords = retrieveAssetsRecord(ratioMth, ratioYear);
                    lRecords = retrieveLiabilitiesRecords(ratioMth, ratioYear);
                    ieRecords = retrieveIncomeExpenseRecords(ratioMth, ratioYear);

                    try{
                        aRecordsTotalAmtArr[ratioMthNum] = aRecords.totalAmt;
                    }catch(e){
                        aRecordsTotalAmtArr[ratioMthNum] = 0;
                    }

                    try{
                        lRecordsTotalAmtArr[ratioMthNum] = lRecords.totalAmt; 
                    }catch (e){
                        lRecordsTotalAmtArr[ratioMthNum] = 0;
                    }

                    try{
                        ieRecordsTotalAmtArr[ratioMthNum] = ieRecords.netCashFlow;
                    }catch(e){
                        ieRecordsTotalAmtArr[ratioMthNum] = 0;
                    }
                    try{
                        ieRecordsIncomeArr[ratioMthNum] = ieRecords.monthlyIncomeAmt;
                    }catch(e){
                        ieRecordsIncomeArr[ratioMthNum] = 0;
                    }
                    try{
                        ieRecordsExpenseArr[ratioMthNum] = ieRecords.monthlyExpenseAmt;
                    }catch(e){
                        ieRecordsExpenseArr[ratioMthNum] = 0;
                    }

                    calculateRatiosChart(aRecords, lRecords, ieRecords, ratioMthNum);    

                    ratioMth--;
                    if(ratioMth < 0){
                        ratioMth = 11;
                        ratioYear--;
                    }
        
                }
            //for past 6 mths   
            }else if($scope.selectedChartOption === '1'){
                ratioMthNum = 5;
                for(ratioMthNum; ratioMthNum >=0; ratioMthNum--){
                    ratioMthArr[ratioMthNum] = $scope.monthArr[ratioMth];
                    aRecords = retrieveAssetsRecord(ratioMth, ratioYear);
                    lRecords = retrieveLiabilitiesRecords(ratioMth, ratioYear);
                    ieRecords = retrieveIncomeExpenseRecords(ratioMth, ratioYear);

                    try{
                        aRecordsTotalAmtArr[ratioMthNum] = aRecords.totalAmt;
                    }catch(e){
                        aRecordsTotalAmtArr[ratioMthNum] = 0;
                    }

                    try{
                        lRecordsTotalAmtArr[ratioMthNum] = lRecords.totalAmt; 
                    }catch(e){
                        lRecordsTotalAmtArr[ratioMthNum] = 0;
                    }
                    
                    try{
                        ieRecordsTotalAmtArr[ratioMthNum] = ieRecords.netCashFlow;
                    }catch(e){
                        ieRecordsTotalAmtArr[ratioMthNum] = 0;
                    } 
                    try{
                        ieRecordsIncomeArr[ratioMthNum] = ieRecords.monthlyIncomeAmt;
                    }catch(e){
                        ieRecordsIncomeArr[ratioMthNum] = 0;
                    }
                    try{
                        ieRecordsExpenseArr[ratioMthNum] = ieRecords.monthlyExpenseAmt;
                    }catch(e){
                        ieRecordsExpenseArr[ratioMthNum] = 0;
                    }
                    calculateRatiosChart(aRecords, lRecords, ieRecords, ratioMthNum);   

                    ratioMth--;
                    if(ratioMth < 0){
                        ratioMth = 11;
                        ratioYear--;
                    }

                }
            //for past 12 mths
            }else if($scope.selectedChartOption === '2'){
                ratioMthNum = 11;
                for(ratioMthNum; ratioMthNum >=0; ratioMthNum--){
                    ratioMthArr[ratioMthNum] = $scope.monthArr[ratioMth];
                    aRecords = retrieveAssetsRecord(ratioMth, ratioYear);
                    lRecords = retrieveLiabilitiesRecords(ratioMth, ratioYear);
                    ieRecords = retrieveIncomeExpenseRecords(ratioMth, ratioYear);

                    try{
                        aRecordsTotalAmtArr[ratioMthNum] = aRecords.totalAmt;
                    }catch(e){
                        aRecordsTotalAmtArr[ratioMthNum] = 0;
                    }

                    try{
                        lRecordsTotalAmtArr[ratioMthNum] = lRecords.totalAmt; 
                    }catch(e){
                        lRecordsTotalAmtArr[ratioMthNum] = 0;
                    }
                    
                    try{
                        ieRecordsTotalAmtArr[ratioMthNum] = ieRecords.netCashFlow;
                    }catch(e){
                        ieRecordsTotalAmtArr[ratioMthNum] = 0;
                    }  
                    try{
                        ieRecordsIncomeArr[ratioMthNum] = ieRecords.monthlyIncomeAmt;
                    }catch(e){
                        ieRecordsIncomeArr[ratioMthNum] = 0;
                    }
                    try{
                        ieRecordsExpenseArr[ratioMthNum] = ieRecords.monthlyExpenseAmt;
                    }catch(e){
                        ieRecordsExpenseArr[ratioMthNum] = 0;
                    }
                    calculateRatiosChart(aRecords, lRecords, ieRecords, ratioMthNum);  

                    ratioMth--;
                    if(ratioMth < 0){
                        ratioMth = 11;
                        ratioYear--;
                    }

                }
            }

            //Add to ratio
            $scope.labels = ratioMthArr;
            $scope.series = [];
            $scope.data = [];    

            //1 Liquidity Ratio
            //Liquidity Ratio
            if($scope.check.ratio === 'liquidity'){
                $scope.series.push('Min Ideal Ratio', 'Max Ideal Ratio', 'Current Liquidity Ratio');
                $scope.data.push(ratioIdealLiquidityMinArr, ratioIdealLiquidityMaxArr, ratioLiquidityArr);
            }
            //Total Liquidity Ratio
            if($scope.check.ratio === 'totalLiquidity'){
                $scope.series.push('Min Ideal Ratio', 'Total Liquidity Ratio');
                $scope.data.push(ratioIdealTotalLiquidityMinArr, ratioTotalLiquidityArr);
            }
            //2 Savings Ratio
            //Surplus Income Ratio /Savings Ratio
            if($scope.check.ratio === 'saving'){
                $scope.series.push('Min Ideal Ratio', 'Max Ideal Ratio','Surplus Income Ratio');
                $scope.data.push(ratioIdealSavingMinArr, ratioIdealSavingMaxArr,ratioSavingArr);
            }
            //Basic Saving Ratio
            if($scope.check.ratio === 'basicSaving'){
                $scope.series.push('Min Ideal Ratio', 'Basic Saving Ratio');
                $scope.data.push(ratioIdealBasicSavingMinArr, ratioBasicSavingArr);
            }

            //3 Expenses Ratio
            //Essential Expenses to Income Ratio
            if($scope.check.ratio === 'essentialExpenses'){
                $scope.series.push('Max Ideal Ratio','Essential Expenses to Income Ratio');
                $scope.data.push(ratioIdealEssentialExpensesMaxArr, ratioEssentialExpensesArr);
            }
            //Lifestyle Expenses to Income Ratio
            if($scope.check.ratio === 'lifestyleExpenses'){
                $scope.series.push('Max Ideal Ratio','Lifestyle Expenses to Income Ratio');
                $scope.data.push(ratioIdealLifestyleExpensesMaxArr, ratioLifestyleExpensesArr);
            }

            //4 Debt Ratios
            //AssetDebt Ratio
            if($scope.check.ratio === 'assetDebt'){
                $scope.series.push('Min Ideal Ratio', 'Max Ideal Ratio','Total Debt to Annual Income Ratio');
                $scope.data.push(ratioIdealAssetDebtMinArr, ratioIdealAssetDebtMaxArr,ratioAssetDebtArr);
            }
            //DebtService Ratio
            if($scope.check.ratio === 'debtService'){
                $scope.series.push('Min Ideal Ratio', 'Max Ideal Ratio','Current Debt to Annual Income Ratio');
                $scope.data.push(ratioIdealDebtServiceMinArr, ratioIdealDebtServiceMaxArr,ratioDebtServiceArr);
            }
            //Housing Expense Ratio
            if($scope.check.ratio === 'houseExpense'){
                $scope.series.push('Min Ideal Ratio', 'Max Ideal Ratio','Property Debt to Total Income Ratio');
                $scope.data.push(ratioIdealHouseExpenseMinArr, ratioIdealHouseExpenseMaxArr,ratioHouseExpenseArr);
            }
            //Debt to Income Ratio
            if($scope.check.ratio === 'debtIncome'){
                $scope.series.push('Min Ideal Ratio', 'Max Ideal Ratio','Monthly Debt Servicing to Income Ratio');
                $scope.data.push(ratioIdealDebtIncomeMinArr, ratioIdealDebtIncomeMaxArr,ratioDebtIncomeArr);
            }
            //Consumer Debt Ratio
            if($scope.check.ratio === 'consumerDebt'){
                $scope.series.push('Min Ideal Ratio', 'Max Ideal Ratio','Monthly Credit Card Debt to Income Ratio');
                $scope.data.push(ratioIdealConsumerDebtMinArr, ratioIdealConsumerDebtMaxArr,ratioConsumerDebtArr);
            }

            //5 Net Worth and Other Ratio
            //Net Worth Benchmark
            if($scope.check.ratio === 'netWorthBenchmark'){
                $scope.series.push('Min Ideal Ratio', 'Net Worth Benchmark');
                $scope.data.push(ratioIdealNetWorthBenchmarkMinArr, ratioNetWorthBenchmarkArr);
            }
            //Solvency Ratio
            if($scope.check.ratio === 'solvency'){
                $scope.series.push('Min Ideal Ratio','Solvency Ratio');
                $scope.data.push(ratioIdealSolvencyMinArr, ratioSolvencyArr);
            }

            //6 Asset vs Debt Ratio
            //Current Asset to Debt Ratio
            if($scope.check.ratio === 'currentAssetDebt'){
                $scope.series.push('Min Ideal Ratio', 'Current Asset to Debt Ratio');
                $scope.data.push(ratioIdealCurrentAssetDebtMinArr, ratioCurrentAssetDebtArr);
            }
            //Investment Ratio
            if($scope.check.ratio === 'investment'){
                $scope.series.push('Min Ideal Ratio', 'Investment Assets to Total Assets Ratio');
                $scope.data.push(ratioIdealInvestmentMinArr, ratioInvestmentArr);
            }


            //Add to overview
            $scope.labelsOverview = ratioMthArr;
            $scope.seriesOverview = [];
            $scope.dataOverview = []; 

            if($scope.checkTotal.assets){
                $scope.seriesOverview.push('Assets');
                $scope.dataOverview.push(aRecordsTotalAmtArr);
            }
            if($scope.checkTotal.liabilities){
                $scope.seriesOverview.push('Liabilities');
                $scope.dataOverview.push(lRecordsTotalAmtArr);
            }
            if($scope.checkTotal.monthlyIncome){
                $scope.seriesOverview.push('Monthly Income');
                $scope.dataOverview.push(ieRecordsIncomeArr);
            }
            if($scope.checkTotal.monthlyExpense){
                $scope.seriesOverview.push('Monthly Expense');
                $scope.dataOverview.push(ieRecordsExpenseArr);
            }
            if($scope.checkTotal.netGrossIncome){
                $scope.seriesOverview.push('Net Gross Income');
                $scope.dataOverview.push(ieRecordsTotalAmtArr);
            }
        };
        
        var retrieveAssetsRecord = function(month, year){
            var displayAssetsRecords;
            if (!$scope.user.assetsRecordsPeriod || ($scope.user.assetsRecordsPeriod.minMonth > month && $scope.user.assetsRecordsPeriod.minYear >= year) || ( $scope.user.assetsRecordsPeriod.minYear > year)) {

                    displayAssetsRecords = AssetsService.assetsRecords;
                    displayAssetsRecords.year = angular.copy(year);
                    displayAssetsRecords.month = angular.copy(month);


            } else {

                if ($scope.user.assetsRecordsPeriod.minMonth === $scope.user.assetsRecordsPeriod.maxMonth && $scope.user.assetsRecordsPeriod.minYear === $scope.user.assetsRecordsPeriod.maxYear) {
                    displayAssetsRecords = angular.copy($scope.user.assetsRecords[0]);
                } else {
                    // IF there is multiple record

                    //TO review
                    var targetAssetsYear;
                    var targetAssetsMonth;
                    var minimumAssetsYear = $scope.user.assetsRecordsPeriod.minYear;
                    var minimumAssetsMonth = $scope.user.assetsRecordsPeriod.minMonth;
                    var maximumAssetsYear = $scope.user.assetsRecordsPeriod.maxYear;
                    var maximumAssetsMonth = $scope.user.assetsRecordsPeriod.maxMonth;

                    var latestAssetsYear = minimumAssetsYear;
                    var latestAssetsMonth = minimumAssetsMonth;
                    var latestAssetsRecord;

                    if (year > maximumAssetsYear || year === maximumAssetsYear && month >= maximumAssetsMonth) {
                        //Date after max
                        targetAssetsYear = maximumAssetsYear;
                        targetAssetsMonth = maximumAssetsMonth;
                        for (var rA1 in $scope.user.assetsRecords) {
                            if ($scope.user.assetsRecords[rA1].year === targetAssetsYear && $scope.user.assetsRecords[rA1].month === targetAssetsMonth) {
                                latestAssetsRecord = angular.copy($scope.user.assetsRecords[rA1]);
                            }
                        }
                    } else {
                        //Date in between
                        targetAssetsYear = year;
                        targetAssetsMonth = month;
                        for (var rA2 in $scope.user.assetsRecords) {
                            if ($scope.user.assetsRecords[rA2].year < targetAssetsYear || $scope.user.assetsRecords[rA2].year === targetAssetsYear && $scope.user.assetsRecords[rA2].month <= targetAssetsMonth) {
                                if ($scope.user.assetsRecords[rA2].year === latestAssetsYear && $scope.user.assetsRecords[rA2].month >= latestAssetsMonth) {
                                    latestAssetsRecord = angular.copy($scope.user.assetsRecords[rA2]);
                                    latestAssetsMonth = angular.copy($scope.user.assetsRecords[rA2].month);
                                } else if ($scope.user.assetsRecords[rA2].year > latestAssetsYear) {
                                    latestAssetsRecord = angular.copy($scope.user.assetsRecords[rA2]);
                                    latestAssetsMonth = angular.copy($scope.user.assetsRecords[rA2].month);
                                    latestAssetsYear = angular.copy($scope.user.assetsRecords[rA2].year);
                                }
                            }
                        }
                    }
                    displayAssetsRecords = latestAssetsRecord;
                }
            }
            return displayAssetsRecords;
        };

        var retrieveLiabilitiesRecords = function(month, year){
            var displayLiabilitiesRecords; 
            if (!$scope.user.liabilitiesRecordsPeriod || ($scope.user.liabilitiesRecordsPeriod.minMonth > month && $scope.user.liabilitiesRecordsPeriod.minYear >= year) || ( $scope.user.liabilitiesRecordsPeriod.minYear > year)) {

                displayLiabilitiesRecords = LiabilitiesService.liabilitiesRecords;
                displayLiabilitiesRecords.year = angular.copy(year);
                displayLiabilitiesRecords.month = angular.copy(month);

            } else {

                if ($scope.user.liabilitiesRecordsPeriod.minMonth === $scope.user.liabilitiesRecordsPeriod.maxMonth && $scope.user.liabilitiesRecordsPeriod.minYear === $scope.user.liabilitiesRecordsPeriod.maxYear) {
                    displayLiabilitiesRecords = angular.copy($scope.user.liabilitiesRecords[0]);
                } else {
                    // IF there is multiple record
                    //TO review
                    var targetLiabilitiesYear;
                    var targetLiabilitiesMonth;
                    var minimumLiabilitiesYear = $scope.user.liabilitiesRecordsPeriod.minYear;
                    var minimumLiabilitiesMonth = $scope.user.liabilitiesRecordsPeriod.minMonth;
                    var maximumLiabilitiesYear = $scope.user.liabilitiesRecordsPeriod.maxYear;
                    var maximumLiabilitiesMonth = $scope.user.liabilitiesRecordsPeriod.maxMonth;

                    var latestLiabilitiesYear = minimumLiabilitiesYear;
                    var latestLiabilitiesMonth = minimumLiabilitiesMonth;
                    var latestLiabilitiesRecord;

                    if (year > maximumLiabilitiesYear || year === maximumLiabilitiesYear && month >= maximumLiabilitiesMonth) {
                        //Date after max
                        targetLiabilitiesYear = maximumLiabilitiesYear;
                        targetLiabilitiesMonth = maximumLiabilitiesMonth;
                        for (var rL1 in $scope.user.liabilitiesRecords) {
                            if ($scope.user.liabilitiesRecords[rL1].year === targetLiabilitiesYear && $scope.user.liabilitiesRecords[rL1].month === targetLiabilitiesMonth) {
                                latestLiabilitiesRecord = angular.copy($scope.user.liabilitiesRecords[rL1]);
                            }
                        }
                    } else {
                        //Date in between
                        targetLiabilitiesYear = year;
                        targetLiabilitiesMonth = month;
                        for (var rL2 in $scope.user.liabilitiesRecords) {
                            if ($scope.user.liabilitiesRecords[rL2].year < targetLiabilitiesYear || $scope.user.liabilitiesRecords[rL2].year === targetLiabilitiesYear && $scope.user.liabilitiesRecords[rL2].month <= targetLiabilitiesMonth) {
                                if ($scope.user.liabilitiesRecords[rL2].year === latestLiabilitiesYear && $scope.user.liabilitiesRecords[rL2].month >= latestLiabilitiesMonth) {
                                    latestLiabilitiesRecord = angular.copy($scope.user.liabilitiesRecords[rL2]);
                                    latestLiabilitiesMonth = angular.copy($scope.user.liabilitiesRecords[rL2].month);
                                } else if ($scope.user.liabilitiesRecords[rL2].year > latestLiabilitiesYear) {
                                    latestLiabilitiesRecord = angular.copy($scope.user.liabilitiesRecords[rL2]);
                                    latestLiabilitiesMonth = angular.copy($scope.user.liabilitiesRecords[rL2].month);
                                    latestLiabilitiesYear = angular.copy($scope.user.liabilitiesRecords[rL2].year);
                                }
                            }
                        }
                    }
                    displayLiabilitiesRecords = latestLiabilitiesRecord;
                }
            }
            return displayLiabilitiesRecords;
        };

        var retrieveIncomeExpenseRecords = function(month, year){
            var displayIncomeExpenseRecords;
            if (!$scope.user.incomeExpenseRecordsPeriod || ($scope.user.incomeExpenseRecordsPeriod.minMonth > month && $scope.user.incomeExpenseRecordsPeriod.minYear >= year) || ($scope.user.incomeExpenseRecordsPeriod.minYear > year)) {

                displayIncomeExpenseRecords = IncomeExpenseService.incomeExpenseRecords;
                displayIncomeExpenseRecords.year = angular.copy(year);
                displayIncomeExpenseRecords.month = angular.copy(month);

            } else {

                if ($scope.user.incomeExpenseRecordsPeriod.minMonth === $scope.user.incomeExpenseRecordsPeriod.maxMonth && $scope.user.incomeExpenseRecordsPeriod.minYear === $scope.user.incomeExpenseRecordsPeriod.maxYear) {
                    displayIncomeExpenseRecords = angular.copy($scope.user.incomeExpenseRecords[0]);
                } else {
                    // IF there is multiple record

                    //TO review
                    var targetIEYear;
                    var targetIEMonth;
                    var minimumIEYear = $scope.user.incomeExpenseRecordsPeriod.minYear;
                    var minimumIEMonth = $scope.user.incomeExpenseRecordsPeriod.minMonth;
                    var maximumIEYear = $scope.user.incomeExpenseRecordsPeriod.maxYear;
                    var maximumIEMonth = $scope.user.incomeExpenseRecordsPeriod.maxMonth;

                    var latestIEYear = minimumIEYear;
                    var latestIEMonth = minimumIEMonth;
                    var latestIERecord;

                    if (year > maximumIEYear || year === maximumIEYear && month >= maximumIEMonth) {
                        //Date after max
                        targetIEYear = maximumIEYear;
                        targetIEMonth = maximumIEMonth;
                        for (var rIE1 in $scope.user.incomeExpenseRecords) {
                            if ($scope.user.incomeExpenseRecords[rIE1].year === targetIEYear && $scope.user.incomeExpenseRecords[rIE1].month === targetIEMonth) {
                                latestIERecord = angular.copy($scope.user.incomeExpenseRecords[rIE1]);
                            }
                        }
                    } else {
                        //Date in between
                        targetIEYear = year;
                        targetIEMonth = month;
                        for (var rIE2 in $scope.user.incomeExpenseRecords) {
                            if ($scope.user.incomeExpenseRecords[rIE2].year < targetIEYear || $scope.user.incomeExpenseRecords[rIE2].year === targetIEYear && $scope.user.incomeExpenseRecords[rIE2].month <= targetIEMonth) {
                                if ($scope.user.incomeExpenseRecords[rIE2].year === latestIEYear && $scope.user.incomeExpenseRecords[rIE2].month >= latestIEMonth) {
                                    latestIERecord = angular.copy($scope.user.incomeExpenseRecords[rIE2]);
                                    latestIEMonth = angular.copy($scope.user.incomeExpenseRecords[rIE2].month);
                                } else if ($scope.user.incomeExpenseRecords[rIE2].year > latestIEYear) {
                                    latestIERecord = angular.copy($scope.user.incomeExpenseRecords[rIE2]);
                                    latestIEMonth = angular.copy($scope.user.incomeExpenseRecords[rIE2].month);
                                    latestIEYear = angular.copy($scope.user.incomeExpenseRecords[rIE2].year);
                                }
                            }
                        }
                    }
                    displayIncomeExpenseRecords = latestIERecord;
                }
            }
            return displayIncomeExpenseRecords;
        };

        //for Current display
        var calculateRatios = function(){
            var numHealthyRatio = 0;
            var numUnHealthyRatio = 0;
            $scope.homeHealthyRatioArr = [];
            $scope.homeUnHealthyRatioArr = [];

            //Ratio Formula time
            //1) Liquidity Ratio
            //Current Liquidity 
            var ratioLiquidity = angular.copy($scope.displayAssetsRecords.cashEquivalentsAmt) / angular.copy($scope.displayIncomeExpenseRecords.monthlyExpenseAmt);
            //Total Liquidity 
            var ratioTotalLiquidity = ($scope.displayAssetsRecords.cashEquivalentsAmt + $scope.displayAssetsRecords.investedAssetsAmt) / $scope.displayIncomeExpenseRecords.monthlyExpenseAmt;

            //2) Savings
            //Surplus Income Ratio /Savings Ratio //To review -- disposable income / monthly gross income
            var ratioSaving = $scope.displayIncomeExpenseRecords.monthlyIncomeAmt / $scope.displayIncomeExpenseRecords.netCashFlow;
            //Basic Saving Ratio   
            var ratioBasicSaving = $scope.displayIncomeExpenseRecords.optionalSavingsAmt / $scope.displayIncomeExpenseRecords.monthlyIncomeAmt;

            //3) Expenses Ratio
            //Essential Expenses to Income Ratio
            var ratioEssentialExpenses;
            var publicTransportValue;
            try{
                publicTransportValue = $scope.displayIncomeExpenseRecords.monthlyExpense.transport.publicTransport.value;
            }catch(e){
                publicTransportValue = 0;
            }
            ratioEssentialExpenses = ($scope.displayIncomeExpenseRecords.fixedExpenseAmt + publicTransportValue + $scope.displayIncomeExpenseRecords.utilityHouseholdAmt + $scope.displayIncomeExpenseRecords.foodNecessitiesAmt)/ $scope.displayIncomeExpenseRecords.monthlyIncomeAmt;

            //Lifestyle Expenses to Income Ratio
            var ratioLifestyleExpenses;
            var maidValue;

            try{
                maidValue = $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense.maid.value;
            }catch(e){
                maidValue = 0;
            }
            ratioLifestyleExpenses = (maidValue + $scope.displayIncomeExpenseRecords.transportAmt - publicTransportValue + $scope.displayIncomeExpenseRecords.miscAmt) / $scope.displayIncomeExpenseRecords.monthlyIncomeAmt;

            //4 Debt Ratio
            //Assets to Debt Ratio
            var ratioAssetDebt = $scope.displayLiabilitiesRecords.totalAmt / $scope.displayAssetsRecords.totalAmt;
            //Debt Service Ratio
            var ratioDebtService = $scope.displayLiabilitiesRecords.totalAmt / $scope.displayIncomeExpenseRecords.monthlyIncomeAmt;
            //Housing Expense Ratio
            var ratioHouseExpense = ($scope.displayIncomeExpenseRecords.monthlyExpenseAmt - $scope.displayIncomeExpenseRecords.fixedExpenseAmt) / $scope.displayIncomeExpenseRecords.netCashFlow;  
            //Debt Income Ratio
            var ratioDebtIncome;
            var mortgageRepaymentsValue;
            var rentalRepaymentsValue;
            var carLoanRepaymentValue;
            var otherLoanRepaymentsValue;

            try {
                mortgageRepaymentsValue = $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense.mortgageRepayments.value;
            }catch (e){
                mortgageRepaymentsValue = 0;
            }
            try{
                rentalRepaymentsValue = $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense.rentalRepaymentsValue.value;
            }catch(e){
                rentalRepaymentsValue = 0;
            }
            try{
                carLoanRepaymentValue = $scope.displayIncomeExpenseRecords.monthlyExpense.transport.carLoanRepayment.value;
            }catch (e) {
                carLoanRepaymentValue = 0;
            }
            try{
                otherLoanRepaymentsValue = $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense.otherLoanRepayments.value;
            }catch(e){
                otherLoanRepaymentsValue = 0;
            }

            ratioDebtIncome = (mortgageRepaymentsValue + rentalRepaymentsValue + carLoanRepaymentValue + otherLoanRepaymentsValue) / $scope.displayIncomeExpenseRecords.netCashFlow;
            // if ($scope.displayIncomeExpenseRecords.monthlyExpense && $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense && $scope.displayIncomeExpenseRecords.monthlyExpense.transport && $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense.mortgageRepayments && $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense.rentalRepayments && $scope.displayIncomeExpenseRecords.monthlyExpense.transport.carLoanRepayment && $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense.otherLoanRepayments){
            //     ratioDebtIncome = ($scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense.mortgageRepayments.value + $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense.rentalRepayments.value + $scope.displayIncomeExpenseRecords.monthlyExpense.transport.carLoanRepayment.value + $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense.otherLoanRepayments.value)  /  $scope.displayIncomeExpenseRecords.netCashFlow;
            // }
            
            //Consumer Debt Ratio
            var ratioConsumerDebt = $scope.displayLiabilitiesRecords.shortTermCreditAmt / $scope.displayIncomeExpenseRecords.netCashFlow;

            //5 Net Worth 
            //Net WorthBenchmark Ratio
            var ratioNetWorthBenchmark = ($scope.displayAssetsRecords.totalAmt - $scope.displayLiabilitiesRecords.totalAmt) / ($scope.user.age  * $scope.displayIncomeExpenseRecords.monthlyIncomeAmt * 12 / 10);

            //Solvency Ratio
            var ratioSolvency = ($scope.displayAssetsRecords.totalAmt - $scope.displayLiabilitiesRecords.totalAmt) / $scope.displayAssetsRecords.totalAmt;

            //6 Asset vs Debt
            //Current Asset to Debt Ratio
            var ratioCurrentAssetDebt = $scope.displayAssetsRecords.cashEquivalentsAmt / $scope.displayLiabilitiesRecords.shortTermCreditAmt;

            //Investment Ratio
            var ratioInvestment;
            var privatePropertiesValue;
            try{
                privatePropertiesValue = $scope.displayAssetsRecords.investedAssets.privateProperties.value;
            }catch(e){
                privatePropertiesValue = 0;
            }      
            ratioInvestment = ($scope.displayAssetsRecords.cashEquivalentsAmt + $scope.displayAssetsRecords.investedAssetsAmt - privatePropertiesValue) / $scope.displayAssetsRecords.totalAmt;    
            // if($scope.displayAssetsRecords.investedAssets && $scope.displayAssetsRecords.investedAssets.privateProperties){
            //     ratioInvestment = ($scope.displayAssetsRecords.cashEquivalentsAmt + $scope.displayAssetsRecords.investedAssetsAmt - $scope.displayAssetsRecords.investedAssets.privateProperties.value) / $scope.displayAssetsRecords.totalAmt;
            // }



            //Assign Ratio to Scope
            //1) Liquidity Ratio
            //Current Liquidity 
            if(isFinite(ratioLiquidity)) {
                $scope.displayOverview.ratioLiquidity = ratioLiquidity.toFixed(2);
            }else {
                $scope.displayOverview.ratioLiquidity = 'N/A';
            }
            //Total Liquidity 
            if(isFinite(ratioTotalLiquidity)){
                $scope.displayOverview.ratioTotalLiquidity = ratioTotalLiquidity.toFixed(2);
            }else{
                $scope.displayOverview.ratioTotalLiquidity = 'N/A';
            }

            //2) Savings
            //Surplus Income Ratio /Savings Ratio
            if(isFinite(ratioSaving)) {
                $scope.displayOverview.ratioSaving = ratioSaving.toFixed(2);
            }else{
                $scope.displayOverview.ratioSaving = 'N/A';
            }
            //Basic Saving Ratio 
            if(isFinite(ratioBasicSaving)){
                $scope.displayOverview.ratioBasicSaving = ratioBasicSaving.toFixed(2);
            }else{
                $scope.displayOverview.ratioBasicSaving = 'N/A';
            }

            //3) Expenses Ratio
            //Essential Expenses to Income Ratio
            if(isFinite(ratioEssentialExpenses)){
                $scope.displayOverview.ratioEssentialExpenses = ratioEssentialExpenses.toFixed(2);
            }else{
                $scope.displayOverview.ratioEssentialExpenses = 'N/A';
            }
            //Lifestyle Expenses to Income Ratio
            if(isFinite(ratioLifestyleExpenses)){
                $scope.displayOverview.ratioLifestyleExpenses = ratioLifestyleExpenses.toFixed(2);
            }else{
                $scope.displayOverview.ratioLifestyleExpenses = 'N/A';
            }


            //4) Debt Ratio
            //Assets to Debt Ratio
            if(isFinite(ratioAssetDebt)) {
                $scope.displayOverview.ratioAssetDebt = ratioAssetDebt.toFixed(2);
            }else {
                $scope.displayOverview.ratioAssetDebt = 'N/A';
            }
            //Debt Service Ratio
            if(isFinite(ratioDebtService)) {
                $scope.displayOverview.ratioDebtService = ratioDebtService.toFixed(2);
            }else {
                $scope.displayOverview.ratioDebtService ='N/A';
            }
            //Housing Expense Ratio
            if(isFinite(ratioHouseExpense)) {
                $scope.displayOverview.ratioHouseExpense = ratioHouseExpense.toFixed(2);
            } else {
                $scope.displayOverview.ratioHouseExpense = 'N/A';
            }
            //Debt Income Ratio
            if(isFinite(ratioDebtIncome)) {
                $scope.displayOverview.ratioDebtIncome = ratioDebtIncome.toFixed(2);
            }else{
                $scope.displayOverview.ratioDebtIncome = 'N/A';
            }
            //Consumer Debt Ratio
            if(isFinite(ratioConsumerDebt)) {
                $scope.displayOverview.ratioConsumerDebt = ratioConsumerDebt.toFixed(2);
            }else{
                $scope.displayOverview.ratioConsumerDebt = 'N/A';
            }
            //5 Net Worth 
            //Net WorthBenchmark Ratio
            if(isFinite(ratioNetWorthBenchmark)) {
                $scope.displayOverview.ratioNetWorthBenchmark = ratioNetWorthBenchmark.toFixed(2);
            } else {
                $scope.displayOverview.ratioNetWorthBenchmark = 'N/A';
            }
            //Solvency Ratio
            if(isFinite(ratioSolvency)) {
                $scope.displayOverview.ratioSolvency = ratioSolvency.toFixed(2);
            }else{
                $scope.displayOverview.ratioSolvency = 'N/A';
            }

            //6 Asset vs Debt
            //Current Asset to Debt Ratio
            if(isFinite(ratioCurrentAssetDebt)){
                $scope.displayOverview.ratioCurrentAssetDebt = ratioCurrentAssetDebt.toFixed(2);
            }else{
                $scope.displayOverview.ratioCurrentAssetDebt = 'N/A';
            }
            //Investment Ratio
            if(isFinite(ratioInvestment)) {
                $scope.displayOverview.ratioInvestment = ratioInvestment.toFixed(2);
            }else{
                $scope.displayOverview.ratioInvestment = 'N/A';
            }

            
            //Set analysis for each ratio
            //1) Liquidity Ratio
            //Current Liquidity 
            if($scope.displayOverview.ratioLiquidity !== 'N/A'){
                if($scope.displayOverview.ratioLiquidity < 2){
                    $scope.displayAnalysis.liquidity = $scope.analysisRatio.analysisLiquidity.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Current Liquidity Ratio');
                    $scope.liquidityHealth = 2;
                }else if ($scope.displayOverview.ratioLiquidity >=2 && $scope.displayOverview.ratioLiquidity < 6){
                    $scope.displayAnalysis.liquidity = $scope.analysisRatio.analysisLiquidity.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Current Liquidity Ratio');
                    $scope.liquidityHealth = 1;
                }else if ($scope.displayOverview.ratioLiquidity >=6){
                    $scope.displayAnalysis.liquidity = $scope.analysisRatio.analysisLiquidity.healthy[1];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Current Liquidity Ratio');
                    $scope.liquidityHealth = 1;
                }
            }else{
                $scope.displayAnalysis.liquidity = 'Unable to generate ratio due to missing inputs';
                $scope.liquidityHealth = 0;
            }
            //Total Liquidity 
            if($scope.displayOverview.ratioTotalLiquidity !== 'N/A'){
                if($scope.displayOverview.ratioTotalLiquidity < 6 ){
                    $scope.displayAnalysis.totalLiquidity = $scope.analysisRatio.analysisTotalLiquidity.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Total Liquidity Ratio');
                    $scope.totalLiquidityHealth = 2;
                }else if($scope.displayOverview.ratioTotalLiquidity >=6){
                    $scope.displayAnalysis.totalLiquidity = $scope.analysisRatio.analysisTotalLiquidity.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Total Liquidity Ratio');
                    $scope.totalLiquidityHealth = 1;
                }
            }else{
                $scope.displayAnalysis.totalLiquidity = 'Unable to generate ratio due to missing inputs';
                $scope.totalLiquidityHealth = 0;
            }

            //2) Savings
            //Surplus Income Ratio /Savings Ratio
            if($scope.displayOverview.ratioSaving !== 'N/A'){
                if($scope.displayOverview.ratioSaving <0.12){
                    $scope.displayAnalysis.saving = $scope.analysisRatio.analysisSaving.unhealthy[0];
                    numUnHealthyRatio++; 
                    $scope.homeUnHealthyRatioArr.push('Surplus Income Ratio');
                    $scope.savingHealth = 2;
                }else if($scope.displayOverview.ratioSaving >=0.12 && $scope.displayOverview.ratioSaving <=0.7){
                    $scope.displayAnalysis.saving = $scope.analysisRatio.analysisSaving.healthy[1];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Surplus Income Ratio');
                    $scope.savingHealth = 1;
                }else if($scope.displayOverview.ratioSaving > 0.7){
                    $scope.displayAnalysis.saving = $scope.analysisRatio.analysisSaving.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Surplus Income Ratio');
                    $scope.savingHealth = 1;
                }
            }else{
                $scope.displayAnalysis.saving = 'Unable to generate ratio due to missing inputs';
                $scope.savingHealth = 0;
            }
            //Basic Saving Ratio 
            if($scope.displayOverview.ratioBasicSaving !== 'N/A'){
                if($scope.displayOverview.ratioBasicSaving < 0.1){
                    $scope.displayAnalysis.basicSaving = $scope.analysisRatio.analysisBasicSaving.unhealthy[0];
                    numUnHealthyRatio++; 
                    $scope.homeUnHealthyRatioArr.push('Basic Saving Ratio');
                    $scope.basicSavingHealth = 2;
                }else if($scope.displayOverview.ratioBasicSaving >= 0.1){
                    $scope.displayAnalysis.basicSaving = $scope.analysisRatio.analysisBasicSaving.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Basic Saving Ratio');
                    $scope.basicSavingHealth = 1;
                }
            }else{
                $scope.displayAnalysis.basicSaving = 'Unable to generate ratio due to missing inputs';
                $scope.basicSavingHealth = 0;
            }

            //3) Expenses Ratio
            //Essential Expenses to Income Ratio
            if($scope.displayOverview.ratioEssentialExpenses !== 'N/A'){
                if($scope.displayOverview.ratioEssentialExpenses >=0.5){
                    $scope.displayAnalysis.essentialExpenses = $scope.analysisRatio.analysisEssentialExpenses.unhealthy[0];
                    numUnHealthyRatio++; 
                    $scope.homeUnHealthyRatioArr.push('Essential Expenses to Income Ratio');
                    $scope.essentialExpensesHealth = 2;
                }else if($scope.displayOverview.ratioEssentialExpenses <0.5){
                    $scope.displayAnalysis.essentialExpenses = $scope.analysisRatio.analysisEssentialExpenses.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Essential Expenses to Income Ratio');
                    $scope.essentialExpensesHealth = 1;
                }
            }else{
                $scope.displayAnalysis.essentialExpenses = 'Unable to generate ratio due to missing inputs';
                $scope.essentialExpensesHealth = 0;
            }
            //Lifestyle Expenses to Income Ratio
            if($scope.displayOverview.ratioLifestyleExpenses !== 'N/A'){
                if($scope.displayOverview.ratioLifestyleExpenses >=0.3){
                    $scope.displayAnalysis.lifestyleExpenses = $scope.analysisRatio.analysisLifestyleExpenses.unhealthy[0];
                    numUnHealthyRatio++; 
                    $scope.homeUnHealthyRatioArr.push('Lifestyle Expenses to Income Ratio');
                    $scope.lifestyleExpensesHealth = 2;
                }else if($scope.displayOverview.ratioLifestyleExpenses <0.3){
                    $scope.displayAnalysis.lifestyleExpenses = $scope.analysisRatio.analysisLifestyleExpenses.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Lifestyle Expenses to Income Ratio');
                    $scope.lifestyleExpensesHealth = 1;
                }
            }else{
                $scope.displayAnalysis.lifestyleExpenses = 'Unable to generate ratio due to missing inputs';
                $scope.lifestyleExpensesHealth = 0;
            }

            //4) Debt Ratio
            //Assets to Debt Ratio
            if($scope.displayOverview.ratioAssetDebt !== 'N/A'){
                if($scope.displayOverview.ratioAssetDebt < 0.4){
                    $scope.displayAnalysis.assetDebt = $scope.analysisRatio.analysisAssetDebt.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Total Debt to Annual Income Ratio');
                    $scope.assetDebtHealth = 1;
                }else if($scope.displayOverview.ratioAssetDebt >=0.4 && $scope.displayOverview.ratioAssetDebt < 0.6){
                    $scope.displayAnalysis.assetDebt = $scope.analysisRatio.analysisAssetDebt.healthy[1];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Total Debt to Annual Income Ratio');
                    $scope.assetDebtHealth = 1;
                }else if($scope.displayOverview.ratioAssetDebt >=0.6){
                    $scope.displayAnalysis.assetDebt = $scope.analysisRatio.analysisAssetDebt.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Total Debt to Annual Income Ratio');
                    $scope.assetDebtHealth = 2;
                }
            }else{
                $scope.displayAnalysis.assetDebt = 'Unable to generate ratio due to missing inputs';
                $scope.assetDebtHealth = 0;
            }
            //Debt Service Ratio
            if($scope.displayOverview.ratioDebtService !== 'N/A'){
                if($scope.displayOverview.ratioDebtService <=0.36){
                    $scope.displayAnalysis.debtService = $scope.analysisRatio.analysisDebtService.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Current Debt to Annual Income Ratio');
                    $scope.debtServiceHealth = 1;
                }else if($scope.displayOverview.ratioDebtService > 0.36){
                    $scope.displayAnalysis.debtService = $scope.analysisRatio.analysisDebtService.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Current Debt to Annual Income Ratio');
                    $scope.debtServiceHealth = 2;
                }
            }else{
                $scope.displayAnalysis.debtService = 'Unable to generate ratio due to missing inputs';
                $scope.debtServiceHealth = 0;
            }
            //Housing Expense Ratio
            if($scope.displayOverview.ratioHouseExpense !== 'N/A'){
                if($scope.displayOverview.ratioHouseExpense <=0.35){
                    $scope.displayAnalysis.houseExpense = $scope.analysisRatio.analysisHouseExpense.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Property Debt to Total Income Ratio');
                    $scope.houseExpenseHealth = 1;
                }else if($scope.displayOverview.ratioHouseExpense > 0.35){
                    $scope.displayAnalysis.houseExpense = $scope.analysisRatio.analysisHouseExpense.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Property Debt to Total Income Ratio');
                    $scope.houseExpenseHealth = 2;
                }
            }else{
                $scope.displayAnalysis.houseExpense = 'Unable to generate ratio due to missing inputs';
                $scope.houseExpenseHealth = 0;
            }
            //Debt Income Ratio
            if($scope.displayOverview.ratioDebtIncome !== 'N/A'){
                if($scope.displayOverview.ratioDebtIncome <=0.4){
                    $scope.displayAnalysis.debtIncome = $scope.analysisRatio.analysisDebtIncome.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Monthly Debt Servicing to Income Ratio');
                    $scope.debtIncomeHealth = 1;
                }else if($scope.displayOverview.ratioDebtIncome > 0.4){
                    $scope.displayAnalysis.debtIncome = $scope.analysisRatio.analysisDebtIncome.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Monthly Debt Servicing to Income Ratio');
                    $scope.debtIncomeHealth = 2;
                }
            }else{
                $scope.displayAnalysis.debtIncome = 'Unable to generate ratio due to missing inputs';
                $scope.debtIncomeHealth = 0;
            }            
            //Consumer Debt Ratio
            if($scope.displayOverview.ratioConsumerDebt !== 'N/A'){
                if($scope.displayOverview.ratioConsumerDebt <=0.1){
                    $scope.displayAnalysis.consumerDebt = $scope.analysisRatio.analysisConsumerDebt.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Monthly Credit Card Debt to Income Ratio');
                    $scope.consumerDebtHealth = 1;
                }else if($scope.displayOverview.ratioConsumerDebt > 0.1){
                    $scope.displayAnalysis.consumerDebt = $scope.analysisRatio.analysisConsumerDebt.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Monthly Credit Card Debt to Income Ratio');
                    $scope.consumerDebtHealth = 2;
                }
            }else{
                $scope.displayAnalysis.consumerDebt = 'Unable to generate ratio due to missing inputs';
                $scope.consumerDebtHealth = 0;
            } 
            //5 Net Worth 
            //Net WorthBenchmark Ratio
            if($scope.displayOverview.ratioNetWorthBenchmark !== 'N/A'){
                if($scope.displayOverview.ratioNetWorthBenchmark <=0.75){
                    $scope.displayAnalysis.netWorthBenchmark = $scope.analysisRatio.analysisNetWorthBenchmark.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Net Worth Benchmark');
                    $scope.netWorthHealth = 2;
                }else if($scope.displayOverview.ratioNetWorthBenchmark >0.75 && $scope.displayOverview.ratioNetWorthBenchmark <=1){
                    $scope.displayAnalysis.netWorthBenchmark = $scope.analysisRatio.analysisNetWorthBenchmark.healthy[1];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Net Worth Benchmark');
                    $scope.netWorthHealth = 1;
                }else if($scope.displayOverview.ratioNetWorthBenchmark > 1){
                    $scope.displayAnalysis.netWorthBenchmark = $scope.analysisRatio.analysisNetWorthBenchmark.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Net Worth Benchmark');
                    $scope.netWorthHealth = 1;
                }
            }else{
                $scope.displayAnalysis.netWorthBenchmark = 'Unable to generate ratio due to missing inputs';
                $scope.netWorthHealth = 0;
            }
            //Solvency Ratio
            if($scope.displayOverview.ratioSolvency !== 'N/A'){
                if($scope.displayOverview.ratioSolvency <=0.2){
                    $scope.displayAnalysis.solvency = $scope.analysisRatio.analysisSolvency.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Solvency Ratio');
                    $scope.solvencyHealth = 2;
                }else if($scope.displayOverview.ratioSolvency > 0.2){
                    $scope.displayAnalysis.solvency = $scope.analysisRatio.analysisSolvency.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Solvency Ratio');
                    $scope.solvencyHealth = 1;
                }
            }else{
                $scope.displayAnalysis.solvency = 'Unable to generate ratio due to missing inputs';
                $scope.solvencyHealth = 0;
            } 
            //6 Asset vs Debt
            //Current Asset to Debt Ratio
            if($scope.displayOverview.ratioCurrentAssetDebt !== 'N/A'){
                if($scope.displayOverview.ratioCurrentAssetDebt <=0.2){
                    $scope.displayAnalysis.currentAssetDebt = $scope.analysisRatio.analysisCurrentAssetDebt.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Current Asset to Debt Ratio');
                    $scope.currentAssetDebtHealth = 2;
                }else if($scope.displayOverview.ratioInvestment > 0.2){
                    $scope.displayAnalysis.currentAssetDebt = $scope.analysisRatio.analysisCurrentAssetDebt.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Current Asset to Debt Ratio');
                    $scope.currentAssetDebtHealth = 1;
                }
            }else{
                $scope.displayAnalysis.currentAssetDebt = 'Unable to generate ratio due to missing inputs';
                $scope.currentAssetDebtHealth = 0;
            } 

            //Investment Ratio
            if($scope.displayOverview.ratioInvestment !== 'N/A'){
                if($scope.displayOverview.ratioInvestment <=0.2){
                    $scope.displayAnalysis.investment = $scope.analysisRatio.analysisInvestment.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Investment Assets to Total Assets Ratio');
                    $scope.investmentHealth = 2;
                }else if($scope.displayOverview.ratioInvestment > 0.2){
                    $scope.displayAnalysis.investment = $scope.analysisRatio.analysisInvestment.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Investment Assets to Total Assets Ratio');
                    $scope.investmentHealth = 1;
                }
            }else{
                $scope.displayAnalysis.investment = 'Unable to generate ratio due to missing inputs';
                $scope.investmentHealth = 0;
            } 

            //Render ratio to home page
            

            $scope.homeHealthDisplay = true;
            $scope.homeHealth = [{value: (numHealthyRatio*100/15), type: 'success'}, {value: (numUnHealthyRatio*100/15), type:'danger'}];
            if($scope.homeHealth[0].value === 0 && $scope.homeHealth[1].value === 0){
                $scope.homeHealth = [{
                    value: 100,
                    type: 'info'
                }];
                $scope.homeHealthDisplay = false;
            }
        };

        //for chart display
        var calculateRatiosChart = function(aRecords, lRecords, ieRecords, ratioMthNum){
            aRecords = aRecords;
            lRecords = lRecords;
            ieRecords = ieRecords;
            
            //Ratio Formula time
            //---Liquidity---
            //Current Liquidity 
            var ratioLiquidityChart = aRecords.cashEquivalentsAmt / ieRecords.monthlyExpenseAmt;
            //Total Liquidity Ratio
            var ratioTotalLiquidityChart = (aRecords.cashEquivalentsAmt + aRecords.investedAssetsAmt) / ieRecords.monthlyExpenseAmt;

            //---Savings---
            //Surplus Income Ratio /Savings Ratio
            var ratioSavingChart = ieRecords.monthlyIncomeAmt / ieRecords.netCashFlow;
            //Basic Saving Ratio
            var ratioBasicSavingChart = ieRecords.optionalSavingsAmt / ieRecords.monthlyIncomeAmt;

            //--- Expenses Ratio
            //Essential Expenses to Income Ratio
            var ratioEssentialExpensesChart;
            var publicTransportChartValue;
            try{
                publicTransportChartValue = ieRecords.monthlyExpense.transport.publicTransport.value;
            }catch(e){
                publicTransportChartValue = 0;
            }
            ratioEssentialExpensesChart = (ieRecords.fixedExpenseAmt + publicTransportChartValue + ieRecords.utilityHouseholdAmt + ieRecords.foodNecessitiesAmt)/ ieRecords.monthlyIncomeAmt;
            //Lifestyle Expenses to Income Ratio
            var ratioLifestyleExpensesChart;
            var maidChartValue;
            try{
                maidChartValue = ieRecords.monthlyExpense.fixedExpense.maid.value;
            }catch(e){
                maidChartValue = 0;
            }
            ratioLifestyleExpensesChart = (maidChartValue + ieRecords.transportAmt - publicTransportChartValue + ieRecords.miscAmt) / ieRecords.monthlyIncomeAmt;

            //---Debt---
            //AssetDebt Ratio
            var ratioAssetDebtChart = lRecords.totalAmt/ aRecords.totalAmt;
            //Debt Service Ratio // To check short term
            var ratioDebtServiceChart = lRecords.totalAmt / ieRecords.monthlyIncomeAmt;
            //Housing Expense Ratio
            var ratioHouseExpenseChart = (ieRecords.monthlyExpenseAmt - ieRecords.fixedExpenseAmt) / ieRecords.netCashFlow; 
            //Debt Income Ratio
            var ratioDebtIncomeChart;
            var mortgageRepaymentsChartValue;
            var rentalRepaymentsChartValue;
            var carLoanRepaymentChartValue;
            var otherLoanRepaymentsChartValue;
            try{
                mortgageRepaymentsChartValue = ieRecords.monthlyExpense.fixedExpense.mortgageRepayments.value;
            }catch(e){
                mortgageRepaymentsChartValue = 0;
            }
            try{
                rentalRepaymentsChartValue = ieRecords.monthlyExpense.fixedExpense.rentalRepayments.value;
            } catch(e) {
                rentalRepaymentsChartValue = 0;
            }
            try{
                carLoanRepaymentChartValue = ieRecords.monthlyExpense.transport.carLoanRepayment.value;
            }catch(e){
                carLoanRepaymentChartValue = 0;
            }
            try{
                otherLoanRepaymentsChartValue = ieRecords.monthlyExpense.fixedExpense.otherLoanRepayments.value;
            }catch(e){
                otherLoanRepaymentsChartValue = 0;
            }
            ratioDebtIncomeChart = (mortgageRepaymentsChartValue + rentalRepaymentsChartValue + carLoanRepaymentChartValue + otherLoanRepaymentsChartValue) / ieRecords.netCashFlow;
            // if(ieRecords.monthlyExpense && ieRecords.monthlyExpense.fixedExpense && ieRecords.monthlyExpense.transport && ieRecords.monthlyExpense.fixedExpense.mortgageRepayments && ieRecords.monthlyExpense.fixedExpense.rentalRepayments && ieRecords.monthlyExpense.transport.carLoanRepayment && ieRecords.monthlyExpense.fixedExpense.otherLoanRepayments){
            //     ratioDebtIncomeChart = (ieRecords.monthlyExpense.fixedExpense.mortgageRepayments.value + ieRecords.monthlyExpense.fixedExpense.rentalRepayments.value + ieRecords.monthlyExpense.transport.carLoanRepayment.value + ieRecords.monthlyExpense.fixedExpense.otherLoanRepayments.value)  /  ieRecords.netCashFlow;
            // }
            //Consumer Debt Ratio
            var ratioConsumerDebtChart = lRecords.shortTermCreditAmt / ieRecords.netCashFlow;

            //---Net Worth/ Others---
            //Net Worth Benchmark        
            var ratioNetWorthBenchmarkChart = (aRecords.totalAmt - lRecords.totalAmt) / ($scope.user.age  * ieRecords.monthlyIncomeAmt * 12 / 10);
            //Solvency Ratio
            var ratioSolvencyChart = (aRecords.totalAmt - lRecords.totalAmt) / aRecords.totalAmt;

            //---Asset vs Debts
            //Current Asset to Debt Ratio   
            var ratioCurrentAssetDebtChart = aRecords.cashEquivalentsAmt / lRecords.shortTermCreditAmt;
            //Investment Ratio
            var ratioInvestmentChart;
            var privatePropertiesChartValue;
            try{
                privatePropertiesChartValue = aRecords.investedAssets.privateProperties.value;
            }catch(e){
                privatePropertiesChartValue = 0;
            }      
            ratioInvestmentChart = (aRecords.cashEquivalentsAmt + aRecords.investedAssetsAmt - privatePropertiesChartValue) / aRecords.totalAmt; 
            // if(aRecords.investedAssets && aRecords.investedAssets.privateProperties){
            //     ratioDebtIncomeChart = (aRecords.cashEquivalentsAmt + aRecords.investedAssetsAmt - aRecords.investedAssets.privateProperties.value) / aRecords.totalAmt;
            // }
            

            //Assign Ratio to Scope
            //---Liquidity---
            //Current Liquidity 
            if(isFinite(ratioLiquidityChart)) {
                ratioLiquidityArr[ratioMthNum] = Number(ratioLiquidityChart.toFixed(2));
            } else{
                ratioLiquidityArr[ratioMthNum] = 0;
            }
            ratioIdealLiquidityMinArr[ratioMthNum] = 2;
            ratioIdealLiquidityMaxArr[ratioMthNum] = 6;
            //Total Liquidity Ratio
            if(isFinite(ratioTotalLiquidityChart)){
                ratioTotalLiquidityArr[ratioMthNum] = Number(ratioTotalLiquidityChart.toFixed(2));
            }else{
                ratioTotalLiquidityArr[ratioMthNum] = 0;
            }
            ratioIdealTotalLiquidityMinArr[ratioMthNum] = 6;

            //---Savings---
            //Surplus Income Ratio /Savings Ratio
            if(isFinite(ratioSavingChart)) {
                ratioSavingArr[ratioMthNum] = Number(ratioSavingChart.toFixed(2));
            } else{
                ratioSavingArr[ratioMthNum] = 0;
            }
            ratioIdealSavingMinArr[ratioMthNum] = 0.12;
            ratioIdealSavingMaxArr[ratioMthNum] = 0.7;
            //Basic Saving Ratio
            if(isFinite(ratioBasicSavingChart)){
                ratioBasicSavingArr[ratioMthNum] = Number(ratioBasicSavingChart.toFixed(2));
            }else{
                ratioBasicSavingArr[ratioMthNum] = 0;
            }
            ratioIdealBasicSavingMinArr = 0.1;

            //--- Expenses Ratio
            //Essential Expenses to Income Ratio
            if(isFinite(ratioEssentialExpensesChart)){
                ratioEssentialExpensesArr[ratioMthNum] = Number(ratioEssentialExpensesChart.toFixed(2));
            }else{
                ratioEssentialExpensesArr[ratioMthNum] = 0;
            }
            ratioIdealEssentialExpensesMaxArr = 0.5;
            //Lifestyle Expenses to Income Ratio
            if(isFinite(ratioLifestyleExpensesChart)){
                ratioLifestyleExpensesArr[ratioMthNum] = Number(ratioLifestyleExpensesChart.toFixed(2));
            }else{
                ratioLifestyleExpensesArr[ratioMthNum] = 0;
            }
            ratioIdealLifestyleExpensesMaxArr = 0.5;

            //---Debt---
            //AssetDebt Ratio
            if(isFinite(ratioAssetDebtChart)) {
                ratioAssetDebtArr[ratioMthNum] = Number(ratioAssetDebtChart.toFixed(2));
            } else{
                ratioAssetDebtArr[ratioMthNum] = 0; 
            }
            ratioIdealAssetDebtMinArr[ratioMthNum] = 0;
            ratioIdealAssetDebtMaxArr[ratioMthNum] = 0.3;
            //Debt Service Ratio
            if(isFinite(ratioDebtServiceChart)) {
                ratioDebtServiceArr[ratioMthNum] = Number(ratioDebtServiceChart.toFixed(2));
            } else {
                ratioDebtServiceArr[ratioMthNum] = 0;

            }
            ratioIdealDebtServiceMinArr[ratioMthNum] = 0;
            ratioIdealDebtServiceMaxArr[ratioMthNum] = 0.36;            
            //Housing Expense Ratio
            if(isFinite(ratioHouseExpenseChart)) {
                ratioHouseExpenseArr[ratioMthNum] = Number(ratioHouseExpenseChart.toFixed(2));
            } else{
                ratioHouseExpenseArr[ratioMthNum] = 0;
            }
            ratioIdealHouseExpenseMinArr[ratioMthNum] = 0;
            ratioIdealHouseExpenseMaxArr[ratioMthNum] = 0.35;
            //Debt Income Ratio
            if(isFinite(ratioDebtIncomeChart)) {
                ratioDebtIncomeArr[ratioMthNum] = Number(ratioDebtIncomeChart.toFixed(2));
            } else {
                ratioDebtIncomeArr[ratioMthNum] = 0;
            }
            ratioIdealDebtIncomeMinArr[ratioMthNum] = 0;
            ratioIdealDebtIncomeMaxArr[ratioMthNum] = 0.4;
            //Consumer Debt Ratio
            if(isFinite(ratioConsumerDebtChart)) {
                ratioConsumerDebtArr[ratioMthNum] = Number(ratioConsumerDebtChart.toFixed(2));
            }else {
                ratioConsumerDebtArr[ratioMthNum] = 0;
            }
            ratioIdealConsumerDebtMinArr[ratioMthNum] = 0;
            ratioIdealConsumerDebtMaxArr[ratioMthNum] = 0.1;   

            //---Net Worth/ Others---
            //Net Worth Benchmark    
            if(isFinite(ratioNetWorthBenchmarkChart)) {
                ratioNetWorthBenchmarkArr[ratioMthNum] = Number(ratioNetWorthBenchmarkChart.toFixed(2));
            }else {
                ratioNetWorthBenchmarkArr[ratioMthNum] = 0;    
            }
            ratioIdealNetWorthBenchmarkMinArr[ratioMthNum] = 0.75;
            //Solvency Ratio
            if(isFinite(ratioSolvencyChart)) {
                ratioSolvencyArr[ratioMthNum] = Number(ratioSolvencyChart.toFixed(2));
            } else {
                ratioSolvencyArr[ratioMthNum] = 0;   
            }
            ratioIdealSolvencyMinArr[ratioMthNum] = 0.2;

            //---Asset vs Debts
            //Current Asset to Debt Ratio  
            if(isFinite(ratioCurrentAssetDebtChart)) {
                ratioCurrentAssetDebtArr[ratioMthNum] = Number(ratioCurrentAssetDebtChart.toFixed(2));
            } else{
                ratioCurrentAssetDebtArr[ratioMthNum] = 0;           
            }
            ratioIdealCurrentAssetDebtMinArr[ratioMthNum] = 0.1;            
            //Investment Ratio
            if(isFinite(ratioInvestmentChart)) {
                ratioInvestmentArr[ratioMthNum] = Number(ratioInvestmentChart.toFixed(2));
            } else{
                ratioInvestmentArr[ratioMthNum] = 0;           
            }
            ratioIdealInvestmentMinArr[ratioMthNum] = 0.2;

        };
        console.log($scope.homeHealth);
	}
]);
'use strict';

// Articles controller
angular.module('financial').controller('IncomeExpenseController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'IncomeExpenseService', 'Users', '$q',
	function($scope, $rootScope, $stateParams, $location, Authentication, IncomeExpenseService, Users, $q) {
		$scope.user = Authentication.user;
        //Check for authentication
        if (!$scope.user) $location.path('/');
        
		this.$setScope = function(context) {
            $scope = context;
        };
        //Questions
        $scope.oneAtATime = false;

        //Chart Settings
        $scope.incomeExpenseChartDisplay = true;
        $scope.incomeDoughnutData = [1]; 
        $scope.expenseDoughnutLabels = ['No Data'];
        $scope.expenseDoughnutData = [1]; 
        $scope.incomeDoughnutLabels = ['No Data'];

        //--DATE Selected
        var current = function() {
            $scope.dt = new Date();
            $scope.month = $scope.dt.getMonth();
            $scope.year = Number($scope.dt.getFullYear());
            $scope.monthDisplay = $scope.selectedMonth;
            console.log($scope.month);
            console.log($scope.year);        
        };

        current();
        $scope.monthArr = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
            ];

        var retrieveRecord = function() {
            $scope.month = $scope.monthArr.indexOf($scope.selectedMonth);
            $scope.monthDisplay = $scope.selectedMonth;
            $scope.year = $scope.selectedYear;

            if ($scope.success || $scope.error) {
                $scope.success = false;
                $scope.error = false;
            }
            $scope.$watch('user', function() {
                reloadData();
            });
        };


        var reloadData = function() {
                if (!$scope.user.incomeExpenseRecordsPeriod || ($scope.user.incomeExpenseRecordsPeriod.minMonth > $scope.month && $scope.user.incomeExpenseRecordsPeriod.minYear >= $scope.year) || ( $scope.user.incomeExpenseRecordsPeriod.minYear > $scope.year)) {
                	$scope.displayIncomeExpenseRecords = angular.copy(IncomeExpenseService.incomeExpenseRecords);
                	$scope.displayIncomeExpenseRecords.year = angular.copy($scope.year);
                	$scope.displayIncomeExpenseRecords.month = angular.copy($scope.month);

                } else {

                    if ($scope.user.incomeExpenseRecordsPeriod.minMonth === $scope.user.incomeExpenseRecordsPeriod.maxMonth && $scope.user.incomeExpenseRecordsPeriod.minYear === $scope.user.incomeExpenseRecordsPeriod.maxYear) {
                        $scope.displayIncomeExpenseRecords = angular.copy($scope.user.incomeExpenseRecords[0]);
                    } else {
                        // IF there is multiple record

                        //TO review
                        var targetYear;
                        var targetMonth;
                        var minimumYear = $scope.user.incomeExpenseRecordsPeriod.minYear;
                        var minimumMonth = $scope.user.incomeExpenseRecordsPeriod.minMonth;
                        var maximumYear = $scope.user.incomeExpenseRecordsPeriod.maxYear;
                        var maximumMonth = $scope.user.incomeExpenseRecordsPeriod.maxMonth;

                        var latestYear = minimumYear;
                        var latestMonth = minimumMonth;

                        var latestRecord;

                        if ($scope.year > maximumYear || $scope.year === maximumYear && $scope.month >= maximumMonth) {
                            //Date after max
                            targetYear = maximumYear;
                            targetMonth = maximumMonth;
                            for (var r2 in $scope.user.incomeExpenseRecords) {
                                if ($scope.user.incomeExpenseRecords[r2].year === targetYear && $scope.user.incomeExpenseRecords[r2].month === targetMonth) {
                                    latestRecord = angular.copy($scope.user.incomeExpenseRecords[r2]);
                                }
                            }
                        } else {
                            //Date in between
                            targetYear = $scope.year;
                            targetMonth = $scope.month;
                            for (var r3 in $scope.user.incomeExpenseRecords) {
                                if ($scope.user.incomeExpenseRecords[r3].year < targetYear || $scope.user.incomeExpenseRecords[r3].year === targetYear && $scope.user.incomeExpenseRecords[r3].month <= targetMonth) {
                                    if ($scope.user.incomeExpenseRecords[r3].year === latestYear && $scope.user.incomeExpenseRecords[r3].month >= latestMonth) {
                                        latestRecord = angular.copy($scope.user.incomeExpenseRecords[r3]);
                                        latestMonth = angular.copy($scope.user.incomeExpenseRecords[r3].month);
                                    } else if ($scope.user.incomeExpenseRecords[r3].year > latestYear) {
                                        latestRecord = angular.copy($scope.user.incomeExpenseRecords[r3]);
                                        latestMonth = angular.copy($scope.user.incomeExpenseRecords[r3].month);
                                        latestYear = angular.copy($scope.user.incomeExpenseRecords[r3].year);
                                    }
                                }
                            }
                        }
                        $scope.displayIncomeExpenseRecords = latestRecord;
                    }
                }
                //To edit to bar graph
                if(!$scope.displayIncomeExpenseRecords.incomeNormalAmt && !$scope.displayIncomeExpenseRecords.otherIncomeAmt && !$scope.displayIncomeExpenseRecords.fixedExpenseAmt && !$scope.displayIncomeExpenseRecords.transportAmt && !$scope.displayIncomeExpenseRecords.utilityHouseholdAmt && !$scope.displayIncomeExpenseRecords.foodNecessitiesAmt && !$scope.displayIncomeExpenseRecords.miscAmt && !$scope.displayIncomeExpenseRecords.optionalSavingsAmt){
                    $scope.incomeDoughnutData = [1]; 
                    $scope.incomeDoughnutLabels = ['No Data'];
                    $scope.expenseDoughnutData = [1]; 
                    $scope.expenseDoughnutLabels = ['No Data'];
                }else {
                    $scope.incomeDoughnutData = [$scope.displayIncomeExpenseRecords.incomeNormalAmt, $scope.displayIncomeExpenseRecords.otherIncomeAmt]; 
                    $scope.incomeDoughnutLabels = ['Employment Income', 'Other Income'];
                    $scope.expenseDoughnutData = [$scope.displayIncomeExpenseRecords.fixedExpenseAmt, $scope.displayIncomeExpenseRecords.transportAmt, $scope.displayIncomeExpenseRecords.utilityHouseholdAmt, $scope.displayIncomeExpenseRecords.foodNecessitiesAmt, $scope.displayIncomeExpenseRecords.miscAmt, $scope.displayIncomeExpenseRecords.optionalSavingsAmt]; 
                    $scope.expenseDoughnutLabels = ['Fixed Expense', 'Transport', 'Utilities & Household Maintenance', 'Food & Necessities', 'Miscellaneous', 'Optional Savings'];

                    if(parseFloat($scope.displayIncomeExpenseRecords.monthlyIncomeAmt) === 0.00) {
                        $scope.incomeDoughnutData = [1];
                        $scope.incomeDoughnutLabels = ['No Data'];
                    }
                    if(parseFloat($scope.displayIncomeExpenseRecords.monthlyExpenseAmt) === 0.00) {
                       $scope.expenseDoughnutData = [1]; 
                       $scope.expenseDoughnutLabels = ['No Data'];

                    }
                    console.log($scope.incomeDoughnutData);
                }

            };


		$scope.updateUserFinances = function(isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                //ONLY when they update
                if (!$scope.user.incomeExpenseRecordsPeriod) {
                    console.log('Hello??');
                    //If there is no existing record
                    $scope.user.incomeExpenseRecordsPeriod = {};
                    $scope.user.incomeExpenseRecordsPeriod.minMonth = $scope.month;
                    $scope.user.incomeExpenseRecordsPeriod.minYear = $scope.year;
                    $scope.user.incomeExpenseRecordsPeriod.maxMonth = $scope.month;
                    $scope.user.incomeExpenseRecordsPeriod.maxYear = $scope.year;

                } else {

                    //To review
                    //If there is only 1 rec
                    if ($scope.user.incomeExpenseRecordsPeriod.minYear === $scope.user.incomeExpenseRecordsPeriod.maxYear && $scope.user.incomeExpenseRecordsPeriod.minMonth === $scope.user.incomeExpenseRecordsPeriod.maxMonth) {
                        if ($scope.year === $scope.user.incomeExpenseRecordsPeriod.minYear) {
                            if ($scope.month < $scope.user.incomeExpenseRecordsPeriod.minMonth) {
                                $scope.user.incomeExpenseRecordsPeriod.minMonth = $scope.month;
                            } else if ($scope.month > $scope.user.incomeExpenseRecordsPeriod.maxMonth) {
                                $scope.user.incomeExpenseRecordsPeriod.maxMonth = $scope.month;
                            }
                        } else if ($scope.year < $scope.user.incomeExpenseRecordsPeriod.minYear) {
                            $scope.user.incomeExpenseRecordsPeriod.minYear = $scope.year;
                            $scope.user.incomeExpenseRecordsPeriod.minMonth = $scope.month;
                        } else if ($scope.year > $scope.user.incomeExpenseRecordsPeriod.maxYear) {
                            $scope.user.incomeExpenseRecordsPeriod.maxYear = $scope.year;
                            $scope.user.incomeExpenseRecordsPeriod.maxMonth = $scope.month;
                        }
                    } else {
                        //If more than 1 rec
                        //If smaller
                        if ($scope.year < $scope.user.incomeExpenseRecordsPeriod.minYear || $scope.year === $scope.user.incomeExpenseRecordsPeriod.minYear && $scope.month < $scope.user.incomeExpenseRecordsPeriod.minMonth) {
                            $scope.user.incomeExpenseRecordsPeriod.minYear = $scope.year;
                            $scope.user.incomeExpenseRecordsPeriod.minMonth = $scope.month;

                        } else if ($scope.year > $scope.user.incomeExpenseRecordsPeriod.maxYear || $scope.year === $scope.user.incomeExpenseRecordsPeriod.maxYear && $scope.month > $scope.user.incomeExpenseRecordsPeriod.maxMonth) {
                            //If bigger
                            $scope.user.incomeExpenseRecordsPeriod.maxYear = $scope.year;
                            $scope.user.incomeExpenseRecordsPeriod.maxMonth = $scope.month;
                        }
                    }

                }

                var errorCheck = 0;
                //Income
                var incomeNormalArr = $scope.displayIncomeExpenseRecords.monthlyIncome.incomeNormal;
                var incomeNormalTotal = 0;
                angular.forEach(incomeNormalArr, function(value, key){
                    incomeNormalTotal = incomeNormalTotal + Number(value.value);
                });

                var otherIncomeArr = $scope.displayIncomeExpenseRecords.monthlyIncome.otherIncome;
                var otherIncomeTotal = 0;
                angular.forEach(otherIncomeArr, function(value, key){
                    otherIncomeTotal = otherIncomeTotal + Number(value.value);
                });
                console.log(otherIncomeTotal);
                //Expense
                var fixedExpenseArr = $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense;
                var fixedExpenseTotal = 0;
                angular.forEach(fixedExpenseArr, function(value, key){ 
                    if (value.value<value.recordsTotal) {
                        value.value = value.recordsTotal;
                        alert('Minimum Expense for '+value.description+' is: $'+value.value);
                        errorCheck += 1;
                    }
                    fixedExpenseTotal = fixedExpenseTotal + Number(value.value);
                });

                var transportArr = $scope.displayIncomeExpenseRecords.monthlyExpense.transport;
                var transportTotal = 0;
                angular.forEach(transportArr, function(value, key){
                    if (value.value<value.recordsTotal) {
                        value.value = value.recordsTotal;
                        alert('Minimum Expense for '+value.description+' is: $'+value.value);
                        errorCheck += 1;
                    }
                    transportTotal = transportTotal + Number(value.value);
                });

                var utilityHouseholdArr = $scope.displayIncomeExpenseRecords.monthlyExpense.utilityHousehold;
                var utilityHouseholdTotal = 0;
                angular.forEach(utilityHouseholdArr, function(value, key){
                    if (value.value<value.recordsTotal) {
                        value.value = value.recordsTotal;
                        alert('Minimum Expense for '+value.description+' is: $'+value.value);
                        errorCheck += 1;
                    }
                    utilityHouseholdTotal = utilityHouseholdTotal + Number(value.value);
                });

                var foodNecessitiesArr = $scope.displayIncomeExpenseRecords.monthlyExpense.foodNecessities;
                var foodNecessitiesTotal = 0;
                angular.forEach(foodNecessitiesArr, function(value, key){
                    if (value.value<value.recordsTotal) {
                        value.value = value.recordsTotal;
                        alert('Minimum Expense for '+value.description+' is: $'+value.value);
                        errorCheck += 1;
                    }
                    foodNecessitiesTotal = foodNecessitiesTotal + Number(value.value);
                });

                var miscArr = $scope.displayIncomeExpenseRecords.monthlyExpense.misc;
                var miscTotal = 0;
                angular.forEach(miscArr, function(value, key){
                    if (value.value<value.recordsTotal) {
                        value.value = value.recordsTotal;
                        alert('Minimum Expense for '+value.description+' is: $'+value.value);
                        errorCheck += 1;
                    }
                    miscTotal = miscTotal + Number(value.value);
                });

                var optionalSavingsArr = $scope.displayIncomeExpenseRecords.monthlyExpense.optionalSavings;
                var optionalSavingsTotal = 0;
                angular.forEach(optionalSavingsArr, function(value, key){
                    if (value.value<value.recordsTotal) {
                        value.value = value.recordsTotal;
                        alert('Minimum Expense for '+value.description+' is: $'+value.value);
                        errorCheck += 1;
                    }
                    optionalSavingsTotal = optionalSavingsTotal + Number(value.value);
                });


                var monthlyIncomeAmt = incomeNormalTotal + otherIncomeTotal;
                var monthlyExpenseAmt = fixedExpenseTotal + transportTotal + utilityHouseholdTotal + foodNecessitiesTotal + miscTotal + optionalSavingsTotal;
                var netCashFlow = monthlyIncomeAmt - monthlyExpenseAmt;

                $scope.displayIncomeExpenseRecords.incomeNormalAmt = incomeNormalTotal.toFixed(2);
                $scope.displayIncomeExpenseRecords.otherIncomeAmt = otherIncomeTotal.toFixed(2);

                $scope.displayIncomeExpenseRecords.fixedExpenseAmt = fixedExpenseTotal.toFixed(2);
                $scope.displayIncomeExpenseRecords.transportAmt = transportTotal.toFixed(2);
                $scope.displayIncomeExpenseRecords.utilityHouseholdAmt = utilityHouseholdTotal.toFixed(2);
                $scope.displayIncomeExpenseRecords.foodNecessitiesAmt = foodNecessitiesTotal.toFixed(2);
                $scope.displayIncomeExpenseRecords.miscAmt = miscTotal.toFixed(2);           
                $scope.displayIncomeExpenseRecords.optionalSavingsAmt = optionalSavingsTotal.toFixed(2);    

                $scope.displayIncomeExpenseRecords.monthlyIncomeAmt = monthlyIncomeAmt.toFixed(2);
                $scope.displayIncomeExpenseRecords.monthlyExpenseAmt = monthlyExpenseAmt.toFixed(2);
                $scope.displayIncomeExpenseRecords.netCashFlow = netCashFlow.toFixed(2);

                if (!$scope.user.incomeExpenseRecords) {
                    $scope.user.incomeExpenseRecords = [];
                    $scope.user.incomeExpenseRecords.push($scope.displayIncomeExpenseRecords);
                } else {
                    var recordExist = false;
                    for (var num = 0; num < $scope.user.incomeExpenseRecords.length; num++) {
                        if ($scope.user.incomeExpenseRecords[num].year === $scope.year && $scope.user.incomeExpenseRecords[num].month === $scope.month) {
                            //If exist, update	
                            $scope.user.incomeExpenseRecords[num] = $scope.displayIncomeExpenseRecords;
                            recordExist = true;
                        }
                    }
                    //else insert
                    console.log(recordExist);
                    console.log($scope.displayIncomeExpenseRecords);
                    console.log($scope.user.incomeExpenseRecords);
                    if (recordExist === false) {
                        var toInsertArr = angular.copy($scope.displayIncomeExpenseRecords);
                        toInsertArr.year = angular.copy($scope.year);
                        toInsertArr.month = angular.copy($scope.month);
                        $scope.user.incomeExpenseRecords.push(toInsertArr);
                    }
                }
                if (errorCheck===0) {
                    $scope.user.updatedIncomeExpense = true;
                    var user = new Users($scope.user);
                    user.$update(function(response) {
                        $scope.success = true;

                        Authentication.user = response;
                        $scope.user = Authentication.user;
                    }, function(response) {
                        $scope.error = response.data.message;
                    });
                }
            } else {
                $scope.submitted = true;
            }
        };

        $scope.$watch('selectedMonth', function(){
            retrieveRecord();
        });
        $scope.$watch('selectedYear', function(){
            retrieveRecord();
        });

        $scope.clearSuccessMessage = function(){
            if ($scope.success || $scope.error) {
                $scope.success = false;
                $scope.error = false;
            }
        };
	}
]);
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
'use strict';

// Articles controller
angular.module('financial').controller('LiabilitiesController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'LiabilitiesService', 'Users', '$q',
	function($scope, $rootScope, $stateParams, $location, Authentication, LiabilitiesService, Users, $q) {
		$scope.user = Authentication.user;
        //Check for authentication
        if (!$scope.user) $location.path('/');

        this.$setScope = function(context) {
            $scope = context;
        };
        //Questions
        $scope.oneAtATime = false;

        //--DATE Selected
        var current = function() {
            $scope.dt = new Date();
            $scope.month = $scope.dt.getMonth();
            $scope.year = Number($scope.dt.getFullYear());
            $scope.monthDisplay = $scope.selectedMonth;
            console.log($scope.month);
            console.log($scope.year);
        };


        //Chart display
        $scope.liabilitiesChartDisplay = true;
        $scope.liabilitiesDoughnutData = [1]; 
        $scope.liabilitiesDoughnutLabels = ['No Data'];

        current();

        $scope.monthArr = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
            ];


        var retrieveRecord = function() {
            $scope.month = $scope.monthArr.indexOf($scope.selectedMonth);
            $scope.monthDisplay = $scope.selectedMonth;
            $scope.year = $scope.selectedYear;

            if ($scope.success || $scope.error) {
                $scope.success = false;
                $scope.error = false;
            }
            $scope.$watch('user', function() {
                reloadData();
            });
        };

        var reloadData = function() {
            if (!$scope.user.liabilitiesRecordsPeriod || ($scope.user.liabilitiesRecordsPeriod.minMonth > $scope.month && $scope.user.liabilitiesRecordsPeriod.minYear >= $scope.year) || ( $scope.user.liabilitiesRecordsPeriod.minYear > $scope.year)) {

            	$scope.displayLiabilitiesRecords = angular.copy(LiabilitiesService.liabilitiesRecords);
            	$scope.displayLiabilitiesRecords.year = angular.copy($scope.year);
            	$scope.displayLiabilitiesRecords.month = angular.copy($scope.month);

            } else {

                if ($scope.user.liabilitiesRecordsPeriod.minMonth === $scope.user.liabilitiesRecordsPeriod.maxMonth && $scope.user.liabilitiesRecordsPeriod.minYear === $scope.user.liabilitiesRecordsPeriod.maxYear) {
                    $scope.displayLiabilitiesRecords = angular.copy($scope.user.liabilitiesRecords[0]);
                } else {
                    // IF there is multiple record

                    //TO review
                    var targetYear;
                    var targetMonth;
                    var minimumYear = $scope.user.liabilitiesRecordsPeriod.minYear;
                    var minimumMonth = $scope.user.liabilitiesRecordsPeriod.minMonth;
                    var maximumYear = $scope.user.liabilitiesRecordsPeriod.maxYear;
                    var maximumMonth = $scope.user.liabilitiesRecordsPeriod.maxMonth;

                    var latestYear = minimumYear;
                    var latestMonth = minimumMonth;

                    var latestRecord;

                    if ($scope.year > maximumYear || $scope.year === maximumYear && $scope.month >= maximumMonth) {
                        //Date after max
                        targetYear = maximumYear;
                        targetMonth = maximumMonth;
                        for (var r2 in $scope.user.liabilitiesRecords) {
                            if ($scope.user.liabilitiesRecords[r2].year === targetYear && $scope.user.liabilitiesRecords[r2].month === targetMonth) {
                                latestRecord = angular.copy($scope.user.liabilitiesRecords[r2]);
                            }
                        }
                    } else {
                        //Date in between
                        targetYear = $scope.year;
                        targetMonth = $scope.month;
                        for (var r3 in $scope.user.liabilitiesRecords) {
                            if ($scope.user.liabilitiesRecords[r3].year < targetYear || $scope.user.liabilitiesRecords[r3].year === targetYear && $scope.user.liabilitiesRecords[r3].month <= targetMonth) {
                                if ($scope.user.liabilitiesRecords[r3].year === latestYear && $scope.user.liabilitiesRecords[r3].month >= latestMonth) {
                                    latestRecord = angular.copy($scope.user.liabilitiesRecords[r3]);
                                    latestMonth = angular.copy($scope.user.liabilitiesRecords[r3].month);
                                } else if ($scope.user.liabilitiesRecords[r3].year > latestYear) {
                                    latestRecord = angular.copy($scope.user.liabilitiesRecords[r3]);
                                    latestMonth = angular.copy($scope.user.liabilitiesRecords[r3].month);
                                    latestYear = angular.copy($scope.user.liabilitiesRecords[r3].year);
                                }
                            }
                        }
                    }
                    $scope.displayLiabilitiesRecords = latestRecord;
                }
            }
            if(!$scope.displayLiabilitiesRecords.shortTermCreditAmt && !$scope.displayLiabilitiesRecords.loansMortgagesAmt && !$scope.displayLiabilitiesRecords.otherLiabilitiesAmt){
                $scope.liabilitiesDoughnutData = [1]; 
                $scope.liabilitiesDoughnutLabels = ['No Data'];
            } else{
                $scope.liabilitiesDoughnutData = [$scope.displayLiabilitiesRecords.shortTermCreditAmt, $scope.displayLiabilitiesRecords.loansMortgagesAmt, $scope.displayLiabilitiesRecords.otherLiabilitiesAmt];
                $scope.liabilitiesDoughnutLabels = ['Short-Term Credit', 'Loans & Mortgages', 'Other Liabilities'];
            }

        };
	
		$scope.updateUserFinances = function(isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                //ONLY when they update
                if (!$scope.user.liabilitiesRecordsPeriod) {
                    //If there is no existing record
                    $scope.user.liabilitiesRecordsPeriod = {};
                    $scope.user.liabilitiesRecordsPeriod.minMonth = $scope.month;
                    $scope.user.liabilitiesRecordsPeriod.minYear = $scope.year;
                    $scope.user.liabilitiesRecordsPeriod.maxMonth = $scope.month;
                    $scope.user.liabilitiesRecordsPeriod.maxYear = $scope.year;

                } else {

                    //To review
                    //If there is only 1 rec
                    if ($scope.user.liabilitiesRecordsPeriod.minYear === $scope.user.liabilitiesRecordsPeriod.maxYear && $scope.user.liabilitiesRecordsPeriod.minMonth === $scope.user.liabilitiesRecordsPeriod.maxMonth) {
                        if ($scope.year === $scope.user.liabilitiesRecordsPeriod.minYear) {
                            if ($scope.month < $scope.user.liabilitiesRecordsPeriod.minMonth) {
                                $scope.user.liabilitiesRecordsPeriod.minMonth = $scope.month;
                            } else if ($scope.month > $scope.user.liabilitiesRecordsPeriod.maxMonth) {
                                $scope.user.liabilitiesRecordsPeriod.maxMonth = $scope.month;
                            }
                        } else if ($scope.year < $scope.user.liabilitiesRecordsPeriod.minYear) {
                            $scope.user.liabilitiesRecordsPeriod.minYear = $scope.year;
                            $scope.user.liabilitiesRecordsPeriod.minMonth = $scope.month;
                        } else if ($scope.year > $scope.user.liabilitiesRecordsPeriod.maxYear) {
                            $scope.user.liabilitiesRecordsPeriod.maxYear = $scope.year;
                            $scope.user.liabilitiesRecordsPeriod.maxMonth = $scope.month;
                        }
                    } else {
                        //If more than 1 rec
                        //If smaller
                        if ($scope.year < $scope.user.liabilitiesRecordsPeriod.minYear || $scope.year === $scope.user.liabilitiesRecordsPeriod.minYear && $scope.month < $scope.user.liabilitiesRecordsPeriod.minMonth) {
                            $scope.user.liabilitiesRecordsPeriod.minYear = $scope.year;
                            $scope.user.liabilitiesRecordsPeriod.minMonth = $scope.month;

                        } else if ($scope.year > $scope.user.liabilitiesRecordsPeriod.maxYear || $scope.year === $scope.user.liabilitiesRecordsPeriod.maxYear && $scope.month > $scope.user.liabilitiesRecordsPeriod.maxMonth) {
                            //If bigger
                            $scope.user.liabilitiesRecordsPeriod.maxYear = $scope.year;
                            $scope.user.liabilitiesRecordsPeriod.maxMonth = $scope.month;
                        }
                    }

                }

                var errorCheck = 0;
                var shortTermCreditArr = $scope.displayLiabilitiesRecords.shortTermCredit;
                var shortTermCreditTotal = 0;
                angular.forEach(shortTermCreditArr, function(value, key){
                    shortTermCreditTotal = shortTermCreditTotal + Number(value.value);
                });

                var loansMortgagesArr = $scope.displayLiabilitiesRecords.loansMortgages;
                var loansMortgagesTotal = 0;
                angular.forEach(loansMortgagesArr, function(value, key){
                    if(value.value<value.minValue) {
                        value.value = value.minValue; 
                        alert('Minimum liability value for '+value.description+' is: $'+value.value);
                        errorCheck++;
                        location.reload();
                    }
                    loansMortgagesTotal = loansMortgagesTotal + Number(value.value);
                });

                var otherLiabilitiesArr = $scope.displayLiabilitiesRecords.otherLiabilities;
                var otherLiabilitiesTotal = 0;
                angular.forEach(otherLiabilitiesArr, function(value, key){
                    otherLiabilitiesTotal = otherLiabilitiesTotal + Number(value.value);
                });


                var liabilitiesTotal = shortTermCreditTotal + loansMortgagesTotal + otherLiabilitiesTotal;

                $scope.displayLiabilitiesRecords.shortTermCreditAmt = shortTermCreditTotal.toFixed(2);
                $scope.displayLiabilitiesRecords.loansMortgagesAmt = loansMortgagesTotal.toFixed(2);
                $scope.displayLiabilitiesRecords.otherLiabilitiesAmt = otherLiabilitiesTotal.toFixed(2);
                $scope.displayLiabilitiesRecords.totalAmt = liabilitiesTotal.toFixed(2);

                if (!$scope.user.liabilitiesRecords) {
                    $scope.user.liabilitiesRecords = [];
                    $scope.user.liabilitiesRecords.push($scope.displayLiabilitiesRecords);
                } else {
                    var recordExist = false;
                    for (var num = 0; num < $scope.user.liabilitiesRecords.length; num++) {
                        if ($scope.user.liabilitiesRecords[num].year === $scope.year && $scope.user.liabilitiesRecords[num].month === $scope.month) {
                            //If exist, update	
                            $scope.user.liabilitiesRecords[num] = $scope.displayLiabilitiesRecords;
                            recordExist = true;
                        }
                    }
                    //else insert
                    if (recordExist === false) {
                        var toInsertArr = angular.copy($scope.displayLiabilitiesRecords);
                        toInsertArr.year = angular.copy($scope.year);
                        toInsertArr.month = angular.copy($scope.month);
                        $scope.user.liabilitiesRecords.push(toInsertArr);
                    }
                }

                $scope.user.updatedLiabilities = true;
                var user = new Users($scope.user);
                user.$update(function(response) {
                    $scope.success = true;

                    Authentication.user = response;
                    $scope.user = Authentication.user;
                }, function(response) {
                    $scope.error = response.data.message;
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.$watch('selectedMonth', function(){
            retrieveRecord();
        });
        $scope.$watch('selectedYear', function(){
            retrieveRecord();
        });

        $scope.clearSuccessMessage = function(){
            if ($scope.success || $scope.error) {
                $scope.success = false;
                $scope.error = false;
            }
        };
	}
]);
'use strict';

angular.module('financial').factory('AssetsService', ['$resource', function($resource){
	var cashEquivalents = {
		cashOnHand: {
			description: 'Cash on Hand',
			order: 0,
			value: 0
		},
		currentAcc: {
			description: 'Current Account',
			order: 1,
			value: 0
		},
		savingsAcc: {
			description: 'Savings Account',
			order: 2,
			value: 0
		},
		fixedDeposit: {
			description: 'Fixed Deposit',
			order: 3,
			value: 0
		},
		others: {
			description: 'Others',
			order: 4,
			value: 0
		}
	};

	var personalUseAssets = {
		house: {
			description: 'House (Residing)',
			order: 0,
			value: 0
		},
		car: {
			description: 'Car',
			order: 1,
			value: 0
		},
		countryClubs: {
			description: 'Country Clubs',
			order: 2,
			value: 0
		},
		others: {
			description: 'Others',
			order: 3,
			value: 0
		}
	};

	var investedAssets = {
		privateProperties: {
			description: 'Private Properties',
			order: 0,
			value: 0
		},
		shares: {
			description: 'Shares',
			order: 1,
			value: 0
		},
		unitTrusts: {
			description: 'Unit Trusts',
			order: 2,
			value: 0
		},
		corporateBonds: {
			description: 'Corporate Bonds',
			order: 3,
			value: 0
		},
		singaoporeSavingsBonds: {
			description: 'Singapore Savings Bonds',
			order: 4,
			value: 0
		},
		governmentBonds: {
			description: 'Government Bonds',
			order: 5,
			value: 0
		},
		bondFunds: {
			description: 'Bond Funds',
			order: 6,
			value: 0
		},
		bondETFs: {
			description: 'Bond ETFs',
			order: 7,
			value: 0
		},
		lifeInsurance: {
			description: 'Life Insurance',
			order: 8,
			value: 0
		},
		investmentInsurance: {
			description: 'Investment Insurance',
			order: 9,
			value: 0
		},
		others: {
			description: 'Others',
			order: 10,
			value: 0
		}
	};

	var cpfSavings = {
		ordinaryAcc: {
			description: 'Ordinary Account',
			order: 0,
			value: 0
		},
		specialAcc: {
			description: 'Special Account',
			order: 1,
			value: 0
		},
		medisaveAcc: {
			description: 'Medisave Account',
			order: 2,
			value: 0
		},
		others: {
			description: 'Others',
			order: 3,
			value: 0
		}
	};

	var otherAssets = {
		others: {
			description: 'Others',
			order: 0,
			value: 0
		}
	};

	var cashEquivalentsAmt = 0;
	var personalUseAssetsAmt = 0;
	var investedAssetsAmt = 0;
	var cpfSavingsAmt = 0;
	var otherAssetsAmt = 0;
	var totalAmt = 0;

	var assetsRecords = {		
		cashEquivalents: cashEquivalents,
		personalUseAssets: personalUseAssets,
		investedAssets: investedAssets,
		cpfSavings: cpfSavings,
		otherAssets: otherAssets,

		cashEquivalentsAmt: cashEquivalentsAmt,
		personalUseAssetsAmt: personalUseAssetsAmt,
		investedAssetsAmt: investedAssetsAmt,
		cpfSavingsAmt: cpfSavingsAmt,
		otherAssetsAmt: otherAssetsAmt,
		totalAmt: totalAmt
	};
	return {
		assetsRecords: assetsRecords
	};
}]);
'use strict';

angular.module('financial').factory('BudgetService', ['$resource', function($resource){
	//Income
	var budgetLimits = {
		fixedExpenseB: 0,
		foodB: 0,
		miscB: 0,
		utilitiesB: 0,
		transportB: 0
	};

	return {
		budgetLimits: budgetLimits
	};
}]);
'use strict';

angular.module('financial').factory('FinancialHealthService', ['$resource', function($resource){


	//Tooltips
	//1 Liquidity Ratio
	var tipLiquidity = 'The calculated result is the number of months you can maintain your current expenses habits using your current assets.</br> This ratio is used for analysing existing emergency funds. It is a prescribed practice to maintain 2-6 months of expenses as your emergency fund.  For example, if you are suddenly presented with an investment opportunity for which you must act fast, you will probably look first to draw on your liquid assets';

	var tipTotalLiquidity = 'The calculated result is the number of months you can maintain your current expenses habits using your current and invested assets.</br> This ratio measures your abilitiy to pay for your expenses using your current assets in cases of emergencies (e.g when you are suddenly out of job)';

	//2 Savings Ratio
	var tipSaving = 'The calculated results shows the proportion of your monthly surplus income to your total monthly income.</br> It compares the monthly surplus being generated by an individual against total cash inflows. It will give you valuable insight on how well your finances are being managed. It also represents one&#39;s ability to achieve his/her future goals.';
	
	var tipBasicSaving = 'The calculated results shows the proportion of your annual savings to your total annual income.</br> This ratio measures whether you have a healthy saving habit and also if you are saving enough given your current income.';

	//3 Expenses Ratio
	var tipEssentialExpenses = 'The calculated results shows the proportion of money you are spending monthly on essentials to your monthly income.</br> This ratio measures whether you are spending within your means on daily essentials.';

	var tipLifestyleExpenses = 'The calculated results shows the proportion of money you are spending monthly on lifestyle to your monthly income.</br> This ratio measures whether you are spending within your means on non-essentials.';

	//4 Debt Ratios
	var tipAssetDebt = 'This ratio compares the assets accumulated by an individual against the existing liabilities</br> and helps in determining what you own vs. what you owe.';

	var tipDebtService = 'The calculated result is the proportion of short term liabilities to your monthly income.</br> This ratio defines how comfortable one is making his/her EMI (equated monthly installments) payments.';

	var tipHouseExpense = 'The calculated result is the proportion of monthly expenditure on housing maintainence to your monthly income.</br> One of the best ways to determine how much housing you can afford is by calculating your housing expense ratio';

	var tipDebtIncome = 'The calculated result is the proportion of monthly debt payments to your monthly income.</br> Lenders look at this ratio when they are trying to decide whether to lend you money or extend credit. A low DTI shows you have a good balance between debt and income. Lenders like this number to be low -- generally you&#39;ll want to keep it below 36, but the lower it is, the greater the chance you will be able to get the loans or credit you seek. Evidence from studies of mortgage loans suggest that borrowers with a higher debt-to-income ratio are more likely to run into trouble making monthly payments.';

	var tipConsumerDebt = 'The calculated result is the proportion of monthly credit card debts to your monthly income.</br> A high consumer debt ratio could point to excessive use of credit cards.';

	//5 Net Worth and Other Ratio
	var tipNetWorthBenchmark = 'This metric is used to compare your actual net worth to a standard.</br> The net worth benchmark assumes that your net worth is a function</br> of your earnings and your years of earnings';

	var tipSolvency = 'Solvency ratio compares an individual&#39;s net worth against total assets accumulated by him/her.</br> This ratio indicates the ability of an individual to repay all his/her existing debts</br> using existing assets in case of unforeseen events.';

	//6 Asset vs Debt Ratio
	var tipCurrentAssetDebt = 'This ratio measures how much liquid assets you have versus your short term debts to give you an overview of whether you are taking too much short term debts, or have too much liquid assets which you can adjust to get a higher return.';

	var tipInvestment = 'This ratio compares liquid assets being held by an individual against the total assets accumulated.</br> Investments in stocks, mutual funds or other such investments,</br> which can be converted to cash easily, are considered as liquid assets.';

	var tips = {
		tipLiquidity: tipLiquidity,
		tipTotalLiquidity: tipTotalLiquidity,

		tipSaving: tipSaving,
		tipBasicSaving: tipBasicSaving,

		tipEssentialExpenses: tipEssentialExpenses,
		tipLifestyleExpenses: tipLifestyleExpenses,

		tipAssetDebt: tipAssetDebt,
		tipDebtService: tipDebtService,
		tipHouseExpense: tipHouseExpense,
		tipDebtIncome: tipDebtIncome,
		tipConsumerDebt: tipConsumerDebt,

		tipNetWorthBenchmark: tipNetWorthBenchmark,
		tipSolvency: tipSolvency,

		tipCurrentAssetDebt: tipCurrentAssetDebt,
		tipInvestment: tipInvestment
	};


	//---Liquidity---
	//Liquidity Ratio
	var analysisLiquidity = {
		//[2-6, >=6]
		healthy: ['You have a healthy liquidity ratio. This means that you are able to maintain 3-6 months of your current expenses as your emergency funds. For example, if you are suddenly presented with an investment opportunity where you must act fast, your liquid assets will come in handy.', 
		'You have a healthy liquidty ratio. This means that you are able to maintain more than 6 months of your current expenses as your emergency funds. However, this is more than the recommended ratio by experts as the liquid assets you hold on hand will depreciate with inflation if not managed well. Try looking into options to grow your excess liquid assets while maintaining the healthy ratio of 3 - 6'],
		//[0-2]
		unhealthy:['You have an unhealthy liquidity ratio. This means that you are not able to maintain a healthy portion of your expenses as your emergency fund']
	};
	//Total Liquidity Ratio
	var analysisTotalLiquidity = {
		//[>=6]
		healthy: ['You have a healthy total liquidty ratio. This means that you are able to maintain more than 6 months of your current expenses as your emergency funds using your current and invested assets.'],

		//[0-6]
		unhealthy: ['You have an unhealthy liquidity ratio. This means that you are not able to maintain a healthy portion of your expenses as your emergency funds using our current and invested assets.']
	};

	//---Savings---
	//Surplus Income Ratio /Savings Ratio
	var analysisSaving = {
		//[>0.7, 0.12-0.7]
		healthy: ['You have a healthy savings ratio. This means that you have a healthy surplus of money monthly. This shows that you are able to achieve your future goals easily. However, you may have an excessive amount of income surplus. You should look to investing to prevent inflation from depreciating the value of your savings.', 'You have a healthy savings ratio. This means that you have a healthy surplus of money monthly. This shows that you are able to achieve your future goals easily.'],
		//[0-0.12, <0]
		unhealthy: ['You have an unhealthy savings ratio. This means that you may have difficulty in achieving future goals with your current monthly savings trend.', 'You have an unhealthy savings ratio. You are spending more than your monthly income. This means that you will have difficulty in achieving future goals with your current monthly savings trend.']
	};
	//Basic Saving Ratio
	var analysisBasicSaving = {
		//[>=0.1]
		healthy: ['You have a healthy basic saving ratio. This means that you are saving more than 10% of your income and have a healthy saving habit.'],

		//[<0.1]
		unhealthy: ['You have an unhealthy basic saving ratio. This means that you are saving less than 10% of your income. Aim to save more than 10% of your income to cultivate a healthy saving habit.']
	};

	//---Expenses---
	//Essential Expenses to Income Ratio
	var analysisEssentialExpenses = {
		//[<0.5]
		healthy: ['You have a healthy essential expense to income ratio. This means that you are spending a healthy proportion of your monthly income on essential needs such as your Fixed Expenses, Utilities and Household Maintenance and Food and Necessities.'],
		//[>=0.5]
		unhealthy: ['You have an unhealthy essential expense to income ratio. This means that you are spending an unhealthly large proportion of your monthly income on essential needs such as your Fixed Expenses, Utilities and Household Maintenance and Food and Necessities.']
	};
	//Lifestyle Expenses to Income Ratio
	var analysisLifestyleExpenses = {
		//[<0.5]
		healthy: ['You have a healthy lifestyle expense to income ratio. This means that you are spending a healthy proportion of your monthly income on lifestyle expenses such as holiday tours, entertainment, etc.'],

		//[>=0.5]
		unhealthy: ['You have an unhealthy essential expense to income ratio. This means that you are spending an unhealthly large proportion of your monthly income on lifestyle expenses such as holiday tours, entertainment, etc']
	};

	//---Debt---
	//AssetDebt Ratio
	var analysisAssetDebt = {
		//[0-0.3, 0.4-0.6]
		healthy: ['You have a healthy debt to assets ratio. This means that you have a lesser proportion of loans to be paid as compared to your income. Maintaining a low debt-to-assets ratio shows banks that you have a low financial', 
		'You have a almost unhealthy debt to assets ratio. This means that you have lesser proportion of loans to be paid as compared to your income but the difference is small and it poses a risk to your financial health. Banks will view you to be more of financial risky than non-risky.'],
		//[>=0.6]
		unhealthy: ['You have an unhealthy debt-to-asset ratio. This means that your debts are more than 60% of your assets and hence making you to be in a risky financial situation. Banks in Singapore are no longer allowed to approve you for any more loans. Note: this ratio might be lower if you have recently purchased a house or car and will improve over time if you are financially healthy.']
	};

	//DebtService Ratio
	var analysisDebtService = {
		//[0-0.36]
		healthy: ['You have a healthy debt service ratio. This means that you are able to make your equated monthly installments comfortably.'],
		//[>0.36]
		unhealthy: ['You have an unhealthy debt service ratio. This means that paying your equated monthly installments is putting a pressure on your finances.']
	};

	//Housing Expense Ratio
	var analysisHouseExpense = {
		//[0-0.35]
		healthy: ['You have a healthy housing expense ratio. This means that you are spending a good and reasonable amount on housing expenses in proportion to your income.'],
		//[>0.35]
		unhealthy: ['You have an unhealthy housing expense ratio. This means that you are spending too much on housing expenses in proportion to your income.']
	};

	//Debt to Income Ratio
	var analysisDebtIncome = {
		//[0-0.4]
		healthy: ['You have a healthy debt-to-income ratio. This means that you have a good balance of between your debt and income. Lenders are willling to lend you money as you show a low financial risk behavior.'],
		//[>0.4]
		unhealthy: ['You have an unhealthy debt-to-income ratio. This means that the balance between your debt and income is not good. Lenders will often not lend you money as you exhibit high financial risk behaviour. Studies of mortgage loans have shown that borrowers with a higher debt-to-income ratio are more likely to run into trouble making monthly payments.']
	};

	//Consumer Debt Ratio
	var analysisConsumerDebt = {
		//[0-0.1]
		healthy: ['You have a healthy consumer debt ratio. This means that you are borrowing wisely.'],
		//[>0.1]
		unhealthy: ['You have an unhealthy consumer debt ratio. This means that you are borrowing unnecessarily and may have a serious debt problem. Only 5% of the population ows such high percentage of consumer debt. Seek help from a debt counsellor if you need to. In the meantime, stop using credit for your expenses.']
	};

	//---Net Worth/ Others---
	//Net Worth Benchmark
	var analysisNetWorthBenchmark = {
		//[>1, 0.75-1]
		healthy: ['Your networth is higher than your age&#39;s Networth Benchmark.', 'You are less than 15% away from your age&#39;s Networth Benchmark.'],
		//[0-0.75]
		unhealthy: ['You are below the networth benchmark for your age.']
	};

	//Solvency Ratio
	var analysisSolvency = {
		//[>0.2]
		healthy: ['You have a healthy solvency ratio. This means that you will be able to repay your existing debts using existing assets in an event of emergency base on your networth.'],
		//[0-0.2]
		unhealthy: ['You have an unhealthy solvency ratio. This means that you will have difficulty in repaying your existing debts using existing assets in an event of emergency base on your networth.']
	};

	//---Asset vs Debts
	//Current Asset to Debt Ratio
	var analysisCurrentAssetDebt = {
		//[>=1]
		healthy: ['You have a healthy current asset to debt ratio. This means that you have more short term assets than short term debts.'],
		//[<1]
		unhealthy: ['You have an unhealthy current asset to debt ratio. This means that you have more short term debts than short term assets.']
	};

	//Investment Ratio
	var analysisInvestment = {
		//[>0.2]
		healthy: ['You have a healthy investment ratio. This means you have a healthy portion of liquid assets as compared to your total assets which can be converted to cash easily for times of need.'],
		//[0-0.2]
		unhealthy: ['You have an unhealthy investment ratio. This means that you hold a too small portion of liquid assets in proportion to your total assets. This means that you have lesser amounts of liquid assets that can be converted into cash easily for times of need.']
	};

	var analysisRatio = {
		analysisLiquidity: analysisLiquidity,
		analysisTotalLiquidity: analysisTotalLiquidity,

		analysisSaving: analysisSaving,
		analysisBasicSaving: analysisBasicSaving,

		analysisEssentialExpenses: analysisEssentialExpenses,
		analysisLifestyleExpenses: analysisLifestyleExpenses,

		analysisAssetDebt: analysisAssetDebt,
		analysisDebtService: analysisDebtService,
		analysisHouseExpense: analysisHouseExpense,
		analysisDebtIncome: analysisDebtIncome,
		analysisConsumerDebt: analysisConsumerDebt,

		analysisNetWorthBenchmark: analysisNetWorthBenchmark,
		analysisSolvency: analysisSolvency,

		analysisCurrentAssetDebt: analysisCurrentAssetDebt,
		analysisInvestment: analysisInvestment
	};

	return {
		tips: tips,
		analysisRatio: analysisRatio
	};
}]);
'use strict';

angular.module('financial').factory('IncomeExpenseService', ['$resource', function($resource){
	//Income
	var incomeNormal = {
		employmentIncome: {
			description: 'Employment Income',
			order: 0,
			value: 0
			
		},
		tbpvIncome: {
			description: 'Trade, Business, Profession or Vocation',
			order: 1,
			value: 0
		}
	};

	var otherIncome = {
		dividends: {
			description: 'Dividends',
			order: 0,
			value: 0
		},
		interest: {
			description: 'Interest',
			order: 1,
			value: 0
		},
		rentFromProperty: {
			description: 'Rent from Property',
			order: 2,
			value: 0
		},
		royaltyChargeEstate: {
			description: 'Royalty, Charge, Estate/Trust Income',
			order: 3,
			value: 0
		},
		gainsProfitsIncome: {
			description: 'Gains or Profits of an Income Nature',
			order: 4,
			value: 0
		},
		others: {
			description: 'Others',
			order: 5,
			value: 0
		}
	};

	//Expense
	var fixedExpense = {
		// savings: {
		// 	description: 'Savings',
		// 	order: 0,
		// 	value: 0,
		// 	recordsTotal: 0,
		// 	records: []
		// },
		mortgageRepayments: {
			description: 'Mortgage Repayments',
			order: 1,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		rentalRepayments: {
			description: 'Rental Repayments',
			order: 2,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		otherLoanRepayments: {
			description: 'Other Loan Repayments',
			order: 3,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		conservancyPropertyTaxes: {
			description: 'Conservancy and Property Taxes',
			order: 4,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		insurances: {
			description: 'Insurances',
			order: 5,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		childrenEducation: {
			description: 'Children\x27s Educations',
			order: 6,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		allowances: {
			description: 'Allowances for Parents & Children',
			order: 7,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		maid: {
			description: 'Maid',
			order: 8,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		others: {
			description: 'Others',
			order: 9,
			value: 0,
			recordsTotal: 0,
			records: []
		}
	};	

	var transport = {
		carLoanRepayment: {
			description: 'Car Loan Repayments',
			order: 0,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		motorInsurances: {
			description: 'Motor Insurances',
			order: 1,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		roadTax: {
			description: 'Road Tax',
			order: 2,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		carparkFees: {
			description: 'Carpark Fees',
			order: 3,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		petrolMaintenanceExpense: {
			description: 'Petrol & Maintenance Expenses',
			order: 4,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		publicTransport: {
			description: 'Public Transport',
			order: 5,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		others: {
			description: 'Others',
			order: 6,
			value: 0,
			recordsTotal: 0,
			records: []
		}
	};	

	var utilityHousehold = {
		utilityBill: {
			description: 'Utilities Bill',
			order: 0,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		homeTelephone: {
			description: 'Home Telephone',
			order: 1,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		mobilePhone: {
			description: 'Mobile Phone',
			order: 2,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		cableTVInternet: {
			description: 'Cable TV & Internet',
			order: 3,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		others: {
			description: 'Others',
			order: 4,
			value: 0,
			recordsTotal: 0,
			records: []
		}
	};

	var foodNecessities = {
		groceries: {
			description: 'Groceries',
			order: 0,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		eatingOut: {
			description: 'Eating Out',
			order: 1,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		clothings: {
			description: 'Clothings',
			order: 2,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		personalGrooming: {
			description: 'Personal Grooming',
			order: 3,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		healthMedical: {
			description: 'Health & Medical',
			order: 4,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		others: {
			description: 'Others',
			order: 5,
			value: 0,
			recordsTotal: 0,
			records: []
		}
	};

	var misc = {
		tourFamilyOutings: {
			description: 'Tour & Family Outings',
			order: 0,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		entertainment: {
			description: 'Entertainment',
			order: 1,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		hobbiesSports: {
			description: 'Hobbies & Sports',
			order: 2,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		others: {
			description: 'Others',
			order: 3,
			value: 0,
			recordsTotal: 0,
			records: []
		}
	};

	var optionalSavings = {
		savings: {
			description: 'Money set aside monthly for savings',
			order: 0,
			value: 0,
			recordsTotal: 0,
			records: []
		},
		others:{
			description: 'Others',
			order: 1,
			value: 0,
			recordsTotal: 0,
			records: []
		}
	};

	var monthlyIncome = {
		incomeNormal: incomeNormal,
		otherIncome: otherIncome
	};

	var monthlyExpense =  {
		fixedExpense: fixedExpense,
		transport: transport,
		utilityHousehold: utilityHousehold,
		foodNecessities: foodNecessities,
		misc: misc,
		optionalSavings: optionalSavings
	};

	var incomeNormalAmt = 0;
	var otherIncomeAmt = 0;

	var fixedExpenseAmt = 0;
	var transportAmt = 0;
	var utilityHouseholdAmt = 0;
	var foodNecessitiesAmt = 0;
	var miscAmt = 0;
	var optionalSavingsAmt = 0;

	var monthlyIncomeAmt = 0;
	var monthlyExpenseAmt = 0;
	var netCashFlow = 0;

	var incomeExpenseRecords = {		
		monthlyIncome: monthlyIncome,
		monthlyExpense: monthlyExpense,

		incomeNormalAmt: incomeNormalAmt,
		otherIncomeAmt: otherIncomeAmt,

		fixedExpenseAmt: fixedExpenseAmt,
		transportAmt: transportAmt,
		utilityHouseholdAmt: utilityHouseholdAmt,
		foodNecessitiesAmt: foodNecessitiesAmt,
		miscAmt: miscAmt,
		optionalSavingsAmt: optionalSavingsAmt,

		monthlyIncomeAmt: monthlyIncomeAmt,
		monthlyExpenseAmt: monthlyExpenseAmt,
		netCashFlow: netCashFlow
	};
	return {
		incomeExpenseRecords: incomeExpenseRecords
	};
}]);
'use strict';

angular.module('financial').factory('LiabilitiesService', ['$resource', function($resource){
	var shortTermCredit = {
		creditCard1: {
			description: 'Credit Card 1 Balance',
			order: 0,
			value: 0
		},
		creditCard2: {
			description: 'Credit Card 2 Balance',
			order: 1,
			value: 0
		},
		creditCard3: {
			description: 'Credit Card 3 Balance',
			order: 2,
			value: 0
		},
		overdraftBalance: {
			description: 'Overdraft Balance',
			order: 3,
			value: 0
		},
		others: {
			description: 'Others',
			order: 4,
			value: 0
		}
	};

	var loansMortgages = {
		mortgageBalance: {
			description: 'Mortgage Loan',
			order: 0,
			value: 0,
			minValue: 0
		},
		carBalance :{
			description: 'Car Loan',
			order: 1,
			value: 0,
			minValue: 0
		},
		studentLoan: {
			description: 'Student Loan',
			order: 2,
			value: 0,
			minValue: 0
		},
		personalLoan: {
			description: 'Personal Loan',
			order: 3,
			value: 0,
			minValue: 0
		},
		// renovationLoan: {
		// 	description: 'Renovation Loan',
		// 	order: 4,
		// 	value: 0,
		// 	minValue: 0
		// },
		shareMarginFinancingLoan: {
			description: 'Share Margin Financing Loan',
			order: 4,
			value: 0,
			minValue: 0
		},
		others: {
			description: 'Others',
			order: 5,
			value: 0,
			minValue: 0
		}
	};

	var otherLiabilities = {
		others: {
			description: 'Others',
			order: 0,
			value: 0
		}
	};	


	var shortTermCreditAmt = 0;
	var loansMortgagesAmt = 0;
	var otherLiabilitiesAmt = 0;
	var totalAmt = 0;


	var liabilitiesRecords = {		
		shortTermCredit: shortTermCredit,
		loansMortgages: loansMortgages,
		otherLiabilities: otherLiabilities,

		shortTermCreditAmt: shortTermCreditAmt,
		loansMortgagesAmt: loansMortgagesAmt,
		otherLiabilitiesAmt: otherLiabilitiesAmt,
		totalAmt: totalAmt
	};
	return {
		liabilitiesRecords: liabilitiesRecords
	};
}]);
'use strict';

// Articles controller
angular.module('financial').controller('LoanCalculatorController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Users', '$q', 
  function($scope, $rootScope, $stateParams, $location, Authentication, Users, $q) {
        $scope.user = Authentication.user;

        $scope.monthlyRepaymentSum = 0;
        $scope.totalCostLoan = 0;
        $scope.results = 0;  

        $scope.principalAmtToBorrow = 0;  
        $scope.interestPaid = 0;  

        var year = 0;
        var month = 0;
        var yearMth = 0;
        var interestRate3PerMth = 0;
        var repaymentOverInterest = 0;
        var cal1 = 0;
        var cal2 = 0;
        $scope.timeToRepay = '0 years 0 months';  

      /*  $scope.barSeries = [];  
        $scope.barLabels = [];
        $scope.barData = [];
        var barArr = [];

        $scope.barSeries2 = [];  
        $scope.barLabels2 = [];
        $scope.barData2 = [];
        var barArr2 = [];
 
        $scope.barSeries3 = [];  
        $scope.barLabels3 = [];
        $scope.barData3 = [];
        var barArr3 = [];*/

       
       var convertLoanTermToMonths = function() {
          return $scope.calculator.loanTermYears * 12;
        };
        
        var calculateResult = function() {
          $scope.results = $scope.totalCostLoan - $scope.calculator.amtBorrowed;
          
        /*  barArr.push($scope.monthlyRepaymentSum);         
          $scope.barSeries.push('Scenario 1');
          $scope.barLabels.push('Monthly Repayment Sum');
          $scope.barData.push(barArr);*/
        };
        
        var calculateTotalLoan = function() {
          $scope.totalCostLoan = $scope.monthlyRepaymentSum * $scope.loanTermMonths + $scope.calculator.fees;
          calculateResult();
        };
        
       $scope.calculateMonthyRepaymentSum = function() {
          $scope.loanTermMonths = convertLoanTermToMonths();
          $scope.monthlyRepaymentSum = $scope.calculator.amtBorrowed / ((1-(1/Math.pow((1+(($scope.calculator.interestRate / 100) / 12)), $scope.loanTermMonths))) / (($scope.calculator.interestRate / 100) / 12));
          calculateTotalLoan();
        };
 
        var convertLoanTermToMonths2 = function() {
          return $scope.calculator.loanTermYears2 * 12;
        };
        
        var calculateInterestPaid = function() {
          $scope.interestPaid = $scope.calculator.affordableRepayment * $scope.loanTermMonths2 - $scope.principalAmtToBorrow;
         
         /* barArr2.push($scope.principalAmtToBorrow);         
          $scope.barSeries2.push('Scenario 1');
          $scope.barLabels2.push('Affordable Borrow Sum');
          $scope.barData2.push(barArr2);*/
        };

       $scope.calculatePrincipalAmtToBorrow = function() {
          $scope.loanTermMonths2 = convertLoanTermToMonths2();
                                                                                                                                              
          $scope.principalAmtToBorrow = ($scope.calculator.affordableRepayment / (($scope.calculator.interestRate2 / 100) / 12)) * (1-(1/(Math.pow(1+(($scope.calculator.interestRate2 / 100) / 12), $scope.loanTermMonths2))));
          calculateInterestPaid();
        };

        var convertToYrsMths = function(){
          
          if ($scope.timeToRepayVal > 12) {
             yearMth = $scope.timeToRepayVal / 12;
             year = Math.floor(yearMth);
             month = Math.ceil(yearMth % 1);
            $scope.timeToRepay = year + ' years ' + month +  ' months';

             /*barArr3.push(yearMth); */

          } else {
              month = Math.ceil($scope.timeToRepayVal);
              $scope.timeToRepay = month +  ' months';

             /* barArr3.push(month); */
          }

             
        /*  $scope.barSeries3.push('Scenario 1');
          $scope.barLabels3.push('Time To Repay');
          $scope.barData3.push(barArr3);*/
        };
  
        $scope.calculateTimeToRepay = function() {
        
          interestRate3PerMth = angular.copy((($scope.calculator.interestRate3 / 100).toFixed(4) / 12).toFixed(4));
          repaymentOverInterest = angular.copy(($scope.calculator.monthlyRepayment / interestRate3PerMth).toFixed(4));
          cal1 = (Math.log(repaymentOverInterest / (repaymentOverInterest - $scope.calculator.amtOwing)).toFixed(4));
          cal2 = (Math.log(1+Number(interestRate3PerMth))).toFixed(4);
          
          //$scope.timeToRepayVal = Math.log($scope.calculator.monthlyRepayment / interestRate3PerMth / (($scope.calculator.monthlyRepayment / interestRate3PerMth) - $scope.calculator.amtOwing)) / Math.log(1+interestRate3PerMth);           
          $scope.timeToRepayVal = cal1 / cal2;
 
          convertToYrsMths();                 /*LN(repay/interestMth/ ((repay/interestMth)-1000)) /LN(1+ interestMth)*/
       
       };

  }
]);
'use strict';

// Articles controller
angular.module('financial').controller('LoanCalculatorController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Users', '$q', 
  function($scope, $rootScope, $stateParams, $location, Authentication, Users, $q) {
      $scope.user = Authentication.user;

      $scope.monthlyRepaymentSum = 0;
      $scope.totalCostLoan = 0;
      $scope.results = 0;  

      $scope.principalAmtToBorrow = 0;  
      $scope.interestPaid = 0;  

      var year = 0;
      var month = 0;
      var yearMth = 0;
      var interestAmt = 0;
      var interestRatePerMth = 0;
      var repaymentOverInterest = 0;
      var cal1 = 0;
      var cal2 = 0;
      $scope.timeToRepay = '0 years 0 months';  

      $scope.isFormOpened = false;
      $scope.showChart = false;
      $scope.barData = [];
      $scope.barOptions = {};

      $scope.monthlyRepaymentSum2 = 0;
      $scope.totalCostLoan2 = 0;
      $scope.results2 = 0;

      $scope.principalAmtToBorrow2 = 0;  
      $scope.interestPaid2 = 0;  

      var year2 = 0;
      var month2 = 0;
      var yearMth2 = 0;
      var interestAmt2 = 0;
      var interestRatePerMth2 = 0;
      var repaymentOverInterest2 = 0;
      var cal12 = 0;
      var cal22 = 0;
      $scope.timeToRepay2 = '0 years 0 months';  


       
       var convertLoanTermToMonths = function() {
          return $scope.calculator.loanTermYears * 12;
        };
        
       var calculateResult = function() {
          $scope.results = $scope.totalCostLoan - $scope.calculator.amtBorrowed;
          
          $scope.showChart = true;

          /* Check if barData already have existing elements */
          if($scope.barData.length > 0){
            // update the array element 0 with the new value
            $scope.barData[0].val_0 = $scope.calculator.amtBorrowed;
            $scope.barData[0].val_1 = $scope.results;

          } else{
             /* Populate the chart data wih principal and interest amt */
              $scope.barData.push({x: 1, val_0: $scope.calculator.amtBorrowed, val_1: $scope.results});

              /* Set the barOptions */
              $scope.barOptions = {
                   axes: {
                      //x: {key: 'x', type: 'linear', labelFunction: function(value) {var labelStr = ""; if(value == 1){ labelStr = 'Repay $' + $scope.monthlyRepaymentSum.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' monthly';} else if(value == 2 && $scope.barData.length == 2){ labelStr = 'Repay $' + $scope.monthlyRepaymentSum2.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' monthly'; } return labelStr;}, ticks: $scope.barData.length + 1},
                      x: {key: 'x', type: 'linear', labelFunction: function() {return '';}, ticks: $scope.barData.length + 1},
                      y: {type: 'linear'}
                   },
      
                stacks: [
                  {
                    axis: 'y',
                    series: ['1', '2']
                  }
                ],
                lineMode: 'cardinal',
                series: [
                  {
                    id: '1',
                    y: 'val_0',
                    label: 'Principal',
                    type: 'column',
                    color: '#1f77b4'
                  },
                  {
                    id: '2',
                    y: 'val_1',
                    label: 'Interest (including fees)',
                    type: 'column',
                    color: '#d62728'
                  }
                ],
                tooltip: {mode: 'scrubber', formatter: function(x, y, series) {return series.label + ' : $' + y.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');}},
                columnsHGap: 20
              };
          }
        };
        

        var calculateTotalLoan = function() {
          $scope.totalCostLoan = $scope.monthlyRepaymentSum * $scope.loanTermMonths + $scope.calculator.fees;
          calculateResult();
        };
        
       $scope.calculateMonthyRepaymentSum = function() {
      
        /*if(!$scope.calculator2.amtBorrowed2.length || !$scope.calculator2.loanTermYears2.length || !$scope.calculator2.interestRate2.length || !$scope.calculator2.fees2.length){
              alert('no');
              $scope.loanTermMonths = convertLoanTermToMonths();
              $scope.monthlyRepaymentSum = $scope.calculator.amtBorrowed / ((1-(1/Math.pow((1+(($scope.calculator.interestRate / 100) / 12)), $scope.loanTermMonths))) / (($scope.calculator.interestRate / 100) / 12));
             // calculateTotalLoan();
             // $scope.loanTermMonths = convertLoanTermToMonths();
              $scope.monthlyRepaymentSum2 = $scope.calculator2.amtBorrowed2 / ((1-(1/Math.pow((1+(($scope.calculator2.interestRate2 / 100) / 12)), $scope.loanTermMonths))) / (($scope.calculator2.interestRate2 / 100) / 12));
              alert($scope.monthlyRepaymentSum2);
              calculateTotalLoan();

        } else{
              alert('test');*/
              /*if(!$scope.calculator2.amtBorrowed2.length){
                alert('yes');
              }else{
                alert('no');
              }*/
              $scope.loanTermMonths = convertLoanTermToMonths();
              $scope.monthlyRepaymentSum = $scope.calculator.amtBorrowed / ((1-(1/Math.pow((1+(($scope.calculator.interestRate / 100) / 12)), $scope.loanTermMonths))) / (($scope.calculator.interestRate / 100) / 12));
              calculateTotalLoan();
        //}

         
        };

        
        var calculateInterestPaid = function() {
          $scope.interestPaid = $scope.calculator.affordableRepayment * $scope.loanTermMonths - $scope.principalAmtToBorrow;
         
          $scope.showChart = true;

          /* Check if barData already have existing elements */
          if($scope.barData.length > 0){
            // update the array element 0 with the new value
            $scope.barData[0].val_0 = $scope.principalAmtToBorrow;
            $scope.barData[0].val_1 = $scope.interestPaid;

          } else{
             /* Populate the chart data wih principal and interest amt */
              $scope.barData.push({x: 1, val_0: $scope.principalAmtToBorrow, val_1: $scope.interestPaid});

              /* Set the barOptions */
              $scope.barOptions = {
                   axes: {
                      //x: {key: 'x', type: 'linear', labelFunction: function(value) {var labelStr = ""; if(value == 1){ labelStr = 'Repay $' + $scope.monthlyRepaymentSum.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' monthly';} else if(value == 2 && $scope.barData.length == 2){ labelStr = 'Repay $' + $scope.monthlyRepaymentSum2.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' monthly'; } return labelStr;}, ticks: $scope.barData.length + 1},
                      x: {key: 'x', type: 'linear', labelFunction: function() {return '';}, ticks: $scope.barData.length + 1},
                      y: {type: 'linear'}
                   },
      
                stacks: [
                  {
                    axis: 'y',
                    series: ['1', '2']
                  }
                ],
                lineMode: 'cardinal',
                series: [
                  {
                    id: '1',
                    y: 'val_0',
                    label: 'Principal',
                    type: 'column',
                    color: '#1f77b4'
                  },
                  {
                    id: '2',
                    y: 'val_1',
                    label: 'Interest',
                    type: 'column',
                    color: '#d62728'
                  }
                ],
                tooltip: {mode: 'scrubber', formatter: function(x, y, series) {return series.label + ' : $' + y.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');}},
                columnsHGap: 20
              };
          }
        };

       $scope.calculatePrincipalAmtToBorrow = function() {
          $scope.loanTermMonths = convertLoanTermToMonths();
                                                                                                                                              
          $scope.principalAmtToBorrow = ($scope.calculator.affordableRepayment / (($scope.calculator.interestRate / 100) / 12)) * (1-(1/(Math.pow(1+(($scope.calculator.interestRate / 100) / 12), $scope.loanTermMonths))));
          calculateInterestPaid();
        };

        var convertToYrsMths = function(){
          
          if ($scope.timeToRepayVal > 12) {
             yearMth = $scope.timeToRepayVal;
             year = Math.floor(yearMth / 12);
             month = Math.ceil(yearMth % 12);
            $scope.timeToRepay = year + ' years ' + month +  ' months';
            // Calculate interest
            interestAmt = $scope.calculator.monthlyRepayment * yearMth - $scope.calculator.amtOwing;
            

          } else {
              month = Math.ceil($scope.timeToRepayVal);
              $scope.timeToRepay = month +  ' months';
              // Calculate interest
             interestAmt = $scope.calculator.monthlyRepayment * month - $scope.calculator.amtOwing;
          }
             
          $scope.showChart = true;

          /* Check if barData already have existing elements */
          if($scope.barData.length > 0){
            // update the array element 0 with the new value
            $scope.barData[0].val_0 = $scope.calculator.amtOwing;
            $scope.barData[0].val_1 = interestAmt;
 
          } else{
             /* Populate the chart data wih principal and interest amt */
              $scope.barData.push({x: 1, val_0: $scope.calculator.amtOwing, val_1: interestAmt});

              /* Set the barOptions */
              $scope.barOptions = {
                   axes: {
                      x: {key: 'x', type: 'linear', labelFunction: function(value) {var labelStr = ''; if(value === 1){ labelStr = $scope.timeToRepay;} else if(value === 2 && $scope.barData.length === 2){ labelStr = $scope.timeToRepay2; } return labelStr;}, ticks: $scope.barData.length + 1},
                      //x: {key: 'x', type: 'linear', labelFunction: function() {return '';}, ticks: $scope.barData.length + 1},
                      y: {type: 'linear'}
                   },
      
                stacks: [
                  {
                    axis: 'y',
                    series: ['1', '2']
                  }
                ],
                lineMode: 'cardinal',
                series: [
                  {
                    id: '1',
                    y: 'val_0',
                    label: 'Principal',
                    type: 'column',
                    color: '#1f77b4'
                  },
                  {
                    id: '2',
                    y: 'val_1',
                    label: 'Interest',
                    type: 'column',
                    color: '#d62728'
                  }
                ],
                tooltip: {mode: 'scrubber', formatter: function(x, y, series) {return series.label + ' : $' + y.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');}},
                columnsHGap: 20
              };
          }

        };
  
        $scope.calculateTimeToRepay = function() {
 
          interestRatePerMth = (($scope.calculator.interestRate / 100) / 12).toFixed(6);         
          repaymentOverInterest = ($scope.calculator.monthlyRepayment / interestRatePerMth).toFixed(6);
          cal1 = (Math.log(repaymentOverInterest / (repaymentOverInterest - $scope.calculator.amtOwing)).toFixed(6));
          cal2 = (Math.log(1+Number(interestRatePerMth))).toFixed(6);
          
          //$scope.timeToRepayVal = Math.log($scope.calculator.monthlyRepayment / interestRate3PerMth / (($scope.calculator.monthlyRepayment / interestRate3PerMth) - $scope.calculator.amtOwing)) / Math.log(1+interestRate3PerMth);           
          $scope.timeToRepayVal = cal1 / cal2;
          convertToYrsMths();                 
       
       };


        $scope.showCompareForm = function() {

          if($scope.isFormOpened === false){
            $scope.isFormOpened = true;
          }else{
            $scope.isFormOpened = false;
          }

        };


        var calculateResult2 = function() {
          $scope.results2 = $scope.totalCostLoan2 - $scope.calculator2.amtBorrowed2;

          //$scope.showChart = true;

          /* Check if barData already have existing elements */
          if($scope.barData.length === 2){
            // update the array element 1 with the new value
            $scope.barData[1].val_0 = $scope.calculator2.amtBorrowed2;
            $scope.barData[1].val_1 = $scope.results2;

          } else{
            /* Populate the chart data wih principal and interest amt */
            $scope.barData.push({x: 2, val_0: $scope.calculator2.amtBorrowed2, val_1: $scope.results2});
            
            /* Dynamically set the number of ticks */
            $scope.barOptions.axes.x.ticks = $scope.barData.length + 1;
          }
        };

        

        var calculateTotalLoan2 = function() {
          $scope.totalCostLoan2 = $scope.monthlyRepaymentSum2 * $scope.loanTermMonthsCal2 + $scope.calculator2.fees2;
          calculateResult2();
        };

        var convertLoanTermToMonthsCal2 = function() {
          return $scope.calculator2.loanTermYears2 * 12;
        };


        $scope.calculateMonthyRepaymentSum2 = function() {
            $scope.loanTermMonthsCal2 = convertLoanTermToMonthsCal2();
            $scope.monthlyRepaymentSum2 = $scope.calculator2.amtBorrowed2 / ((1-(1/Math.pow((1+(($scope.calculator2.interestRate2 / 100) / 12)), $scope.loanTermMonthsCal2))) / (($scope.calculator2.interestRate2 / 100) / 12));
            calculateTotalLoan2();
        };


        var calculateInterestPaid2 = function() {
          $scope.interestPaid2 = $scope.calculator2.affordableRepayment2 * $scope.loanTermMonthsCal2 - $scope.principalAmtToBorrow2;
         
          /* Check if barData already have existing elements */
          if($scope.barData.length === 2){
            // update the array element 1 with the new value
            $scope.barData[1].val_0 = $scope.principalAmtToBorrow2;
            $scope.barData[1].val_1 = $scope.interestPaid2;

          } else{
            /* Populate the chart data wih principal and interest amt */
            $scope.barData.push({x: 2, val_0: $scope.principalAmtToBorrow2, val_1: $scope.interestPaid2});
            
            /* Dynamically set the number of ticks */
            $scope.barOptions.axes.x.ticks = $scope.barData.length + 1;
          }

        };

       $scope.calculatePrincipalAmtToBorrow2 = function() {
          $scope.loanTermMonthsCal2 = convertLoanTermToMonthsCal2();                                                                                                                                             
          $scope.principalAmtToBorrow2 = ($scope.calculator2.affordableRepayment2 / (($scope.calculator2.interestRate2 / 100) / 12)) * (1-(1/(Math.pow(1+(($scope.calculator2.interestRate2 / 100) / 12), $scope.loanTermMonthsCal2))));
          calculateInterestPaid2();
        };


        var convertToYrsMths2 = function(){
          
          if ($scope.timeToRepayVal2 > 12) {
             yearMth2 = $scope.timeToRepayVal2;
             year2 = Math.floor(yearMth2 / 12);
             month2 = Math.ceil(yearMth2 % 12);             
             $scope.timeToRepay2 = year2 + ' years ' + month2 +  ' months';
             //Calculate interest          
             interestAmt2 = $scope.calculator2.monthlyRepayment2 * yearMth2 - $scope.calculator2.amtOwing2;
            // interestAmt2 = $scope.calculator2.monthlyRepayment2 * (year2 * 12 + month2) - $scope.calculator2.amtOwing2;

          } else {
              month2 = Math.ceil($scope.timeToRepayVal2);
              $scope.timeToRepay2 = month2 +  ' months';
              // Calculate interest
              interestAmt2 = $scope.calculator2.monthlyRepayment2 * month2 - $scope.calculator2.amtOwing2;
          }

          /* Check if barData already have existing elements */
          if($scope.barData.length === 2){
            // update the array element 1 with the new value
            $scope.barData[1].val_0 = $scope.calculator2.amtOwing2;
            $scope.barData[1].val_1 = interestAmt2;

          } else{         
            /* Populate the chart data wih principal and interest amt */
            $scope.barData.push({x: 2, val_0: $scope.calculator2.amtOwing2, val_1: interestAmt2});
            /* Dynamically set the number of ticks */
            $scope.barOptions.axes.x.ticks = $scope.barData.length + 1;
          }


        };
  
        $scope.calculateTimeToRepay2 = function() {
        
          interestRatePerMth2 = (($scope.calculator2.interestRate2 / 100)/ 12).toFixed(6);
          repaymentOverInterest2 = ($scope.calculator2.monthlyRepayment2 / interestRatePerMth2).toFixed(6);
          cal12 = (Math.log(repaymentOverInterest2 / (repaymentOverInterest2 - $scope.calculator2.amtOwing2)).toFixed(6));
          cal22 = (Math.log(1+Number(interestRatePerMth2))).toFixed(6);
          
          //$scope.timeToRepayVal = Math.log($scope.calculator.monthlyRepayment / interestRate3PerMth / (($scope.calculator.monthlyRepayment / interestRate3PerMth) - $scope.calculator.amtOwing)) / Math.log(1+interestRate3PerMth);           
          $scope.timeToRepayVal2 = cal12 / cal22;
 
          convertToYrsMths2();                   
       
       };

      
  }
]);

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

		    		$scope.user.mileStones[i] = {
		    			goalTitle: goalTitle,
		    			goalType: goalType,
		    			currentAmount: currentAmount,
		    			targetAmount: targetAmount,
		    			startDate: startDate,
		    			startDateFormatted: startDateFormatted,
		    			targetDate: targetDate,
		    			targetDateFormatted: targetDateFormatted,
		    			progress: progress,
		    			paymentAmountAdj: paymentAmountAdj,
		    			monthsLeft: monthsLeft};				
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

					var goalObj = {
						goalTitle: goalTitle,
						goalType: goalType,
						currentAmount: currentAmount,
						targetAmount: targetAmount,
						startDate: startDate,
						startDateFormatted: startDateFormatted,
						targetDate: targetDate,
						targetDateFormatted: targetDateFormatted,
						progress: progress};

					
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
				
				$scope.user.mileStones[$scope.user.updateMilestonePos] = {
					goalTitle: goalTitle,
					goalType: goalType,
					currentAmount: currentAmount,
					targetAmount: targetAmount,
					startDate: startDate,
					startDateFormatted: startDateFormatted,
					targetDate: targetDate,
					targetDateFormatted: targetDateFormatted,
					progress: progress};

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
'use strict';

// Authentication service for user variables
angular.module('milestones').factory('MilestoneService', ['$resource', function($resource){
	var qnsTitle = {
			1:'Name',
			//qnModel: 'user.gender',
			2:'Description'
	};		
	
	var qnsType = {
		1:'Goal Type',
			//qnModel: 'user.age',
		2:'Type of Goal',
		3:'Savings', 
		4:'Retirement', 
		5:'Education'
	};

	var qnsTargetAmount = {
		1:'targetAmount',
		2:'Target Amount to Save'
	};		


	var qnsCurrentAmount = {
		1:'currentAmount',
		2:'Amount Saved Currently'
	};

	var qnsTargetDate = {

		1:'targetDate',
		2:'Target Date'

	};


	return {
		qnsTitle: function(){
			return qnsTitle;
		},
		qnsType: function(){
			return qnsType;
		},
		qnsTargetAmount: function(){
			return qnsTargetAmount;
		},
		qnsCurrentAmount: function(){
			return qnsCurrentAmount;
		},
		qnsTargetDate: function(){
			return qnsTargetDate;
		}
	};

}]);
'use strict';

// Setting up route
angular.module('social').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('viewProfile', {
			url: '/social/:profileId',
			templateUrl: 'modules/social/views/view-profile.client.view.html'
		}).
     //  	state('posts', {
	    //     abstract: true,
	    //     url: '/posts',
	    //     template: '<ui-view/>'
	    // }).
	    // state('postslist', {
	    //     url: '',
	    //     templateUrl: 'modules/social/views/list-post.client.view.html'
	    // }).
	    state('postView', {
	    	url: '/post/:postId',
	        templateUrl: 'modules/social/views/view-post.client.view.html'
	    }).
	    state('postEdit', {
	    	url: '/post/:postId/edit',
	        templateUrl: 'modules/social/views/edit-post.client.view.html'
	    }).
	    state('postsCreate', {
	        url: '/posts/create',
	        templateUrl: 'modules/social/views/create-post.client.view.html'
	       //  data: {
	       //    roles: ['user', 'admin']
	      	// }
      	});
	}
]);
'use strict';

// Articles controller
angular.module('social').controller('PostsController', ['$scope', '$stateParams','$state', '$location','$window', 'Authentication', '$http', 'Post','$anchorScroll',
	function($scope, $stateParams,$state, $location,$window, Authentication, $http, Post,$anchorScroll) {
		$scope.user = Authentication.user;
		if (!$scope.user) $location.path('/');

		$scope.postFilter = 'public';
		$scope.imageUrl = 'https://hexapic.s3.amazonaws.com/';

		$scope.changeColor = function(menu, bool) {
		    if(bool === true) {
		        $scope.menuColor = {'background-color': '#B8A631', 'color': 'white'};
		    } else if (bool === false) {
		        $scope.menuColor = {'background-color': 'white', 'color':'black'}; //or, whatever the original color is
		    }
		};

		$scope.newPost = function(){
			$location.path('/posts/create');
			// $scope.post.privacy = 'public';
		};

		$scope.createPost = function () {
	    	// Create new Article object
	    	var post = new Post({
		    	title: this.title,
		        content: this.content,
		        privacy: this.privacy
		    });
	    	console.log(post);
			$http.post('/api/posts', post).success(function(response){
		        // $location.path('/post/' + response._id);
		  		$window.location.reload();
		        $location.path('/social/posts');
		        // Clear form fields
		        $scope.title = '';
		        $scope.content = '';
			}).error(function(){
				console.log('Problem with posting');
			});	
	    };
		$scope.editPost = function () {
			var postURL = '/api/posts/' + $stateParams.postId;
			var viewPostURL = '/post/' + $stateParams.postId;
			console.log($scope.post.content);
	    	// Create new Article object
	    	var post = new Post({
		    	title: $scope.post.title,
		        content: $scope.post.content,
		        privacy: $scope.post.privacy
		    });
	    	console.log('before');
			$http.put(postURL, post).success(function(response){
		        // $location.path('/post/' + response._id);
		        $location.path(viewPostURL);
		      	console.log(response);

		        // Clear form fields
		        $scope.title = '';
		        $scope.content = '';
			}).error(function(response){
				console.log(response);
			});	
	    };

	    $scope.remove = function() {
			var postURL = '/api/posts/' + $stateParams.postId;
			$http.delete(postURL).then(function(response){
				$location.path('/socialPost');
				$scope.post = response.data;
			});	
	    };

	    $scope.findOne = function(){
			var userURL = '/api/posts/' + $stateParams.postId;
			$http.get(userURL).then(function(response){
				$scope.post = response.data;
			});	
	    };


	    $scope.findPostsPublic = function () {
	    	$anchorScroll();
	    	$scope.posts = Post.query();
	    };
	    $scope.findPostsFriends = function () {
	    	$anchorScroll();
			$http.get('/api/postsByFriends').then(function(response){
				$scope.posts = response.data;
			});  	
	    };
	    $scope.findPostsPersonal = function () {
	    	$anchorScroll();
			$http.get('/api/postsByMe').then(function(response){
				$scope.posts = response.data;
			});
	    };

	    $scope.addComment = function(){
	    	console.log($scope.comment);
	    	console.log($stateParams.postId);
	    	$http.put('/api/commentPost', {postId: $stateParams.postId, comment: $scope.comment}).success(function(response){
	    		console.log(response);
	    		$scope.post = response;
	    		// $window.location.reload();
	    		$scope.comment = '';
	    	}).error(function(){
	    		console.log('There is an error adding comments');
	    	});
	    };

	    $scope.editComment = function(commentContent, comment) {
	    	console.log('here');
	    	console.log(commentContent);
	    	console.log($stateParams.postId);
	    	console.log(comment);
	    	$scope.editCmt = !$scope.editCmt;
	    	$http.put('/api/editComment', {postId: $stateParams.postId, comment: commentContent, commentId : comment._id}).success(function(response){
	    		console.log(response);
	    		$scope.post = response;
	    		// $window.location.reload();
	    	}).error(function(){
	    		console.log('There is an error editing comments');
	    	});    	
	    };
	    $scope.removeComment = function(comment){
	    	console.log(comment);
	    	$http.put('/api/removeComment', {postId: $stateParams.postId, commentId: comment._id}).success(function(response){
	    		console.log(response);
	    		$scope.post = response;
	    	}).error(function(){
	    		console.log('There is an error deleting comment');
	    	});
	    };

	    $scope.upPost = function(postId){
	    	$scope.posts.forEach(function(post){
	    		if(post._id === postId){
	    			console.log(post.upVote);
	    			var uidFound = false;
	    			post.upVote.forEach(function(uId){
	    				if($scope.user._id === uId){
	    					uidFound = true;
		    				$http.put('/api/downPost', {postId: postId, postFilter: $scope.postFilter}).success(function(response){
					  			$scope.posts = response;

					  		}).error(function(){
					  			console.log('There is an error upvoting');
					  		});
	    				}
	    			});
	    			if(uidFound === false){
	    				$http.put('/api/upPost', {postId: postId, postFilter: $scope.postFilter}).success(function(response){
				  			$scope.posts = response;
				  		}).error(function(){
				  			console.log('There is an error upvoting');
				  		});
	    			}
	    		}
	    	});
	    };

	    $scope.upOnePost = function(postId){
			var uidFound = false;
			$scope.post.upVote.forEach(function(uId){
				if($scope.user._id === uId){
					uidFound = true;
    				$http.put('/api/downOnePost', {postId: postId, postFilter: $scope.postFilter}).success(function(response){
			  			$scope.post = response;
			  		}).error(function(){
			  			console.log('There is an error upvoting');
			  		});
				}
			});
			if(uidFound === false){
				$http.put('/api/upOnePost', {postId: postId, postFilter: $scope.postFilter}).success(function(response){
		  			$scope.post = response;
		  		}).error(function(){
		  			console.log('There is an error upvoting');
		  		});
			}
	    };

	}
]);
'use strict';

// Articles controller
angular.module('social').controller('SocialController', ['$scope', '$window','$stateParams','$state', '$location', 'Authentication', '$http', 'UserProfile', '$anchorScroll', 
	function($scope,$window, $stateParams, $state, $location, Authentication, $http, UserProfile, $anchorScroll) {
		$scope.user = Authentication.user;
		if (!$scope.user) $location.path('/');

		$scope.userList = [];
		$scope.friendList = [];
		$scope.sentFriendReqList = [];
		$scope.pendingReqList = [];

		$scope.imageUrl = 'https://hexapic.s3.amazonaws.com/';
		$scope.yearJoined = new Date($scope.user.created).getFullYear();

		var socialRankUrl = 'https://hexapic.s3.amazonaws.com/' + Authentication.user.socialRankPic;
		var profilePicUrl = 'https://hexapic.s3.amazonaws.com/' + Authentication.user.profilePic;

		$scope.decachedSocialRankUrl = socialRankUrl + '?decache=' + Math.random();		
		$scope.decachedProfilePicUrl = profilePicUrl + '?decache=' + Math.random();

		$scope.refreshSocialRankPic = function(){
				$scope.decachedSocialRankUrl = socialRankUrl + '?decache=' + Math.random();
		};
		if(!$scope.user.age){
			$scope.profileAge = 'N/A';
		} else{
			$scope.profileAge = $scope.user.age;
		}
		if(!$scope.user.description){
			$scope.profileDescription = 'N/A';
		} else{
			$scope.profileDescription = $scope.user.description;
		}
		$scope.numFriends = 0;
		if($scope.user.friendList){
			$scope.user.friendList.forEach(function(friend){
				if(friend.friendStatus === 3) $scope.numFriends++;
			});			
		}

		$scope.findAll = function(){
			$http.get('/friendship/retrieveUsers').then(function(response){
				$scope.userList = response.data;
			});
		};
		$scope.findFriends = function(){
			$http.get('/friendship/retrieveFriends').then(function(response){
				var listOfUsers = response.data;
				listOfUsers.forEach(function(user){
					if(user.friendStatus === 3){
						$scope.friendList.push(user);
					}else if (user.friendStatus === 2){
						$scope.pendingReqList.push(user);
					}else if(user.friendStatus === 1){
						$scope.sentFriendReqList.push(user);
					}
				});
			});
		};
		$scope.addFriend = function(friendEmail, friendId){
			console.log(friendEmail);
			console.log('friends' + friendId);
			$http.put('/friendship/addFriend', {friendEmail: friendEmail, friendId: friendId}).success(function(response){
				console.log(response);
				$scope.userList.forEach(function(user){
					if(user.email === friendEmail) user.friendStatus = 1;
				});
				$scope.userProfile.friendStatus = 1;
			}).error(function(){
				console.log('error adding friends');
			});
		};

		$scope.acceptFriend = function(friendEmail, friendId){
			$http.put('/friendship/acceptFriend', {friendEmail: friendEmail, friendId: friendId}).success(function(response){
				console.log(response);
				$scope.userList.forEach(function(user){
					if(user.email === friendEmail) user.friendStatus = 3;
				});
				$window.location.reload();
			}).error(function(){
				console.log('error adding friends');
			});	
		};
		$scope.findOne = function(){
			console.log( $stateParams.profileId);
			var userURL = '/api/social/' + $stateParams.profileId;
			$http.get(userURL).then(function(response){
				console.log(response);
				$scope.userProfile = response.data;

				$scope.userProfile.friendList.num = 0;
				$scope.userProfile.friendList.forEach(function(friend){
					if(friend.friendStatus === 3){
						$scope.userProfile.friendList.num = $scope.userProfile.friendList.num + 1;
					}
				});
				findProfilePosts($scope.userProfile);
			});			
		};

		var findProfilePosts = function(userProfile){
	    	$anchorScroll();
			$http.get('/api/postsByUser', {params: {_id: userProfile._id}}).then(function(response){
				console.log(response);
				$scope.posts = response.data;

			});		
	    };

	    $scope.changeColor = function(menu, bool) {
		    if(bool === true) {
		        $scope.menuColor = {'background-color': '#B8A631', 'color': 'white'};
		    } else if (bool === false) {
		        $scope.menuColor = {'background-color': 'white', 'color':'black'}; //or, whatever the original color is
		    }
		};

	    $scope.upPost = function(postId, userProfile){
	    	$scope.posts.forEach(function(post){
	    		if(post._id === postId){
	    			console.log(post.upVote);
	    			var uidFound = false;
	    			post.upVote.forEach(function(uId){
	    				if($scope.user._id === uId){
	    					uidFound = true;
		    				$http.put('/api/downUserPosts', {_id: userProfile._id, postId: postId}).success(function(response){
					  			$scope.posts = response;
					  			console.log(response);
					  		}).error(function(){
					  			console.log('There is an error upvoting');
					  		});
	    				}
	    			});
	    			if(uidFound === false){
	    				$http.put('/api/upUserPosts', {_id: userProfile._id,postId: postId}).success(function(response){
				  			$scope.posts = response;
				  		}).error(function(){
				  			console.log('There is an error upvoting');
				  		});
	    			}
	    		}
	    	});
	    };

	    

	}
]);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('social').factory('Post', ['$resource',
  function ($resource) {
    return $resource('api/posts/:postId', {
      postId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('social').factory('UserProfile', ['$resource',
  function ($resource) {
    return $resource('/api/social/:profileId', {
      profileId: '@userObjectId'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			/*templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'*/

			templateUrl: 'modules/users/views/settings/profileSettings.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('questionnaire', {
			url: '/settings/questionnaire',
			templateUrl: 'modules/users/views/settings/questionnaire.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('errorsignin', {
			url: '/errorsignin',
			templateUrl: 'modules/users/views/authentication/errorsignin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('adminHome', {
			url: '/admin/home',
			templateUrl: 'modules/admin/views/admin-home.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);

angular.module('users').directive('dynamicModel', ['$compile', function ($compile) {
    return {
        'link': function(scope, element, attrs) {
            scope.$watch(attrs.dynamicModel, function(dynamicModel) {
                if (attrs.ngModel === dynamicModel || !dynamicModel) return;

                element.attr('ng-model', dynamicModel);
                if (dynamicModel === '') {
                    element.removeAttr('ng-model');
                }

                // Unbind all previous event handlers, this is 
                // necessary to remove previously linked models.
                element.unbind();
                $compile(element)(scope);
            });
        }
    };
}]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', '$timeout', '$window',
	function($scope, $http, $location, Authentication, $timeout, $window) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		// if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/settings/questionnaire');

			}).error(function(response) {
				
				$scope.error = response.message;
				
			});
		};


		$scope.signin = function() {

			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				var completeQns = $scope.authentication.user.completeQns;

				// And redirect to the index page
				var userType = $scope.authentication.user.roles;
				if (userType[0].localeCompare('admin') === 0) {
					$location.path('/admin/home');
				}else{
					if (!completeQns)$location.path('/settings/questionnaire');
					else $location.path('/home');					
				}
				$window.location.reload();
				// getNotification();
			}).error(function(response) {
				
				$scope.error = response.message;
				
			});
		};
	

		$scope.initRedirectLogin = function() {
			$timeout(function() {
				$location.path('/signin');
			}, 5000);
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('QuestionnaireController', ['$scope', '$stateParams', '$http', '$location', 'Users', 'Authentication', 'QuestionnaireService', 'CreditService',
	function($scope, $stateParams, $http, $location, Users, Authentication, QuestionnaireService, CreditService) {
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;	
		//Check for authentication
		if (!$scope.user) $location.path('/');
		this.$setScope = function(context) {
     		$scope = context;
		};
		//Questions
		$scope.oneAtATime = false;

		$scope.qnsPersonal = QuestionnaireService.qnsPersonal;
		$scope.qnsJob = QuestionnaireService.qnsJob;
		$scope.qnsFinance = QuestionnaireService.qnsFinance;

		$scope.clearSuccessMessage = function() {
			$scope.success = false;
			$scope.error = '';
		};
		$scope.addItem = function() {
		    var newItemNo = $scope.items.length + 1;
		    $scope.items.push('Item ' + newItemNo);
		};

		$scope.status = {
		    isFirstOpen: true,
		    isFirstDisabled: false
		};

		$scope.questions = [];

		
		$scope.updateUserQns = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
				verifyAllQnsCompleted(user);
				user.$update(function(response) {
					$scope.success = true;
					
					Authentication.user = response;
					$scope.user = Authentication.user;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}	
		};

		var verifyAllQnsCompleted = function(user){
			var personalRes = verifyQnsPersonalCompleted(user);
			var jobRes = verifyQnsJobCompleted(user);
			var financeRes = verifyQnsFinanceCompleted(user);

			if(personalRes.completePersonalQns === true && jobRes.completeJobQns === true && financeRes.completeFinanceQns === true) user.completeQns = true;
			user.currentCreditRating = personalRes.personalScore + jobRes.jobScore + financeRes.financeScore;

			user.creditGrade = CreditService.creditGrade(user.currentCreditRating);


		};

			/*
			user.completeQns = completePersonalQns;
			user.currentCreditRating = personalScore;
			*/		
		var verifyQnsPersonalCompleted = function(user){
			var completePersonalQns = true;
			var personalScore = 0;

			if(user.creditProfileScore.sGender === null || user.creditProfileScore.sGender === undefined) completePersonalQns = false;
			else {
				personalScore += Number(user.creditProfileScore.sGender);
				if(Number(user.creditProfileScore.sGender) === 1){
					user.gender = 'Male';
				} else user.gender = 'Female';
			}
			
			if(user.creditProfileScore.sAge === null || user.creditProfileScore.sAge === undefined) completePersonalQns = false;
			else personalScore += Number(user.creditProfileScore.sAge);

			if(user.creditProfileScore.sEducationLevel === null || user.creditProfileScore.sEducationLevel === undefined) completePersonalQns = false;
			else {
				personalScore += Number(user.creditProfileScore.sEducationLevel);
				if(Number(user.creditProfileScore.sEducationLevel) === 5){
					user.educationLevel = 'PhD';
				} else if(Number(user.creditProfileScore.sEducationLevel) === 4) {
					user.educationLevel = 'Masters';
				} else if (Number(user.creditProfileScore.sEducationLevel) === 3) {
					user.educationLevel = 'Graduate';
				} else if (Number(user.creditProfileScore.sEducationLevel) === 2) {
					user.educationLevel = 'Undergraduate';
				} else if (Number(user.creditProfileScore.sEducationLevel) === 1){
					user.educationLevel = 'A/O/N Levels';
				} else user.educationLevel = 'PSLE';
			}
			
			if(user.creditProfileScore.sMaritalStatus === null || user.creditProfileScore.sMaritalStatus === undefined) completePersonalQns = false;
			else {
				personalScore += Number(user.creditProfileScore.sMaritalStatus);		
				if(Number(user.creditProfileScore.sMaritalStatus) === 3) user.maritalStatus = 'Married';
			}
			
			if(user.creditProfileScore.sLocativeSituation === null || user.creditProfileScore.sLocativeSituation === undefined) completePersonalQns = false;
			else personalScore += Number(user.creditProfileScore.sLocativeSituation);	

			if(user.creditProfileScore.sLocativeType === null || user.creditProfileScore.sLocativeType === undefined) completePersonalQns = false;
			else personalScore += Number(user.creditProfileScore.sLocativeType);
			console.log(personalScore);

			if(user.creditProfileScore.sNoOfDependents === null || user.creditProfileScore.sNoOfDependents === undefined) completePersonalQns = false;
			else {
				personalScore += Number(user.creditProfileScore.sNoOfDependents);
				if (Number(user.creditProfileScore.sNoOfDependents) === 3){
					user.noOfDependents = 0;
				} else if (Number(user.creditProfileScore.sNoOfDependents) === 2){
					user.noOfDependents = 1;
				} else if (Number(user.creditProfileScore.sNoOfDependents) === 1){
					user.noOfDependents = 2;
				}
			}	

			user.completePersonalQns = completePersonalQns;
			user.personalRating = personalScore;
			return {
				completePersonalQns: completePersonalQns,
				personalScore: personalScore
			};
		};

		var verifyQnsJobCompleted = function(user){
			var completeJobQns = true;
			var jobScore = 0;
			if(user.creditProfileScore.sCurrentOccupation === null || user.creditProfileScore.sCurrentOccupation === undefined) completeJobQns = false;
			else {
				jobScore += Number(user.creditProfileScore.sCurrentOccupation);
				if(Number(user.creditProfileScore.sCurrentOccupation) === 3){
					user.currentOccupation = 'Salaried Employee';
				} else if (Number(user.creditProfileScore.sCurrentOccupation) === 2){
					user.currentOccupation = 'Businessman/Self-employed';
				} else if (Number(user.creditProfileScore.sCurrentOccupation) === 1){
					user.currentOccupation = 'Student';
				}else user.currentOccupation = 'Unemployed';
			}

			if(user.creditProfileScore.sCurrentWorkPeriod === null || user.creditProfileScore.sCurrentWorkPeriod === undefined) completeJobQns = false;
			else jobScore += Number(user.creditProfileScore.sCurrentWorkPeriod);
			if(user.creditProfileScore.sLastWorkPeriod === null || user.creditProfileScore.sLastWorkPeriod === undefined) completeJobQns = false;
			else jobScore += Number(user.creditProfileScore.sLastWorkPeriod);	

			user.completeJobQns = completeJobQns;
			user.jobRating = jobScore;
			return {
				completeJobQns: completeJobQns,
				jobScore: jobScore
			};
		};

		var verifyQnsFinanceCompleted = function(user){
			var completeFinanceQns = true;
			var financeScore = 0;
			if(user.creditProfileScore.sMonthlyIncome === null || user.creditProfileScore.sMonthlyIncome === undefined) completeFinanceQns = false;
			else financeScore += Number(user.creditProfileScore.sMonthlyIncome);
			if(user.creditProfileScore.sMonthlyExpense === null || user.creditProfileScore.sMonthlyExpense === undefined) completeFinanceQns = false;
			else financeScore += Number(user.creditProfileScore.sMonthlyExpense);
			if(user.creditProfileScore.sMonthlySavings === null || user.creditProfileScore.sMonthlySavings === undefined) completeFinanceQns = false;
			else financeScore += Number(user.creditProfileScore.sMonthlySavings);
			if(user.creditProfileScore.sCreditHistory === null || user.creditProfileScore.sCreditHistory === undefined) completeFinanceQns = false;
			else financeScore += Number(user.creditProfileScore.sCreditHistory);		
			if(user.creditProfileScore.sBankruptStatus === null || user.creditProfileScore.sBankruptStatus === undefined) completeFinanceQns = false;
			else financeScore += Number(user.creditProfileScore.sBankruptStatus);	
			if(user.creditProfileScore.sNumberOfCreditCards === null || user.creditProfileScore.sNumberOfCreditCards === undefined) completeFinanceQns = false;
			else financeScore += Number(user.creditProfileScore.sNumberOfCreditCards);	

			user.completeFinanceQns = completeFinanceQns;
			user.financeRating = financeScore;
			return {
				completeFinanceQns: completeFinanceQns,
				financeScore: financeScore
			};
		};
		
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$rootScope','$scope', '$http','$state','$timeout' ,'$location', 'Users', 'Authentication', 'Upload',
	function($rootScope, $scope, $http, $state, $timeout,$location, Users, Authentication, Upload) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		var originalUserData = angular.copy(Authentication.user);

		$scope.decachedImageUrl = '/img/default_avatar.jpg';
		if($scope.user.profilePic){
			var imageUrl = 'https://hexapic.s3.amazonaws.com/' + Authentication.user.profilePic;
			$scope.decachedImageUrl = imageUrl + '?decache=' + Math.random();
		}
		$scope.stuff ='';
		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.reset = function(){
			$scope.success = $scope.error = null;
			$scope.user = Authentication.user;
		};

		$scope.cancel = function(){
			// $location.path('/settings/profile');
			$scope.user = originalUserData;
			$scope.submitted = false;
		};

		// Update a user profile
		$scope.updateUserProfilePersonal = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				$scope.user.updatedProfileSettings = true;

				try{
					var birthYear = $scope.user.dateOfBirth.getFullYear();
					var birthMonth = $scope.user.dateOfBirth.getMonth();
					var birthDate = $scope.user.dateOfBirth.getDate();
					var currDate = new Date();
					var currYear = currDate.getFullYear();
					var currMonth = currDate.getMonth();
					var currDay = currDate.getDate();

					if(birthMonth < currMonth || birthMonth === currMonth && birthDate <= currDay){
						$scope.user.age = currYear -birthYear;
					}else {
						$scope.user.age = currYear - birthYear - 1;
					}					
				}catch(e){
					console.log('no change in date');
				}



				if($scope.user.gender === 'Male'){
					$scope.user.sGender = 1;
				} else {
					$scope.user.sGender = 0;
				}

				var user = new Users($scope.user);
				
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
					$scope.user = Authentication.user;
				}, function(response) {
					$scope.error = response.data.message;
				});
				console.log(user);
			} else {
				$scope.submitted = true;
			}
		};

		$scope.updateUserProfileWork = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				$scope.user.updatedProfileSettings = true;

				var user = new Users($scope.user);
				
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
					$scope.user = Authentication.user;
				}, function(response) {
					$scope.error = response.data.message;
				});
				console.log(user);
			} else {
				$scope.submitted = true;
			}
		};

		$scope.updateUserProfilePrivacy = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				$scope.user.updatedProfileSettings = true;

				var user = new Users($scope.user);
				
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
					$scope.user = Authentication.user;
				}, function(response) {
					$scope.error = response.data.message;
				});
				console.log(user);
			} else {
				$scope.submitted = true;
			}
		};
		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Upload functions
      
		var upload_file = function(file, signed_request, url){

			$http.put(signed_request, file).success(function(response) {
				$scope.decachedImageUrl = url + '?decache=' + Math.random();
				$rootScope.profileImgUrl = url + '?decache=' + Math.random();
				$state.go($state.current, {}, {reload: true});
			}).error(function(response) {
				alert('Could not upload file.'); 
			});

		};

		/*
		    Function to get the temporary signed request from the app.
		    If request successful, continue to upload the file using this signed
		    request.
		*/

		var get_signed_request = function(file){
		    //var xhr = new XMLHttpRequest();
		    var url = 'https://hexapic.s3.amazonaws.com/sign_s3?file_name='+$scope.user.profilePic+'&file_type='+file.type;
		    console.log(file);
		    $http.get('/signaws', file).success(function(response) {
				// If successful 
				upload_file(file, response.signed_request, response.url);
			}).error(function(response) {
				alert('Could not get signed URL.');
			});
		};

		var appendPic = function(file){
			// $scope.user.profilePic = file.name;
			var str = angular.copy($scope.user.email).split('@');
			$scope.user.profilePic = str[0];
			$scope.user.profilePicType = file.type;
			var user = new Users($scope.user);
			
			user.$update(function(response) {
				Authentication.user = response;
				get_signed_request(file);
			}, function(response) {
				$scope.error = response.data.message;
			});
			console.log(user);
		};

	    $scope.upload = function (file) {
	    	appendPic(file);  
	    };

	    $scope.ngGridFix = function() {
    		window.dispatchEvent(new Event('resize'));
		};

	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window', function($window) {
	var auth = {
		user: $window.user
	};
	
	return auth;
}]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('CreditService', function() {
	var analysis = ['N/A', 'Profile not completed'];
	var creditGrade = function(creditRating){
		if(creditRating > 57 && creditRating < 65){
			analysis = ['A', 'Excellent - You have the characteristics of people who show the lowest possible risk and banks considers your credit to be of the highest quality. You show no default risk due to highest credit score. Chances of getting a loan is high.'];
		}else if(creditRating > 47 && creditRating < 58){
			analysis = ['B', 'Good - People with a Grade B credit score shows lowest default risk because of high credit score and have good quality of loan applications. Chances of getting a loan will be above average.'];
		}else if(creditRating > 31 && creditRating < 48){
			analysis = ['C', 'Average - Grade ‘C’ represents medium level of default/ credit risk as having average level of credit score and having an average quality of loan application. Chances of getting a loan will be low.'];
		}else if (creditRating >0 && creditRating < 32){
			analysis = ['D', 'Below Average - Grade ‘D’ indicates the high level of risk and also having below average credit score. People with this grade will not be qualified for loan by banks.'];
		}
		return analysis;
	};
	
	return {
		creditGrade: creditGrade
	};
});
'use strict';

// Authentication service for user variables
angular.module('users').factory('QuestionnaireService', ['$resource', function($resource){
	var qnsPersonal = [
		{
			qnID: 'gender',
			qnModel: 'user.creditProfileScore.sGender', // TO update 
			content: 'What is your Gender?',
			options: ['Male', 'Female'],
			rating: {
				'Male': 1,
				'Female': 0
			}
		},
		{
			qnID: 'age',
			qnModel: 'user.creditProfileScore.sAge',
			content: 'What is your Age?',
			options: ['Between 20 and 30 years', 'Between 30 and 40 years', 'Between 40 and 50 years', 'Between 50 and 60 years', 'Above 60 years'],
			rating: {
				'Between 20 and 30 years': 4,
				'Between 30 and 40 years': 3,
				'Between 40 and 50 years': 2,
				'Between 50 and 60 years': 1,
				'Above 60 years': 0
			}

		},
		{
			qnID: 'educationLevel',
			qnModel: 'user.creditProfileScore.sEducationLevel', // To Update
			content: 'What is your Highest Education Level?',
			options: ['PhD', 'Masters', 'Graduate', 'Undergraduate', 'A/O/N Levels', 'PSLE & Below'],
			rating: {
				'PhD': 5,
				'Masters': 4,
				'Graduate': 3,
				'Undergraduate': 2,
				'A/O/N Levels': 1,
				'PSLE': 0
			}

		},
		{
			qnID: 'maritalStatus',
			qnModel: 'user.creditProfileScore.sMaritalStatus', //To Update
			content: 'What is your Marital Status?',
			options: ['Married', 'Single/Divorced/Widowed'],
			rating: {
				'Married': 3,
				'Single/Divorced/Widowed': 1
			}

		},
		{
			qnID: 'locativeType',
			qnModel: 'user.creditProfileScore.sLocativeType',
			content: 'What is your highest value housing that you currently own?',
			options: ['Landed Property', 'Condo/Private Apartments', 'HDB Executive Flats/ HUDC Flats/ Studio Apartments', 'HDB (Others)', 'Shop houses/ other housing units', 'N/A'],
			rating: {
				'Landed Property': 5,
				'Condo/Private Apartments': 4,
				'HDB Executive Flats/ HUDC Flats/ Studio Apartments': 3,
				'HDB (Others)': 2, 
				'Shop houses/ other housing units': 1,
				'N/A': 0
			}

		},
		{
			qnID: 'locativeSituation',
			qnModel: 'user.creditProfileScore.sLocativeSituation',
			content: 'What is your current ownership status?',
			options: ['Own house', 'Personal apartment', 'Parents apartment', 'Rent'],
			rating: {
				'Own house': 3,
				'Personal apartment': 2,
				'Parents apartment': 1,
				'Rent': 0
			}

		},
		{
			qnID: 'noOfDependents',
			qnModel: 'user.creditProfileScore.sNoOfDependents', //To Update
			content: 'How many Dependents do you have?',
			options: ['0 person', '1 person', '2 persons', '3 or more persons'],
			rating: {
				'0 person': 3,
				'1 person': 2,
				'2 persons': 1,
				'3 or more persons': 0
			}

		}
	];

	var qnsJob = [
		{
			qnID: 'currentOccupation',
			qnModel: 'user.creditProfileScore.sCurrentOccupation', //To Update
			content: 'What is your current occupation?',
			options: ['Salaried Employee', 'Businessman/Self-employed', 'Student', 'Unemployed'],
			rating: {
				'Salaried Employee': 3,
				'Businessman/Self-employed': 2,
				'Student': 1,
				'Unemployed': 0
			}
		},
		{
			qnID: 'currentWorkPeriod',
			qnModel: 'user.creditProfileScore.sCurrentWorkPeriod', 
			content: 'How long have you been with your current employer?',
			options: ['Greater than 5 years', 'Between 2 and 5 years', 'Between 1 and 2 years', 'Retired', 'NA'],
			rating: {
				'Greater than 5 years': 4,
				'Between 2 and 5 years': 3,
				'Between 1 and 2 years': 2,
				'Retired': 1,
				'NA': 0
			}

		},
		{
			qnID: 'lastWorkPeriod',
			qnModel: 'user.creditProfileScore.sLastWorkPeriod',
			content: 'How long have you been with your previous employer?',
			options: ['Greater than 5 years', 'Between 2 and 5 years', 'Between 1 and 2 years', 'Retired', 'NA'],
			rating: {
				'Greater than 5 years': 4,
				'Between 2 and 5 years': 3,
				'Between 1 and 2 years': 2,
				'Retired': 1,
				'NA': 0
			}

		}
	];

	var qnsFinance = [
		{
			qnID: 'monthlyIncome',
			qnModel: 'user.creditProfileScore.sMonthlyIncome',
			content: 'What is your average monthly Net Income?',
			options: ['Above $10,000', 'Between $8,000 and $10,000', 'Between $6,000 and $8,000', 'Between $4,000 and $6,000', 'Between $1,000 and $4,000', 'Less than $1,000', 'NA'],
			rating: {
				'Above $10,000': 6,
				'Between $8,000 and $10,000': 5,
				'Between $6,000 and $8,000': 4,
				'Between $4,000 and $6,000': 3,
				'Between $1,000 and $4,000': 2,
				'Less than $1,000': 1,
				'NA': 0
			}
		},
		{
			qnID: 'monthlyExpense',
			qnModel: 'user.creditProfileScore.sMonthlyExpense',
			content: 'What is your average monthly expenditure?',
			options: ['Above $10,000', 'Between $8,000 and $10,000', 'Between $6,000 and $8,000', 'Between $4,000 and $6,000', 'Between $1,000 and $4,000', 'Less than $1,000', 'NA'],
			rating: {
				'Above $10,000': 6,
				'Between $8,000 and $10,000': 5,
				'Between $6,000 and $8,000': 4,
				'Between $4,000 and $6,000': 3,
				'Between $1,000 and $4,000': 2,
				'Less than $1,000': 1,
				'NA': 0
			}

		},
		{
			qnID: 'monthlySavings',
			qnModel: 'user.creditProfileScore.sMonthlySavings',
			content: 'What is your average monthly savings?',
			options: ['Above $10,000', 'Between $8,000 and $10,000', 'Between $6,000 and $8,000', 'Between $4,000 and $6,000', 'Between $1,000 and $4,000', 'Less than $1,000', 'NA'],
			rating: {
				'Above $10,000': 6,
				'Between $8,000 and $10,000': 5,
				'Between $6,000 and $8,000': 4,
				'Between $4,000 and $6,000': 3,
				'Between $1,000 and $4,000': 2,
				'Less than $1,000': 1,
				'NA': 0
			}

		},
		{
			qnID: 'creditHistory',
			qnModel: 'user.creditProfileScore.sCreditHistory',
			content: 'Have you had any history of credit default?',
			options: ['90 days default', '60 days default', '30 days default', 'NA'],
			rating: {
				'90 days default': 1,
				'60 days default': 2,
				'30 days default': 3,
				'NA': 4
			}

		},
		{
			qnID: 'bankruptStatus',
			qnModel: 'user.creditProfileScore.sBankruptStatus',
			content: 'Have you been bankrupt in the last 6 years?',
			options: ['Yes', 'No'],
			rating: {
				'Yes': 0,
				'No': 4,
			}

		},
		{
			qnID: 'numberOfCreditCards',
			qnModel: 'user.creditProfileScore.sNumberOfCreditCards',
			content: 'How many credit cards do you own?',
			options: ['5 or more', '3 - 4', '2', '1', '0'],
			rating: {
				'5 or more': 4,
				'3 - 4': 3,
				'2': 2,
				'1': 1,
				'0': 0
			}

		}
	];

	var creditProfileScore = {
		sGender: 0,
		sAge: 0,
		sEducationLevel: 0,
		sMaritalStatus: 0,
		sLocativeType: 0,
		sLocativeSituation: 0,
		sNoOfDependents: 0,
		sCurrentOccupation: 0,
		sCurrentWorkPeriod: 0,
		sLastWorkPeriod: 0,
		sMonthlyIncome: 0,
		sMonthlyExpense: 0,
		sMonthlySavings: 0,
		sCreditHistory: 0,
		sBankruptStatus: 0,
		sNumberOfCreditCards: 0
	};

	return {
		qnsPersonal: qnsPersonal,
		qnsJob: qnsJob,
		qnsFinance: qnsFinance,
		creditProfileScore: creditProfileScore
	};
}]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			},
			retrieve: {
				method: 'GET'
			}
		});
	}
]);