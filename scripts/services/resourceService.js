/**
 * Created by Rajinda on 12/31/2015.
 */

var clusterModule = angular.module("resourceServiceModule", []);


clusterModule.factory("resourceService", function ($http, $log, baseUrl,dataParser) {
//Format is Authorization: Bearer [token]
    var breakRequest = function (resourceId,reason) {
        return $http({
            method: 'put',
            url: baseUrl + resourceId + "/state/NotAvailable/reason/"+reason,
            headers: {
                'authorization': "Bearer "+  dataParser.userProfile.server.token
            }
        }).then(function (response) {
            return response.data.IsSuccess;
        });
    };

    var endBreakRequest = function (resourceId,reason) {

        return $http({
            method: 'put',
            url: baseUrl + resourceId + "/state/Available/reason/EndBreak",
            headers: {
                'authorization': "Bearer "+  dataParser.userProfile.server.token
            }
        }).then(function (response) {
            return response.data.IsSuccess;
        });

    };

    return {
        BreakRequest: breakRequest,
        EndBreakRequest: endBreakRequest
    }

});
