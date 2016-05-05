/**
 * Created by Rajinda on 4/6/2016.
 */

'use strict'
routerApp.controller('registrationCtrl', function ($rootScope,$scope, $state,dataParser) {


    $scope.Register = function () {
            $rootScope.login = 0;
            dataParser.userProfile = $scope.profile;
            $state.go('callControl');
    };
    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };


});