/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



angular.module('starter.profileController', []).controller('profileController', function ($scope, $rootScope, $ionicNavBarDelegate) {
    $rootScope.getPreviousTitle = $ionicNavBarDelegate.getPreviousTitle();
});