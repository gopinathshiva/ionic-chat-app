angular.module('starter.slideBarController', [])

        .controller('slideBarController', function ($scope, Auth, $state, $cookieStore) {

            var userInfo = JSON.parse(localStorage.getItem("userData"));
            if (userInfo) {
                if (userInfo.picture) {
                    $scope.userImageUrl = userInfo.picture;
                    $scope.userName = userInfo.name;
                } else {
                    $scope.userName = userInfo.email;
                }
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
                $cookieStore.put('isLoggedIn', false);
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
                $state.go('login');
            };
        });
