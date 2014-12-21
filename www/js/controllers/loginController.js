/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('starter.loginController', []).controller('loginController', function ($scope, $state, $ionicLoading, $ionicPopup, Auth, loginService, userInfo) {
    $scope.user = {};
    $scope.showPassword = false;
    $scope.inputType = "password";
    var isNewUser = false;
    $scope.onSignUp = function () {
        $scope.showSignUp = false;
        $scope.pageTitle = 'Sign Up';
    };
    $scope.onSignIn = function () {
        $scope.showSignUp = true;
        $scope.pageTitle = 'Sign In';
    };
//
    $scope.auth = Auth.getFirebaseRef();

    $scope.loginProvider = function (providerName) {
        loginService.loginProvider(providerName, "email").then(function (data) {
            console.log(JSON.stringify(data));
            $ionicLoading.hide();
            userInfo.setUserDetail(data);
            Auth.getRef.child("users").child(data.uid).set(data);
            $ionicLoading.hide();
            $state.go('dashboard.chat');
            console.log(JSON.stringify(data));
        }, function (error) {
            $ionicLoading.hide();
        });
    };

    $scope.showHidePassword = function (value) {
        if (value) {
            $scope.inputType = "text";
        } else {
            $scope.inputType = "password";
        }
    };

    $scope.signUp = function () {
        $ionicLoading.show();
        loginService.createAccount($scope.user.email, $scope.user.password).then(function (authData) {
            isNewUser = true;
            $ionicLoading.hide();
            var regSuccess = $ionicPopup.alert({
                title: 'Registration Success',
                template: 'Welcome ' + $scope.user.email
            });
            regSuccess.then(function () {
                isNewUser = false;
                $scope.signIn();
            });
        }, function (error) {
            $ionicLoading.hide();
            isNewUser = false;
            handleError(error, "Registration Failed!");
        });
    };
    $scope.signIn = function () {
        $ionicLoading.show();
        loginService.customLogin($scope.user.email, $scope.user.password).then(function (data) {
            if (isNewUser) {
                Auth.getRef.child("users").child(data.uid).set(data);
            }
            $ionicLoading.hide();
            $state.go('dashboard.chat');
        }, function (error) {
            handleError(error, "Login Failed!");
            $ionicLoading.hide();
            console.log("custom login error:" + JSON.stringify(error));
        });
    };

    function handleError(error, title) {
        var template = "";
        switch (error.code) {
            case "INVALID_EMAIL":
                template = 'Please Enter Valid Email ID';
                break;
            case "INVALID_PASSWORD":
                template = 'Your Password is Wrong';
                break;
            case "INVALID_USER":
                template = 'Email ID you entered is not Registered';
                break;
            default:
                template = "Try Again";
        }
        $ionicPopup.alert({
            title: title,
            template: template
        });
    }
})
