angular.module('starter.controllers', [])

        .controller('loginController', function ($scope, $state, $ionicLoading, $ionicPopup, Auth, loginService, userInfo) {
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
            $scope.auth = Auth.getFirebaseRef();

            $scope.loginProvider = function (providerName) {
                $ionicLoading.show();
                loginService.loginProvider(providerName).then(function (data) {
                    userInfo.setUserDetail(data);
                    Auth.getRef.child("users").child(data.uid).set(data);
                    $ionicLoading.hide();
                    $state.go('dashboard.chat');
                    console.log(JSON.stringify(data));
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

        .controller('slideBarController', function ($scope, Auth, $state, userInfo) {
            $scope.isLogin = false;
            $scope.menus = [
                {name: "Chat", url: "dashboard.chat", icon: "icon ion-chatboxes"},
                {name: "Friends", url: "dashboard.friends", icon: "icon ion-person-stalker"},
                {name: "Add Friend", url: "dashboard.addFriend", icon: "icon ion-person-add"},
                {name: "Profile", url: "dashboard.profile", icon: "icon ion-person"},
                {name: "About", url: "dashboard.about", icon: "icon ion-ionic"},
                {name: "Contact Us", url: "dashboard.contactUs", icon: "icon ion-android-call"}
            ];

            if (localStorage.getItem('provider').toLowerCase() === "password") {
                $scope.menus.splice(2, 0, {name: "Account", url: "dashboard.account", icon: "icon ion-person-stalker"});
            }

            if (userInfo.profileName) {
                $scope.userImageUrl = userInfo.profilePicture;
                $scope.userName = userInfo.profileName;
            }
            $scope.signOut = function () {
                Auth.logout();
                localStorage.removeItem('accessToken');
                localStorage.removeItem('provider');
                $state.go('login');
            };
        })

        .controller('chatController', function ($scope, $rootScope, $ionicNavBarDelegate, $firebase, $ionicLoading, Auth, userInfo) {
            var ref = Auth.getRef;
//            var messageRef = $firebase(ref.child('messages'));
//            var senderName = userInfo.profileName;
//            $scope.messages = messageRef.$asArray();
//
//            $ionicLoading.show();
//            $scope.messages.$loaded().then(function (data) {
//                $ionicLoading.hide();
//                console.log("messages : " + JSON.stringify($scope.messages));
//            }, function (error) {
//                console.log("get message service error:" + JSON.stringify(error));
//                $ionicLoading.hide();
//            });

            $scope.send = function (message) {
                $scope.newMessage = '';
                var objDiv = document.getElementById("chatfooter");
                objDiv.scrollTop = objDiv.scrollHeight;
                var msgObj = {
                    message: message,
                    sender: senderName,
                    receiver: "Shiva",
                    timeStamp: new Date().getTime(),
                    isRead: false
                };

                messageRef.$push(msgObj).then(function (data) {
                    console.log(data.key());
                }, function (err) {
                    console.log("push message service error:" + JSON.stringify(err));
                });
            };
        })

        .controller('profileController', function ($scope, $rootScope, $ionicNavBarDelegate) {
            $rootScope.getPreviousTitle = $ionicNavBarDelegate.getPreviousTitle();
        });
