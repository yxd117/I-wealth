'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'mean';
	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils', 'ngFileUpload', 'chart.js', 'angular-toArrayFilter', '720kb.tooltips', 'ngRoute'];

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

angular.module('admin').controller('AdminController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.user = Authentication.user;

		// If user is signed in then redirect back home
		
		if (!$scope.user) {
			$location.path('/');
		}else{
			var userType = $scope.user.roles;
			if (userType[0].localeCompare('admin') !== 0) $location.path('/');
		}
		


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
		// Menus.addSubMenuItem('topbar', 'financial', 'Manage Debt', 'financial/debt');
		// Menus.addSubMenuItem('topbar', 'financial', 'Manage Insurance', 'financial/insurance');
		// Menus.addSubMenuItem('topbar', 'financial', 'Manage Investment', 'financial/investment');
		// Menus.addSubMenuItem('topbar', 'financial', 'Manage Cashflow', 'financial/cashflow');

		Menus.addMenuItem('topbar', 'Milestones', 'milestones', '/milestones');
		// Menus.addSubMenuItem('topbar', 'milestones', 'Short Term', 'milestones/shortterm');
		// Menus.addSubMenuItem('topbar', 'milestones', 'Long Term', 'milestones/longterm');

		Menus.addMenuItem('topbar', 'Financial Tools', 'financialtools', 'dropdown', '/financialtools');
		Menus.addSubMenuItem('topbar', 'financialtools', 'Loan Calculator', 'financialtools/loancalculator');

		Menus.addMenuItem('topbar', 'Social', 'social', '/social');
		// Menus.addSubMenuItem('topbar', 'social', 'Manage Friends', 'social/managefriends');
		// Menus.addSubMenuItem('topbar', 'social', 'Forum', 'social/forum');

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
		state('forum',{
			url: '/social',
			templateUrl: 'modules/social/views/social.client.view.html'
		});

	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
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
		if(Authentication.user) $scope.redirectHome = '/#!/home';
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'CreditService', '$location',
	function($scope, Authentication, CreditService, $location) {
		// This provides Authentication context.
		$scope.user = Authentication.user;
		if (!$scope.user) $location.path('/');
		
		$scope.rankIcon = './img/rank/diamond0.jpg';

		if(!$scope.user.currentCreditRating) $scope.user.currentCreditRating = 'N/A';
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


        //--DATE Selected
        var current = function() {
            $scope.dt = new Date();
        };

        current();
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
    
        var reloadData = function(){
            if (!$scope.user.assetsRecordsPeriod || ($scope.user.assetsRecordsPeriod.minMonth > $scope.month && $scope.user.assetsRecordsPeriod.minYear >= $scope.year) || ($scope.user.assetsRecordsPeriod.minMonth < $scope.month && $scope.user.assetsRecordsPeriod.minYear > $scope.year)) {

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

        $scope.$watch('dt', function() {
            $scope.month = $scope.dt.getMonth();
            $scope.monthDisplay = mth[$scope.month];
            $scope.year = $scope.dt.getFullYear();

            if ($scope.success || $scope.error) {
                $scope.success = false;
                $scope.error = false;
            }

            console.log($scope.user.assetsRecords);

            $scope.$watch('user', function() {
                reloadData();
            });
        });

        $scope.$watch('user', function(){
            $scope.$watch('dt', function() {
                $scope.month = $scope.dt.getMonth();
                $scope.monthDisplay = mth[$scope.month];
                $scope.year = $scope.dt.getFullYear();

                if ($scope.success || $scope.error) {
                    $scope.success = false;
                    $scope.error = false;
                }

                console.log($scope.user.assetsRecords);

                    reloadData();
            });
        });
        $scope.clear = function() {
            $scope.dt = null;
        };


        $scope.open = function($event) {
            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };
        //--DATE Selected

    }
]);
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
'use strict';

// Articles controller
angular.module('financial').controller('FinancesController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'LiabilitiesService', 'AssetsService', 'IncomeExpenseService','Users', '$q', 'FinancialHealthService',
	function($scope, $rootScope, $stateParams, $location, Authentication, LiabilitiesService, AssetsService, IncomeExpenseService,Users, $q, FinancialHealthService) {
		$scope.user = Authentication.user;
        //Check authentication
        if (!$scope.user) $location.path('/');


        $scope.displayHome = {};

        var numHealthyRatio = 0;
        var numUnHealthyRatio = 0;
        $scope.homeHealth = [{
            value: 100,
            type: 'info'
        }];
        $scope.homeHealthDisplay = false;
        $scope.homeHealthyRatioArr = [];
        $scope.homeUnHealthyRatioArr = [];

        //Set new record to N/A
        $scope.displayOverview ={};
        $scope.displayOverview.ratioLiquidity = 'N/A';
        $scope.displayOverview.ratioAssetDebt = 'N/A';
        $scope.displayOverview.ratioDebtService = 'N/A';
        $scope.displayOverview.ratioHouseExpense = 'N/A';
        $scope.displayOverview.ratioDebtIncome = 'N/A';
        $scope.displayOverview.ratioConsumerDebt = 'N/A';
        $scope.displayOverview.ratioNetWorthBenchmark = 'N/A';
        $scope.displayOverview.ratioSaving = 'N/A';
        $scope.displayOverview.ratioSolvency = 'N/A';
        $scope.displayOverview.ratioInvestment = 'N/A';

        //Set Checkbox Ratio
        $scope.checkRatio = {};
        $scope.checkRatio.liquidity =true;

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
        var current = function() {
            $scope.dt = new Date();
        };

        current();
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

        //Charts Variables display time period
        $scope.selectedChartOption = '0';

        //Ratio Arrays
        var ratioLiquidityArr = [];
        var ratioAssetDebtArr = [];
        var ratioDebtServiceArr = [];
        var ratioHouseExpenseArr = [];
        var ratioDebtIncomeArr = [];
        var ratioConsumerDebtArr = [];
        var ratioLoanValueArr = [];
        var ratioTangibleNetWorthArr = [];
        var ratioNetWorthBenchmarkArr = [];
        var ratioSavingArr = [];
        var ratioSolvencyArr = [];
        var ratioInvestmentArr = [];

        //Change to reflect date change

        $scope.$watch('dt', function() {

            $scope.month = $scope.dt.getMonth();
            $scope.monthDisplay = mth[$scope.month];
            $scope.year = $scope.dt.getFullYear();

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
        });
        //Change time period of chart
        $scope.$watch('selectedChartOption', function() {

            updateChart();
        });

        //For Financial Health Page checkboxes
        $scope.$watch('checkRatio.liquidity', function() {

            updateChart();
        });
        $scope.$watch('checkRatio.assetDebt', function() {

            updateChart();
        });
        $scope.$watch('checkRatio.debtService', function() {

            updateChart();
        });
        $scope.$watch('checkRatio.houseExpense', function() {

            updateChart();
        });
        $scope.$watch('checkRatio.debtIncome', function() {

            updateChart();
        });
        $scope.$watch('checkRatio.consumerDebt', function() {

            updateChart();
        });
        $scope.$watch('checkRatio.netWorthBenchmark', function() {

            updateChart();
        });
        $scope.$watch('checkRatio.saving', function() {

            updateChart();
        });
        $scope.$watch('checkRatio.solvency', function() {

            updateChart();
        });
        $scope.$watch('checkRatio.investment', function() {
            
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
                    ratioMthArr[ratioMthNum] = mth[ratioMth];
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
                    ratioMthArr[ratioMthNum] = mth[ratioMth];
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
                    ratioMthArr[ratioMthNum] = mth[ratioMth];
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

            if($scope.checkRatio.liquidity){
                $scope.series.push('Liquidity');
                $scope.data.push(ratioLiquidityArr);
            }
            if($scope.checkRatio.assetDebt){
                $scope.series.push('Asset to Debt');
                $scope.data.push(ratioAssetDebtArr);
            }
            if($scope.checkRatio.debtService){
                $scope.series.push('Debt Service');
                $scope.data.push(ratioDebtServiceArr);
            }
            if($scope.checkRatio.houseExpense){
                $scope.series.push('Housing Expense');
                $scope.data.push(ratioHouseExpenseArr);
            }
            if($scope.checkRatio.debtIncome){
                $scope.series.push('Debt to Income');
                $scope.data.push(ratioDebtIncomeArr);
            }
            if($scope.checkRatio.consumerDebt){
                $scope.series.push('Consumer Debt');
                $scope.data.push(ratioConsumerDebtArr);
            }
            if($scope.checkRatio.loanValue){
                $scope.series.push('Loan to Value');
                $scope.data.push(ratioLoanValueArr);
            }
            if($scope.checkRatio.tangibleNetWorth){
                $scope.series.push('Tangible Net Worth');
                $scope.data.push(ratioTangibleNetWorthArr);
            }
            if($scope.checkRatio.netWorthBenchmark){
                $scope.series.push('Net Worth Benchmark');
                $scope.data.push(ratioNetWorthBenchmarkArr);
            }
            if($scope.checkRatio.saving){
                $scope.series.push('Saving');
                $scope.data.push(ratioSavingArr);
            }
            if($scope.checkRatio.solvency){
                $scope.series.push('Solvency');
                $scope.data.push(ratioSolvencyArr);
            }
            if($scope.checkRatio.investment){
                $scope.series.push('Investment');
                $scope.data.push(ratioInvestmentArr);
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


        $scope.clear = function() {
            $scope.dt = null;
        };


        $scope.open = function($event) {
            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };
        
        var retrieveAssetsRecord = function(month, year){
            var displayAssetsRecords;
            if (!$scope.user.assetsRecordsPeriod || ($scope.user.assetsRecordsPeriod.minMonth > month && $scope.user.assetsRecordsPeriod.minYear >= year) || ($scope.user.assetsRecordsPeriod.minMonth < month && $scope.user.assetsRecordsPeriod.minYear > year)) {

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
            if (!$scope.user.liabilitiesRecordsPeriod || ($scope.user.liabilitiesRecordsPeriod.minMonth > month && $scope.user.liabilitiesRecordsPeriod.minYear >= year) || ($scope.user.liabilitiesRecordsPeriod.minMonth < month && $scope.user.liabilitiesRecordsPeriod.minYear > year)) {

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
            if (!$scope.user.incomeExpenseRecordsPeriod || ($scope.user.incomeExpenseRecordsPeriod.minMonth > month && $scope.user.incomeExpenseRecordsPeriod.minYear >= year) || ($scope.user.incomeExpenseRecordsPeriod.minMonth < month && $scope.user.incomeExpenseRecordsPeriod.minYear > year)) {

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
            //Ratio Formula time
            //1) Liquidity Ratio
            var ratioLiquidity = angular.copy($scope.displayAssetsRecords.cashEquivalentsAmt) / angular.copy($scope.displayIncomeExpenseRecords.monthlyExpenseAmt);
            //2) Assets to Debt Ratio
            var ratioAssetDebt = $scope.displayAssetsRecords.totalAmt / $scope.displayLiabilitiesRecords.totalAmt;
            //3) Debt Service Ratio
            var ratioDebtService = $scope.displayLiabilitiesRecords.totalAmt / $scope.displayIncomeExpenseRecords.monthlyIncomeAmt;
            //4) Housing Expense Ratio
            var ratioHouseExpense = ($scope.displayIncomeExpenseRecords.monthlyExpenseAmt - $scope.displayIncomeExpenseRecords.fixedExpenseAmt) / $scope.displayIncomeExpenseRecords.netCashFlow;  
            //5) Debt Income Ratio
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
             
            //6) Consumer Debt Ratio
            var ratioConsumerDebt = $scope.displayLiabilitiesRecords.shortTermCreditAmt / $scope.displayIncomeExpenseRecords.netCashFlow;
            //7) Net WorthBenchmark Ratio
            var ratioNetWorthBenchmark = ($scope.displayAssetsRecords.totalAmt - $scope.displayLiabilitiesRecords.totalAmt) / ($scope.user.age  * $scope.displayIncomeExpenseRecords.monthlyIncomeAmt * 12 / 10);
            //8) Saving Ratio
            var ratioSaving = $scope.displayIncomeExpenseRecords.monthlyIncomeAmt / $scope.displayIncomeExpenseRecords.netCashFlow;
            //9) Solvency Ratio
            var ratioSolvency = ($scope.displayAssetsRecords.totalAmt - $scope.displayLiabilitiesRecords.totalAmt) / $scope.displayAssetsRecords.totalAmt;
            //10) Investment Ratio
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
            //1)
            if(isFinite(ratioLiquidity)) {
                $scope.displayOverview.ratioLiquidity = ratioLiquidity.toFixed(2);
            }else {
                $scope.displayOverview.ratioLiquidity = 'N/A';
            }
            //2) 
            if(isFinite(ratioAssetDebt)) {
                $scope.displayOverview.ratioAssetDebt = ratioAssetDebt.toFixed(2);
            }else {
                $scope.displayOverview.ratioAssetDebt = 'N/A';
            }
            //3) 
            if(isFinite(ratioDebtService)) {
                $scope.displayOverview.ratioDebtService = ratioDebtService.toFixed(2);
            }else {
                $scope.displayOverview.ratioDebtService ='N/A';
            }
            //4)
            if(isFinite(ratioHouseExpense)) {
                $scope.displayOverview.ratioHouseExpense = ratioHouseExpense.toFixed(2);
            } else {
                $scope.displayOverview.ratioHouseExpense = 'N/A';
            }
            //5)
            if(isFinite(ratioDebtIncome)) {
                $scope.displayOverview.ratioDebtIncome = ratioDebtIncome.toFixed(2);
            }else{
                $scope.displayOverview.ratioDebtIncome = 'N/A';
            }
            //6)
            if(isFinite(ratioConsumerDebt)) {
                $scope.displayOverview.ratioConsumerDebt = ratioConsumerDebt.toFixed(2);
            }else{
                $scope.displayOverview.ratioConsumerDebt = 'N/A';
            }
            //7)
            if(isFinite(ratioNetWorthBenchmark)) {
                $scope.displayOverview.ratioNetWorthBenchmark = ratioNetWorthBenchmark.toFixed(2);
            } else {
                $scope.displayOverview.ratioNetWorthBenchmark = 'N/A';
            }
            //8)
            if(isFinite(ratioSaving)) {
                $scope.displayOverview.ratioSaving = ratioSaving.toFixed(2);
            }else{
                $scope.displayOverview.ratioSaving = 'N/A';
            }
            //9)
            if(isFinite(ratioSolvency)) {
                $scope.displayOverview.ratioSolvency = ratioSolvency.toFixed(2);
            }else{
                $scope.displayOverview.ratioSolvency = 'N/A';
            }
            //10)
            if(isFinite(ratioInvestment)) {
                $scope.displayOverview.ratioInvestment = ratioInvestment.toFixed(2);
            }else{
                $scope.displayOverview.ratioInvestment = 'N/A';
            }

            
            //Set analysis for each ratio
            //1)
            if($scope.displayOverview.ratioLiquidity !== 'N/A'){
                if($scope.displayOverview.ratioLiquidity < 3){
                    $scope.displayAnalysis.liquidity = $scope.analysisRatio.analysisLiquidity.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Liquidity Ratio');
                }else if ($scope.displayOverview.ratioLiquidity >=3 && $scope.displayOverview.ratioLiquidity < 6){
                    $scope.displayAnalysis.liquidity = $scope.analysisRatio.analysisLiquidity.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Liquidity Ratio');
                }else if ($scope.displayOverview.ratioLiquidity >=6){
                    $scope.displayAnalysis.liquidity = $scope.analysisRatio.analysisLiquidity.healthy[1];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Liquidity Ratio');
                }
            }else{
                $scope.displayAnalysis.liquidity = 'Unable to generate ratio due to missing inputs';
            }
            //2)
            if($scope.displayOverview.ratioAssetDebt !== 'N/A'){
                if($scope.displayOverview.ratioAssetDebt < 0.4){
                    $scope.displayAnalysis.assetDebt = $scope.analysisRatio.analysisAssetDebt.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Asset to Debt Ratio');
                }else if($scope.displayOverview.ratioAssetDebt >=0.4 && $scope.displayOverview.ratioAssetDebt < 0.6){
                    $scope.displayAnalysis.assetDebt = $scope.analysisRatio.analysisAssetDebt.healthy[1];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Asset to Debt Ratio');
                }else if($scope.displayOverview.ratioAssetDebt >=0.6){
                    $scope.displayAnalysis.assetDebt = $scope.analysisRatio.analysisAssetDebt.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Asset to Debt Ratio');
                }
            }else{
                $scope.displayAnalysis.assetDebt = 'Unable to generate ratio due to missing inputs';
            }
            //3)
            if($scope.displayOverview.ratioDebtService !== 'N/A'){
                if($scope.displayOverview.ratioDebtService <=0.36){
                    $scope.displayAnalysis.debtService = $scope.analysisRatio.analysisDebtService.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Debt Service Ratio');
                }else if($scope.displayOverview.ratioDebtService > 0.36){
                    $scope.displayAnalysis.debtService = $scope.analysisRatio.analysisDebtService.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Debt Service Ratio');
                }
            }else{
                $scope.displayAnalysis.debtService = 'Unable to generate ratio due to missing inputs';
            }
            //4)
            if($scope.displayOverview.ratioHouseExpense !== 'N/A'){
                if($scope.displayOverview.ratioHouseExpense <=0.28){
                    $scope.displayAnalysis.houseExpense = $scope.analysisRatio.analysisHouseExpense.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Housing Expense Ratio');
                }else if($scope.displayOverview.ratioHouseExpense > 0.28){
                    $scope.displayAnalysis.houseExpense = $scope.analysisRatio.analysisHouseExpense.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Housing Expense Ratio');
                }
            }else{
                $scope.displayAnalysis.houseExpense = 'Unable to generate ratio due to missing inputs';
            }
            //5)
            if($scope.displayOverview.ratioDebtIncome !== 'N/A'){
                if($scope.displayOverview.ratioDebtIncome <=0.4){
                    $scope.displayAnalysis.debtIncome = $scope.analysisRatio.analysisDebtIncome.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Debt to Income Ratio');
                }else if($scope.displayOverview.ratioDebtIncome > 0.4){
                    $scope.displayAnalysis.debtIncome = $scope.analysisRatio.analysisDebtIncome.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Debt to Income Ratio');
                }
            }else{
                $scope.displayAnalysis.debtIncome = 'Unable to generate ratio due to missing inputs';
            }            
            //6)
            if($scope.displayOverview.ratioConsumerDebt !== 'N/A'){
                if($scope.displayOverview.ratioConsumerDebt <=0.2){
                    $scope.displayAnalysis.consumerDebt = $scope.analysisRatio.analysisConsumerDebt.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Consumer Debt Ratio');
                }else if($scope.displayOverview.ratioConsumerDebt > 0.2){
                    $scope.displayAnalysis.consumerDebt = $scope.analysisRatio.analysisConsumerDebt.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Consumer Debt Ratio');
                }
            }else{
                $scope.displayAnalysis.consumerDebt = 'Unable to generate ratio due to missing inputs';
            } 
            //7)
            if($scope.displayOverview.ratioNetWorthBenchmark !== 'N/A'){
                if($scope.displayOverview.ratioNetWorthBenchmark <=0.75){
                    $scope.displayAnalysis.netWorthBenchmark = $scope.analysisRatio.analysisNetWorthBenchmark.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Net Worth Benchmark');
                }else if($scope.displayOverview.ratioNetWorthBenchmark >0.75 && $scope.displayOverview.ratioNetWorthBenchmark <=1){
                    $scope.displayAnalysis.netWorthBenchmark = $scope.analysisRatio.analysisNetWorthBenchmark.healthy[1];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Net Worth Benchmark');
                }else if($scope.displayOverview.ratioNetWorthBenchmark > 1){
                    $scope.displayAnalysis.netWorthBenchmark = $scope.analysisRatio.analysisNetWorthBenchmark.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Net Worth Benchmark');
                }
            }else{
                $scope.displayAnalysis.netWorthBenchmark = 'Unable to generate ratio due to missing inputs';
            }
            //8)
            if($scope.displayOverview.ratioSaving !== 'N/A'){
                if($scope.displayOverview.ratioSaving <0.12){
                    $scope.displayAnalysis.saving = $scope.analysisRatio.analysisSaving.unhealthy[0];
                    numUnHealthyRatio++; 
                    $scope.homeUnHealthyRatioArr.push('Saving Ratio');
                }else if($scope.displayOverview.ratioSaving >=0.12 && $scope.displayOverview.ratioSaving <=0.7){
                    $scope.displayAnalysis.saving = $scope.analysisRatio.analysisSaving.healthy[1];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Saving Ratio');
                }else if($scope.displayOverview.ratioSaving > 0.7){
                    $scope.displayAnalysis.saving = $scope.analysisRatio.analysisSaving.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Saving Ratio');
                }
            }else{
                $scope.displayAnalysis.saving = 'Unable to generate ratio due to missing inputs';
            }
            //9)
            if($scope.displayOverview.ratioSolvency !== 'N/A'){
                if($scope.displayOverview.ratioSolvency <=0.2){
                    $scope.displayAnalysis.solvency = $scope.analysisRatio.analysisSolvency.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Solvency Ratio');
                }else if($scope.displayOverview.ratioSolvency > 0.2){
                    $scope.displayAnalysis.solvency = $scope.analysisRatio.analysisSolvency.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Solvency Ratio');
                }
            }else{
                $scope.displayAnalysis.solvency = 'Unable to generate ratio due to missing inputs';
            } 
            //10)
            if($scope.displayOverview.ratioInvestment !== 'N/A'){
                if($scope.displayOverview.ratioInvestment <=0.2){
                    $scope.displayAnalysis.investment = $scope.analysisRatio.analysisInvestment.unhealthy[0];
                    numUnHealthyRatio++;
                    $scope.homeUnHealthyRatioArr.push('Investment Ratio');
                }else if($scope.displayOverview.ratioInvestment > 0.2){
                    $scope.displayAnalysis.investment = $scope.analysisRatio.analysisInvestment.healthy[0];
                    numHealthyRatio++;
                    $scope.homeHealthyRatioArr.push('Investment Ratio');
                }
            }else{
                $scope.displayAnalysis.investment = 'Unable to generate ratio due to missing inputs';
            } 

            //Render ratio to home page
            

            $scope.homeHealthDisplay = true;
            $scope.homeHealth = [{value: (numHealthyRatio*10), type: 'success'}, {value: (numUnHealthyRatio*10), type:'danger'}];

        };

        //for chart display
        var calculateRatiosChart = function(aRecords, lRecords, ieRecords, ratioMthNum){
            aRecords = aRecords;
            lRecords = lRecords;
            ieRecords = ieRecords;
            
            //Ratio Formula time
            //1) Liquidity Ratio
            var ratioLiquidityChart = aRecords.cashEquivalentsAmt / ieRecords.monthlyExpenseAmt;
            //2) Assets to Debt Ratio
            var ratioAssetDebtChart = aRecords.totalAmt / lRecords.totalAmt;
            //3) Debt Service Ratio
            var ratioDebtServiceChart = lRecords.totalAmt / ieRecords.monthlyIncomeAmt;
            //4) Housing Expense Ratio
            var ratioHouseExpenseChart = (ieRecords.monthlyExpenseAmt - ieRecords.fixedExpenseAmt) / ieRecords.netCashFlow; 
            //5) Debt Income Ratio
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
            //6) Consumer Debt Ratio
            var ratioConsumerDebtChart = lRecords.shortTermCreditAmt / ieRecords.netCashFlow;
            //7) Net WorthBenchmark Ratio
            var ratioNetWorthBenchmarkChart = (aRecords.totalAmt - lRecords.totalAmt) / ($scope.user.age  * ieRecords.monthlyIncomeAmt * 12 / 10);
            //8) Saving Ratio
            var ratioSavingChart = ieRecords.monthlyIncomeAmt / ieRecords.netCashFlow;
            //9) Solvency Ratio
            var ratioSolvencyChart = (aRecords.totalAmt - lRecords.totalAmt) / aRecords.totalAmt;
            //10) Investment Ratio
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
            if(isFinite(ratioLiquidityChart)) {
                ratioLiquidityArr[ratioMthNum] = Number(ratioLiquidityChart.toFixed(2));
            } else{
                ratioLiquidityArr[ratioMthNum] = 0;
            }
            if(isFinite(ratioAssetDebtChart)) {
                ratioAssetDebtArr[ratioMthNum] = Number(ratioAssetDebtChart.toFixed(2));
            } else{
                ratioAssetDebtArr[ratioMthNum] = 0;
            }
            if(isFinite(ratioDebtServiceChart)) {
                ratioDebtServiceArr[ratioMthNum] = Number(ratioDebtServiceChart.toFixed(2));
            } else {
                ratioDebtServiceArr[ratioMthNum] = 0;
            }
            if(isFinite(ratioHouseExpenseChart)) {
                ratioHouseExpenseArr[ratioMthNum] = Number(ratioHouseExpenseChart.toFixed(2));
            } else{
                ratioHouseExpenseArr[ratioMthNum] = 0;
            }
            if(isFinite(ratioDebtIncomeChart)) {
                ratioDebtIncomeArr[ratioMthNum] = Number(ratioDebtIncomeChart.toFixed(2));
            } else {
                ratioDebtIncomeArr[ratioMthNum] = 0;
            }
            if(isFinite(ratioConsumerDebtChart)) {
                ratioConsumerDebtArr[ratioMthNum] = Number(ratioConsumerDebtChart.toFixed(2));
            }else {
                ratioConsumerDebtArr[ratioMthNum] = 0;
            }
            if(isFinite(ratioNetWorthBenchmarkChart)) {
                ratioNetWorthBenchmarkArr[ratioMthNum] = Number(ratioNetWorthBenchmarkChart.toFixed(2));
            }else {
                ratioNetWorthBenchmarkArr[ratioMthNum] = 0;
            }
            if(isFinite(ratioSavingChart)) {
                ratioSavingArr[ratioMthNum] = Number(ratioSavingChart.toFixed(2));
            } else{
                ratioSavingArr[ratioMthNum] = 0;
            }
            if(isFinite(ratioSolvencyChart)) {
                ratioSolvencyArr[ratioMthNum] = Number(ratioSolvencyChart.toFixed(2));
            } else {
                ratioSolvencyArr[ratioMthNum] = 0;
            }
            if(isFinite(ratioInvestmentChart)) {
                ratioInvestmentArr[ratioMthNum] = Number(ratioInvestmentChart.toFixed(2));
            } else{
                ratioInvestmentArr[ratioMthNum] = 0;
            }

        };
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
        $scope.incomeExpenseDoughnutData = [1]; 
        $scope.incomeExpenseDoughnutLabels = ['No Data'];

        //--DATE Selected
        var current = function() {
            $scope.dt = new Date();
        };

        current();
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

        $scope.$watch('dt', function() {
            $scope.month = $scope.dt.getMonth();
            $scope.monthDisplay = mth[$scope.month];
            $scope.year = $scope.dt.getFullYear();

            if ($scope.success || $scope.error) {
                $scope.success = false;
                $scope.error = false;
            }



            $scope.$watch('user', function() {
                if (!$scope.user.incomeExpenseRecordsPeriod || ($scope.user.incomeExpenseRecordsPeriod.minMonth > $scope.month && $scope.user.incomeExpenseRecordsPeriod.minYear >= $scope.year) || ($scope.user.incomeExpenseRecordsPeriod.minMonth < $scope.month && $scope.user.incomeExpenseRecordsPeriod.minYear > $scope.year)) {

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
                if(!$scope.displayIncomeExpenseRecords.incomeNormalAmt && !$scope.displayIncomeExpenseRecords.otherIncomeAmt && !$scope.displayIncomeExpenseRecords.fixedExpenseAmt && !$scope.displayIncomeExpenseRecords.transportAmt && !$scope.displayIncomeExpenseRecords.utilityHouseholdAmt && !$scope.displayIncomeExpenseRecords.foodNecessitiesAmt && !$scope.displayIncomeExpenseRecords.miscAmt){
                    $scope.incomeExpenseDoughnutData = [1]; 
                    $scope.incomeExpenseDoughnutLabels = ['No Data'];
                }else {
                    $scope.incomeExpenseDoughnutData = [$scope.displayIncomeExpenseRecords.incomeNormalAmt, $scope.displayIncomeExpenseRecords.otherIncomeAmt, $scope.displayIncomeExpenseRecords.fixedExpenseAmt, $scope.displayIncomeExpenseRecords.transportAmt, $scope.displayIncomeExpenseRecords.utilityHouseholdAmt, $scope.displayIncomeExpenseRecords.foodNecessitiesAmt, $scope.displayIncomeExpenseRecords.miscAmt]; 
                    $scope.incomeExpenseDoughnutLabels = ['Employment Income', 'Other Income', 'Fixed Expense', 'Transport', 'Utilities & Household Maintenance', 'Food & Necessities', 'Miscellaneous'];
                }

            });
        });

		$scope.updateUserFinances = function(isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                //ONLY when they update
                if (!$scope.user.incomeExpenseRecordsPeriod) {
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

                //Expense
                var fixedExpenseArr = $scope.displayIncomeExpenseRecords.monthlyExpense.fixedExpense;
                var fixedExpenseTotal = 0;
                angular.forEach(fixedExpenseArr, function(value, key){
                    fixedExpenseTotal = fixedExpenseTotal + Number(value.value);
                });

                var transportArr = $scope.displayIncomeExpenseRecords.monthlyExpense.transport;
                var transportTotal = 0;
                angular.forEach(transportArr, function(value, key){
                    transportTotal = transportTotal + Number(value.value);
                });

                var utilityHouseholdArr = $scope.displayIncomeExpenseRecords.monthlyExpense.utilityHousehold;
                var utilityHouseholdTotal = 0;
                angular.forEach(utilityHouseholdArr, function(value, key){
                    utilityHouseholdTotal = utilityHouseholdTotal + Number(value.value);
                });

                var foodNecessitiesArr = $scope.displayIncomeExpenseRecords.monthlyExpense.foodNecessities;
                var foodNecessitiesTotal = 0;
                angular.forEach(foodNecessitiesArr, function(value, key){
                    foodNecessitiesTotal = foodNecessitiesTotal + Number(value.value);
                });

                var miscArr = $scope.displayIncomeExpenseRecords.monthlyExpense.misc;
                var miscTotal = 0;
                angular.forEach(miscArr, function(value, key){
                    miscTotal = miscTotal + Number(value.value);
                });


                var monthlyIncomeAmt = incomeNormalTotal + otherIncomeTotal;
                var monthlyExpenseAmt = fixedExpenseTotal + transportTotal + utilityHouseholdTotal + foodNecessitiesTotal + miscTotal;
                var netCashFlow = monthlyIncomeAmt - monthlyExpenseAmt;

                $scope.displayIncomeExpenseRecords.incomeNormalAmt = incomeNormalTotal.toFixed(2);
                $scope.displayIncomeExpenseRecords.otherIncomeAmt = otherIncomeTotal.toFixed(2);

                $scope.displayIncomeExpenseRecords.fixedExpenseAmt = fixedExpenseTotal.toFixed(2);
                $scope.displayIncomeExpenseRecords.transportAmt = transportTotal.toFixed(2);
                $scope.displayIncomeExpenseRecords.utilityHouseholdAmt = utilityHouseholdTotal.toFixed(2);
                $scope.displayIncomeExpenseRecords.foodNecessitiesAmt = foodNecessitiesTotal.toFixed(2);
                $scope.displayIncomeExpenseRecords.miscAmt = miscTotal.toFixed(2);               

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

                $scope.user.updatedIncomeExpense = true;
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



        $scope.clear = function() {
            $scope.dt = null;
        };


        $scope.open = function($event) {
            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };
        //--DATE Selected

       
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
        };


        //Chart display
        $scope.liabilitiesChartDisplay = true;
        $scope.liabilitiesDoughnutData = [1]; 
        $scope.liabilitiesDoughnutLabels = ['No Data'];

        current();
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



        $scope.$watch('dt', function() {
            $scope.month = $scope.dt.getMonth();
            $scope.monthDisplay = mth[$scope.month];
            $scope.year = $scope.dt.getFullYear();

            if ($scope.success || $scope.error) {
                $scope.success = false;
                $scope.error = false;
            }



            $scope.$watch('user', function() {
                if (!$scope.user.liabilitiesRecordsPeriod || ($scope.user.liabilitiesRecordsPeriod.minMonth > $scope.month && $scope.user.liabilitiesRecordsPeriod.minYear >= $scope.year) || ($scope.user.liabilitiesRecordsPeriod.minMonth < $scope.month && $scope.user.liabilitiesRecordsPeriod.minYear > $scope.year)) {

                	$scope.displayLiabilitiesRecords = angular.copy(LiabilitiesService.liabilitiesRecords);
                	$scope.displayLiabilitiesRecords.year = angular.copy($scope.year);
                	$scope.displayLiabilitiesRecords.month = angular.copy($scope.month);
                    console.log('am i in here');

                } else {

                    if ($scope.user.liabilitiesRecordsPeriod.minMonth === $scope.user.liabilitiesRecordsPeriod.maxMonth && $scope.user.liabilitiesRecordsPeriod.minYear === $scope.user.liabilitiesRecordsPeriod.maxYear) {
                        $scope.displayLiabilitiesRecords = angular.copy($scope.user.liabilitiesRecords[0]);
                        console.log('her0e');
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

            });
        });
	
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

                var shortTermCreditArr = $scope.displayLiabilitiesRecords.shortTermCredit;
                var shortTermCreditTotal = 0;
                angular.forEach(shortTermCreditArr, function(value, key){
                    shortTermCreditTotal = shortTermCreditTotal + Number(value.value);
                });

                var loansMortgagesArr = $scope.displayLiabilitiesRecords.loansMortgages;
                var loansMortgagesTotal = 0;
                angular.forEach(loansMortgagesArr, function(value, key){
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



        $scope.clear = function() {
            $scope.dt = null;
        };


        $scope.open = function($event) {
            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };
        //--DATE Selected
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

angular.module('financial').factory('FinancialHealthService', ['$resource', function($resource){


	//Tooltips
	var tipLiquidity = 'Use for analysing existing emergency funds. It is a prescribed practice to maintain 3-6 months of expenses as your emergency fund.<br> For example, if you are suddenly presented with an investment opportunity for which you must act fast,</br> you will probably look first to draw on your liquid assets.';

	var tipAssetDebt = 'This ratio compares the assets accumulated by an individual against the existing liabilities</br> and helps in determining what you own vs. what you owe.';

	var tipDebtService = 'This ratio defines how comfortable one is making his/her EMI (equated monthly installments) payments.';

	var tipHouseExpense = 'One of the best ways to determine how much housing you can afford is by calculating your housing expense ratio';

	var tipDebtIncome = 'Lenders look at this ratio when they are trying to decide whether to lend you money or extend credit.</br> A low DTI shows you have a good balance between debt and income. As you might guess, lenders like this number to be low -</br> generally you&#39;ll want to keep it below 3.6, but the lower it is, the greater the chance you will be able to get the loans or credit you seek.</br> Evidence from studies of mortgage loans suggest that borrowers with a higher debt-to-income ratio</br> are more likely to run into trouble making monthly payments.';

	var tipConsumerDebt = 'A high consumer debt ratio could point to excessive use of credit cards.';

	var tipNetWorthBenchmark = 'This metric is used to compare your actual net worth to a standard.</br> The net worth benchmark assumes that your net worth is a function of your earnings and your years of earnings';

	var tipSaving = 'It compares the monthly surplus being generated by an individual against total cash inflows.</br> It will give you valuable insight on how well your finances are being managed.</br> It also represents one&#39;s ability to achieve his/her future goals.</br>';

	var tipSolvency = 'Solvency ratio compares an individual&#39;s net worth against total assets accumulated by him/her.</br> This ratio indicates the ability of an individual to repay all his/her existing debts using existing assets in case of unforeseen events.';

	var tipInvestment = 'This ratio compares liquid assets being held by an individual against the total assets accumulated.</br> Investments in stocks, mutual funds or other such investments, which can be converted to cash easily, are considered as liquid assets.';

	var tips = {
		tipLiquidity: tipLiquidity,
		tipAssetDebt: tipAssetDebt,
		tipDebtService: tipDebtService,
		tipHouseExpense: tipHouseExpense,
		tipDebtIncome: tipDebtIncome,
		tipConsumerDebt: tipConsumerDebt,
		tipNetWorthBenchmark: tipNetWorthBenchmark,
		tipSaving: tipSaving,
		tipSolvency: tipSolvency,
		tipInvestment: tipInvestment
	};


	//---Liquidity---
	//Liquidity Ratio
	var analysisLiquidity = {
		//[3-6, >=6]
		healthy: ['You have a healthy liquidity ratio. This means that you are able to maintain 3-6 months of your current expenses as your emergency funds. For example, if you are suddenly presented with an investment opportunity where you must act fast, your liquid assets will come in handy.', 
		'You have a healthy liquidty ratio. This means that you are able to maintain more than 6 months of your current expenses as your emergency funds. However, this is more than the recommended ratio by experts as the liquid assets you hold on hand will depreciate with inflation if not managed well. Try looking into options to grow your excess liquid assets while maintaining the healthy ratio of 3 - 6'],
		//[0-3]
		unhealthy:['You have an unhealthy liquidity ratio. This means that you are not able to maintain a healthy portion of your expenses as your emergency fund']
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
		//[0-0.28]
		healthy: ['You have a healthy housing expense ratio. This means that you are spending a good and reasonable amount on housing expenses in proportion to your income.'],
		//[>0.28]
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
		//[0-0.2]
		healthy: ['You have a healthy consumer debt ratio. This means that you are borrowing wisely.'],
		//[>0.2]
		unhealthy: ['You have an unhealthy consumer debt ratio. This means that you are borrowing unnecessarily and may have a serious debt problem. Only 5% of the population ows such high percentage of consumer debt. Seek help from a debt counsellor if you need to. In the meantime, stop using credit for your expenses.']
	};

	//--Net Worth/ Others---
	//Net Worth Benchmark
	var analysisNetWorthBenchmark = {
		//[>1, 0.75-1]
		healthy: ['Your networth is higher than your age&#39;s Networth Benchmark.', 'You are less than 15% away from your age&#39;s Networth Benchmark.'],
		//[0-0.75]
		unhealthy: ['You are below the networth benchmark for your age.']
	};

	//Saving Ratio
	var analysisSaving = {
		//[>0.7, 0.12-0.7]
		healthy: ['You have a healthy savings ratio. This means that you have a healthy surplus of money monthly. This shows that you are able to achieve your future goals easily. However, you may have an excessive amount of income surplus. You should look to investing to prevent inflation from depreciating the value of your savings.', 'You have a healthy savings ratio. This means that you have a healthy surplus of money monthly. This shows that you are able to achieve your future goals easily.'],
		//[0-0.12]
		unhealthy: ['You have an unhealthy savings ratio. This means that you may have difficulty in achieving future goals with your current monthly savings trend.']
	};

	//Solvency Ratio
	var analysisSolvency = {
		//[>0.2]
		healthy: ['You have a healthy solvency ratio. This means that you will be able to repay your existing debts using existing assets in an event of emergency base on your networth.'],
		//[0-0.2]
		unhealthy: ['You have an unhealthy solvency ratio. This means that you will have difficulty in repaying your existing debts using existing assets in an event of emergency base on your networth.']
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
		analysisAssetDebt: analysisAssetDebt,
		analysisDebtService: analysisDebtService,
		analysisHouseExpense: analysisHouseExpense,
		analysisDebtIncome: analysisDebtIncome,
		analysisConsumerDebt: analysisConsumerDebt,
		analysisNetWorthBenchmark: analysisNetWorthBenchmark,
		analysisSaving: analysisSaving,
		analysisSolvency: analysisSolvency,
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
		savings: {
			description: 'Savings',
			order: 0,
			value: 0
		},
		mortgageRepayments: {
			description: 'Mortgage Repayments',
			order: 1,
			value: 0
		},
		rentalRepayments: {
			description: 'Rental Repayments',
			order: 2,
			value: 0
		},
		otherLoanRepayments: {
			description: 'Other Loan Repayments',
			order: 3,
			value: 0
		},
		conservancyPropertyTaxes: {
			description: 'Conservancy and Property Taxes',
			order: 4,
			value: 0
		},
		insurances: {
			description: 'Insurances',
			order: 5,
			value: 0
		},
		childrenEducation: {
			description: 'Children&quot Education',
			order: 6,
			value: 0
		},
		allowances: {
			description: 'Allowances for parents & Children',
			order: 7,
			value: 0
		},
		maid: {
			description: 'Maid',
			order: 8,
			value: 0
		},
		others: {
			description: 'Others',
			order: 9,
			value: 0
		}
	};	

	var transport = {
		carLoanRepayment: {
			description: 'Car Loan Repayments',
			order: 0,
			value: 0
		},
		motorInsurances: {
			description: 'Motor Insurances',
			order: 1,
			value: 0
		},
		roadTax: {
			description: 'Road Tax',
			order: 2,
			value: 0
		},
		carparkFees: {
			description: 'Carpark Fees',
			order: 3,
			value: 0
		},
		petrolMaintenanceExpense: {
			description: 'Petrol & Maintenance Expenses',
			order: 4,
			value: 0
		},
		publicTransport: {
			description: 'Public Transport',
			order: 5,
			value: 0
		},
		others: {
			description: 'Others',
			order: 6,
			value: 0
		}
	};	

	var utilityHousehold = {
		utilityBill: {
			description: 'Utilities Bill',
			order: 0,
			value: 0
		},
		homeTelephone: {
			description: 'Home Telephone',
			order: 1,
			value: 0
		},
		mobilePhone: {
			description: 'Mobile Phone',
			order: 2,
			value: 0
		},
		cableTVInternet: {
			description: 'Cable TV & Internet',
			order: 3,
			value: 0
		},
		others: {
			description: 'Others',
			order: 4,
			value: 0
		}
	};

	var foodNecessities = {
		groceries: {
			description: 'Groceries',
			order: 0,
			value: 0
		},
		eatingOut: {
			description: 'Eating Out',
			order: 1,
			value: 0
		},
		clothings: {
			description: 'Clothings',
			order: 2,
			value: 0
		},
		personalGrooming: {
			description: 'Personal Grooming',
			order: 3,
			value: 0
		},
		healthMedical: {
			description: 'Health & Medical',
			order: 4,
			value: 0
		},
		others: {
			description: 'Others',
			order: 5,
			value: 0
		}
	};

	var misc = {
		tourFamilyOutings: {
			description: 'Tour & Family Outings',
			order: 0,
			value: 0
		},
		entertainment: {
			description: 'Entertainment',
			order: 1,
			value: 0
		},
		hobbiesSports: {
			description: 'Hobbies & Sports',
			order: 2,
			value: 0
		},
		others: {
			description: 'Others',
			order: 3,
			value: 0
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
		misc: misc
	};

	var incomeNormalAmt = 0;
	var otherIncomeAmt = 0;

	var fixedExpenseAmt = 0;
	var transportAmt = 0;
	var utilityHouseholdAmt = 0;
	var foodNecessitiesAmt = 0;
	var miscAmt = 0;

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
			description: 'Mortgage Loan Balance',
			order: 0,
			value: 0
		},
		carBalance :{
			description: 'Car Loan Balance',
			order: 1,
			value: 0
		},
		studentLoan: {
			description: 'Student Loan',
			order: 2,
			value: 0
		},
		personalLoan: {
			description: 'Personal Loan',
			order: 3,
			value: 0
		},
		renovationLoan: {
			description: 'Renovation Loan',
			order: 4,
			value: 0
		},
		others: {
			description: 'Others',
			order: 5,
			value: 0
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

// Articles controller
angular.module('social').controller('SocialController', ['$scope', '$stateParams', '$location', 'Authentication', 
	function($scope, $stateParams, $location, Authentication) {
		$scope.user = Authentication.user;
		if (!$scope.user) $location.path('/');
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
		state('admin', {
			url: '/adminconsole',
			templateUrl: 'modules/admin/views/adminconsole.client.view.html'
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

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

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
					$location.path('/adminconsole');
				}else{
					if (!completeQns)$location.path('/settings/questionnaire');
					else $location.path('/home');					
				}


			}).error(function(response) {
				
				$scope.error = response.message;
				
			});
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

		$scope.qnsPersonal = QuestionnaireService.qnsPersonal();
		$scope.qnsJob = QuestionnaireService.qnsJob();
		$scope.qnsFinance = QuestionnaireService.qnsFinance();

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
			if(user.sGender === null || user.sGender === undefined) completePersonalQns = false;
			else {
				personalScore += Number(user.sGender);
				if(Number(user.sGender) === 1){
					user.gender = 'Male';
				} else user.gender = 'Female';
			}

			if(user.sAge === null || user.sAge === undefined) completePersonalQns = false;
			else personalScore += Number(user.sAge);

			if(user.sEducationLevel === null || user.sEducationLevel === undefined) completePersonalQns = false;
			else {
				personalScore += Number(user.sEducationLevel);
				if(Number(user.sEducationLevel) === 5){
					user.educationLevel = 'PhD';
				} else if(Number(user.sEducationLevel) === 4) {
					user.educationLevel = 'Masters';
				} else if (Number(user.sEducationLevel) === 3) {
					user.educationLevel = 'Graduate';
				} else if (Number(user.sEducationLevel) === 2) {
					user.educationLevel = 'Undergraduate';
				} else if (Number(user.sEducationLevel) === 1){
					user.educationLevel = 'A/O/N Levels';
				} else user.educationLevel = 'PSLE';
			}

			if(user.sMaritalStatus === null || user.sMaritalStatus === undefined) completePersonalQns = false;
			else {
				personalScore += Number(user.sMaritalStatus);		
				if(Number(user.sMaritalStatus) === 3) user.maritalStatus = 'Married';
			}

			if(user.sLocativeSituation === null || user.sLocativeSituation === undefined) completePersonalQns = false;
			else personalScore += Number(user.sLocativeSituation);	

			if(user.sLocativeType === null || user.sLocativeType === undefined) completePersonalQns = false;
			else personalScore += Number(user.sLocativeType);

			if(user.sNoOfDependents === null || user.sNoOfDependents === undefined) completePersonalQns = false;
			else {
				personalScore += Number(user.sNoOfDependents);
				if (Number(user.sNoOfDependents) === 3){
					user.noOfDependents = 0;
				} else if (Number(user.sNoOfDependents) === 2){
					user.noOfDependents = 1;
				} else if (Number(user.sNoOfDependents) === 1){
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
			if(user.sCurrentOccupation === null || user.sCurrentOccupation === undefined) completeJobQns = false;
			else {
				jobScore += Number(user.sCurrentOccupation);
				if(Number(user.sCurrentOccupation) === 3){
					user.currentOccupation = 'Salaried Employee';
				} else if (Number(user.sCurrentOccupation) === 2){
					user.currentOccupation = 'Businessman/Self-employed';
				} else if (Number(user.sCurrentOccupation) === 1){
					user.currentOccupation = 'Student';
				}else user.currentOccupation = 'Unemployed';
			}

			if(user.sCurrentWorkPeriod === null || user.sCurrentWorkPeriod === undefined) completeJobQns = false;
			else jobScore += Number(user.sCurrentWorkPeriod);
			if(user.sLastWorkPeriod === null || user.sLastWorkPeriod === undefined) completeJobQns = false;
			else jobScore += Number(user.sLastWorkPeriod);	

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
			if(user.sMonthlyIncome === null || user.sMonthlyIncome === undefined) completeFinanceQns = false;
			else financeScore += Number(user.sMonthlyIncome);
			if(user.sMonthlyExpense === null || user.sMonthlyExpense === undefined) completeFinanceQns = false;
			else financeScore += Number(user.sMonthlyExpense);
			if(user.sMonthlySavings === null || user.sMonthlySavings === undefined) completeFinanceQns = false;
			else financeScore += Number(user.sMonthlySavings);
			if(user.sCreditHistory === null || user.sCreditHistory === undefined) completeFinanceQns = false;
			else financeScore += Number(user.sCreditHistory);		
			if(user.sBankruptStatus === null || user.sBankruptStatus === undefined) completeFinanceQns = false;
			else financeScore += Number(user.sBankruptStatus);	
			if(user.sNumberOfCreditCards === null || user.sNumberOfCreditCards === undefined) completeFinanceQns = false;
			else financeScore += Number(user.sNumberOfCreditCards);	

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

angular.module('users').controller('SettingsController', ['$scope', '$http','$state','$timeout' ,'$location', 'Users', 'Authentication', 'Upload',
	function($scope, $http, $state, $timeout,$location, Users, Authentication, Upload) {
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
				// If successful 
				// $scope.imgUrl = '';
				// $timeout(function(){
				
				// // 	// $state.transitionTo($state.current, $stateParams, {
				// // 	//     reload: true,
				// // 	//     inherit: false,
				// // 	//     notify: true
				// // 	// });
				// $scope.imgUrl = url; 
				// $state.go($state.current, {}, {reload: true});
				// },10000);
				$scope.decachedImageUrl = url + '?decache=' + Math.random();
				$state.go($state.current, {}, {reload: true});
				//$route.reload();     
		        //document.getElementById("avatar_url").value = url;
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
				//var resp = JSON.parse(response);
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
		}else if (creditRating >=0 && creditRating < 32){
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
			qnModel: 'user.sGender', // TO update 
			content: 'What is your Gender?',
			options: ['Male', 'Female'],
			rating: {
				'Male': 1,
				'Female': 0
			}
		},
		{
			qnID: 'age',
			qnModel: 'user.sAge',
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
			qnModel: 'user.sEducationLevel', // To Update
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
			qnModel: 'user.sMaritalStatus', //To Update
			content: 'What is your Marital Status?',
			options: ['Married', 'Single/Divorced/Widowed'],
			rating: {
				'Married': 3,
				'Single/Divorced/Widowed': 1
			}

		},
		{
			qnID: 'locativeType',
			qnModel: 'user.sLocativeType',
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
			qnModel: 'user.sLocativeSituation',
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
			qnModel: 'user.sNoOfDependents', //To Update
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
			qnModel: 'user.sCurrentOccupation', //To Update
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
			qnModel: 'user.sCurrentWorkPeriod', 
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
			qnModel: 'user.sLastWorkPeriod',
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
			qnModel: 'user.sMonthlyIncome',
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
			qnModel: 'user.sMonthlyExpense',
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
			qnModel: 'user.sMonthlySavings',
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
			qnModel: 'user.sCreditHistory',
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
			qnModel: 'user.sBankruptStatus',
			content: 'Have you been bankrupt in the last 6 years?',
			options: ['Yes', 'No'],
			rating: {
				'Yes': 0,
				'No': 4,
			}

		},
		{
			qnID: 'numberOfCreditCards',
			qnModel: 'user.sNumberOfCreditCards',
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

	return {
		qnsPersonal: function(){
			return qnsPersonal;
		},
		qnsJob: function(){
			return qnsJob;
		},
		qnsFinance: function(){
			return qnsFinance;
		}
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