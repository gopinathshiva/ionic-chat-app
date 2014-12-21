angular.module('starter.slideBarController', [])

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
        });
