/**
 * Created by Damith on 4/6/2016.
 */

'use strict';

var routerApp = angular.module('veerySoftPhone',
    ['ui.bootstrap', 'ui.router', 'btford.socket-io',
        'ui-notification', 'ngAnimate', 'timer']);

routerApp.config(["$httpProvider", "$stateProvider", "$urlRouterProvider",
    function ($httpProvider, $stateProvider, $urlRouterProvider) {
        /*
         $httpProvider.defaults.headers.post['Content-Type'] = 'multipart/form-data';
         $httpProvider.defaults.useXDomain = true;
         delete $httpProvider.defaults.headers.common['X-Requested-With'];
         $httpProvider.defaults.headers.common["Content-Type"] = "application/x-www-form-urlencoded";


         */
        $urlRouterProvider.otherwise('/reg');
        $stateProvider
            .state("register", {
                url: "/reg",
                templateUrl: "views/registration-view.html"
            }).state("status", {
                url: "/status",
                templateUrl: "views/agentStatusWidget.html"
            }).state("callControl", {
                url: "/callControl",
                templateUrl: "views/callControl-views.html"

            });
    }]);