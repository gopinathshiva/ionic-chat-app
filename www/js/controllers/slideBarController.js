angular.module('starter.slideBarController', [])

        .controller('slideBarController', function ($scope, Auth, $state, userInfo, $ionicLoading) {
            if (!localStorage.getItem("userData")) {
                $ionicLoading.show();
                var provider = JSON.parse(localStorage.getItem("token"));
                if (provider !== "password") {
                    Auth.getOAuth(provider).then(function (data) {
                        userInfo.setUserDetail(data).then(function (data) {
                            updateSlideScreen();
                        });
                    }, function (error) {
                        console.log("get OAuth service error" + JSON.stringify(error));
                        $ionicLoading.hide();
                    });
                } else {
                    userInfo.setUserDetail(data).then(function (data) {
                        updateSlideScreen();
                    });

                }
            } else {
                updateSlideScreen();
            }

            function updateSlideScreen() {
                var userInfo = JSON.parse(localStorage.getItem("userData"));
                if (userInfo.picture) {
                    $scope.userImageUrl = userInfo.picture;
                    $scope.userName = userInfo.name;
                } else {
                    $scope.userName = userInfo.email;
                }
                $ionicLoading.hide();
            }

            $scope.isLogin = false;
            $scope.menus = [
                {name: "Chat", url: "dashboard.chat", icon: "icon ion-chatboxes"},
                {name: "Friends", url: "dashboard.friends", icon: "icon ion-person-stalker"},
                {name: "Add Friend", url: "dashboard.addFriend", icon: "icon ion-person-add"},
                {name: "Account", url: "dashboard.account", icon: "icon ion-person-stalker"},
                {name: "Settings", url: "dashboard.settings", icon: "icon ion-android-settings"},
                {name: "About", url: "dashboard.about", icon: "icon ion-ionic"},
                {name: "Contact Us", url: "dashboard.contactUs", icon: "icon ion-android-call"}
            ];

            $scope.signOut = function () {
                Auth.logout();
                localStorage.removeItem('accessToken');
                localStorage.removeItem('provider');
                $state.go('login');
            };
        });
