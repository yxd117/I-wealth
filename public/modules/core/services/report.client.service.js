'use strict';

angular.module('core').factory('ReportGenerationService', function($rootScope, $resource){
	var state;

    var broadcast = function (state) {
      $rootScope.$broadcast('ReportGenerationService.Update', state);
    };

    var update = function (newState) {
      state = newState;
      broadcast(state);
    };
    
    var onUpdate = function ($scope, callback) {
      $scope.$on('ReportGenerationService.Update', function (newState) {
        callback(newState);
      });
    };

    return {
      update: update,
      state: state,
      listen: onUpdate
    };
});