/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('starter.loginController', []).controller('loginController', function ($scope, $state, $ionicLoading, $ionicPopup, Auth, loginService, userInfo) {
    $scope.user = {};
    var userObj = {
        email: "",
        name: "",
        picture: "",
        provider: "",
        gender: "",
        status: ""
    };
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

    $scope.loginProvider = function (providerName) {
        loginService.loginProvider(providerName, "email").then(function (data) {
            //console.log(JSON.stringify(data));
            $ionicLoading.hide();
            userInfo.setUserDetail(data);
            if (data.provider.toLowerCase() === "google") {
                userObj.email = data.google.email;
                userObj.name = data.google.displayName;
                userObj.picture = data.google.cachedUserProfile.picture;
                userObj.gender = data.google.cachedUserProfile.gender;
                userObj.provider = data.provider;

            } else if (data.provider.toLowerCase() === "facebook") {
                userObj.email = data.facebook.email;
                userObj.name = data.facebook.displayName;
                userObj.picture = data.facebook.cachedUserProfile.picture.data.url;
                userObj.gender = data.facebook.cachedUserProfile.gender;
                userObj.provider = data.facebook;
            }
            createUser(data.uid, userObj);
            $ionicLoading.hide();
            $state.go('dashboard.chat');
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
            $scope.signIn();
        }, function (error) {
            $ionicLoading.hide();
            isNewUser = false;
            handleError(error, "Registration Failed!");
        });
    };

    function createUser(id, obj) {
        Auth.getRef.child("users").child(id).set(obj);
    }

    $scope.signIn = function () {
        $ionicLoading.show();
        loginService.customLogin($scope.user.email, $scope.user.password).then(function (data) {
            if (isNewUser) {
                isNewUser = false;
                $ionicPopup.alert({
                    title: 'Registration Success',
                    template: 'Welcome ' + $scope.user.email
                });
            }
            userObj.email = data.password.email;
            userObj.provider = "password";
            createUser(data.uid, userObj);
            userInfo.setUserDetail(data);
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
            case "EMAIL_TAKEN":
                template = 'Email ID you entered is already Registered';
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
