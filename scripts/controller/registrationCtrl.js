/**
 * Created by Rajinda on 4/6/2016.
 */

'use strict'
routerApp.controller('registrationCtrl', function ($rootScope,$scope, $state,dataParser) {


    $scope.profile={};
    $scope.profile.server ={};
    $scope.profile.server.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3YXJ1bmFAZHVvc29mdHdhcmUuY29tIiwianRpIjoiMTk2N2E5MjItNmIyOS00NDgxLWI2MWUtOTMwZjVmMDA3ZDM3Iiwic3ViIjoiZTBlNTNhOWUtZjNkZi00MTZjLWFmZWItYzI2ZDVhZWIwYWY2IiwiZXhwIjoxNDY1MzEyMTQ2LCJ0ZW5hbnQiOiIxIiwiY29tcGFueSI6IjMiLCJjbGllbnQiOiIxIiwic2NvcGUiOlt7InJlc291cmNlIjoiYXJkc3Jlc291cmNlIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InJlYWQifSx7InJlc291cmNlIjoid3JpdGUifSx7InJlc291cmNlIjoiZGVsZXRlIn0seyJyZXNvdXJjZSI6InJlc291cmNlIiwiYWN0aW9ucyI6WyJhcmRzcmVzb3VyY2UiLCJyZWFkIiwid3JpdGUiLCJkZWxldGUiLCJyZXNvdXJjZSJdfV0sImlhdCI6MTQ2NDcwNzM0Nn0.brIo8b6per6a1Djm4armChkS4L2O6T40HSrlj-scwcg";

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