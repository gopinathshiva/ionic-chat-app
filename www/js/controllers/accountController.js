/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.accountController', []).controller('accountController', function ($scope, $ionicPopup, $firebaseAuth, Auth, $ionicLoading) {
    $scope.user = {};
    $scope.inputType = 'password';
    $scope.provider = JSON.parse(localStorage.getItem("token")).provider;
    var userInfo = JSON.parse(localStorage.getItem("userData"));
    $scope.showHidePassword = function (value) {
        if (value) {
            $scope.inputType = "text";
        } else {
            $scope.inputType = "password";
        }
    };

    $scope.changePassword = function () {
        $ionicLoading.show();
        var auth = Auth.getRef;
        auth = $firebaseAuth(auth);
        auth.$changePassword(userInfo.email, $scope.user.oldPassword, $scope.user.newPassword).then(function (data) {
            $ionicLoading.hide();
        }, function (err) {
            $ionicPopup.alert({
                title: "Alert",
                template: err.message
            });
            $ionicLoading.hide();
            console.log("change password service error" + err);
        });
    };

    $scope.saveUser = function () {

    };
});
