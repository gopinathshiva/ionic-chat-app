/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('starter.friendsController', []).controller('friendsController', function ($scope, $rootScope, $ionicNavBarDelegate) {
    $rootScope.getPreviousTitle = $ionicNavBarDelegate.getPreviousTitle();
});