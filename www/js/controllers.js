angular.module('starter.controllers', [])

        .controller('loginController', function ($scope, $state, $ionicLoading, $ionicPopup, Auth) {
            $scope.user = {};
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
            console.log(Auth.getAuth());

            $scope.loginProvider = function (providerName) {
                $ionicLoading.show();
                $scope.auth.$authWithOAuthPopup(providerName).then(function (data) {
                    $ionicLoading.hide();
                    $state.go('dashboard.chat');
                    console.log(data);
                });
//                loginService.loginProvider(providerName, 'email').then(function (data) {
//                    console.log("provider detail:" + JSON.stringify(data));
//                    sessionStorage.setItem("provider", data.provider);
//                    if (data.provider.toLowerCase() === "google") {
//                        sessionStorage.setItem("accessToken", data.google.accessToken);
//                    }
//                    else if (data.provider.toLowerCase() === "facebook") {
//                        sessionStorage.setItem("accessToken", data.facebook.accessToken);
//                    }
////                    loginService.provider = data.provider;
////                    loginService.googleUser = data.google;
////                    loginService.user = data;
//                    //saveToken(data);
//                    $ionicLoading.hide();
//                    $state.go('dashboard.chat');
//                }, function (error) {
//                    $ionicLoading.hide();
//                });
            };
            function createProfile(authData, user) {

//                var profileRef = $firebase(ref.child('profile'));
//                return profileRef.$set(authData.uid, user);
            }

            $scope.signUp = function () {
                $ionicLoading.show();
                $scope.auth.$createUser($scope.user.email, $scope.user.password).then(function (authData) {
                    $ionicLoading.hide();
                    var regSuccess = $ionicPopup.alert({
                        title: 'Registration Success',
                        template: 'Welcome ' + $scope.user.email
                    });
                    regSuccess.then(function () {
                        $scope.signIn();
                    });
                    //return createProfile($scope.user, authData);
                }, function (err) {
                    $ionicPopup.alert({
                        title: 'Registration Failure',
                        template: 'Try Again'
                    });
                });
            };
            $scope.signIn = function () {
                $ionicLoading.show();
                $scope.auth.$authWithPassword({
                    email: $scope.user.email,
                    password: $scope.user.password
                }).then(function (data) {
                    $ionicLoading.hide();
                    $state.go('dashboard.chat');
                    console.log("success");
                }, function (err) {
                    $ionicLoading.hide();
                    console.log("error");
                });
            }
//                loginService.login($scope.user.email, $scope.user.password).then(function (data) {
//                    sessionStorage.setItem('firebaseAuthToken', data.firebaseAuthToken);
////                    loginService.provider = data.provider;
////                    loginService.user = data;
//                    $ionicLoading.hide();
//                    $state.go('dashboard.chat');
//                }, function (err) {
//                    $ionicLoading.hide();
//                    if (err) {
//                        $ionicPopup.alert({
//                            title: 'Login Failure',
//                            template: err.code
//                        });
//                    }
//                })

        }
        )

        .controller('slideBarController', function ($scope, Auth, $state) {
            $scope.isLogin = false;
            $scope.menus = [
                {name: "Chat", url: "dashboard.chat"},
                {name: "Profile", url: "dashboard.profile"},
                {name: "About", url: "dashboard.about"},
                {name: "Contact Us", url: "dashboard.contactUs"}];
            $scope.signOut = function () {
                Auth.logout();
                $state.go('login');
            };
        })

        .controller('chatController', function ($scope, $rootScope, $ionicNavBarDelegate) {
            $rootScope.getPreviousTitle = $ionicNavBarDelegate.getPreviousTitle();
        })

        .controller('profileController', function ($scope, $rootScope, $ionicNavBarDelegate) {
            $rootScope.getPreviousTitle = $ionicNavBarDelegate.getPreviousTitle();
        });
