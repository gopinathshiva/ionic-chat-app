/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.accountController', []).controller('accountController', function ($scope) {
    $scope.user = {};
    $scope.inputType = 'password';
    $scope.showHidePassword = function (value) {
        if (value) {
            $scope.inputType = "text";
        } else {
            $scope.inputType = "password";
        }
    };

    $scope.saveUser = function () {

    };
});
