/**
 * Created by Rajinda on 4/6/2016.
 */

'use strict'
routerApp.controller('registrationCtrl', function ($rootScope,$scope, $state,dataParser) {

    $scope.profile={};
    $scope.profile.server ={};
    $scope.profile.server.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdWtpdGhhIiwianRpIjoiMTdmZTE4M2QtM2QyNC00NjQwLTg1NTgtNWFkNGQ5YzVlMzE1Iiwic3ViIjoiNTZhOWU3NTlmYjA3MTkwN2EwMDAwMDAxMjVkOWU4MGI1YzdjNGY5ODQ2NmY5MjExNzk2ZWJmNDMiLCJjbGllbnQiOiIxIiwiZXhwIjoxODkzMzAyNzUzLCJ0ZW5hbnQiOjEsImNvbXBhbnkiOjMsInNjb3BlIjpbeyJyZXNvdXJjZSI6ImFsbCIsImFjdGlvbnMiOiJhbGwifV0sImlhdCI6MTQ2MTI5OTE1M30._M8u4ElZESTdJtkQSEtr58kE97s0KiHeIaeWsoVc8Ho";


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