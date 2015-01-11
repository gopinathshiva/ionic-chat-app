
angular.module('starter.friendsController', []).controller('friendsController', ['$scope', 'Auth', '$firebase', '$state', '$ionicLoading', 'friendService', 'userInfo', function ($scope, Auth, $firebase, $state, $ionicLoading, friendService, userInfo) {
        $ionicLoading.show();
        var userInfo = JSON.parse(localStorage.getItem("userData"));
        var homeRef = Auth.getRef;
        var friendRef = $firebase(homeRef.child("friends/" + userInfo.uid));
        var friends = friendRef.$asArray();

        $scope.onClickFriends = function (userData) {
            localStorage.removeItem('currentChatUser');
            var obj = {
                name: userData.name,
                email: userData.email,
                picture: userData.picture,
                status: userData.status,
                uid: userData.uid
            };
            localStorage.setItem('currentChatUser', JSON.stringify(obj));
            $state.go('dashboard.chat');
        };

        friends.$loaded().then(function () {
            var uids = [];
            for (var i = 0; i < friends.length; i++) {
                uids.push(friends[i].uid);
            }
            friendService.getUserDetail(uids).then(function (data) {
                $scope.friends = data;
                $ionicLoading.hide();
            }, function (error) {
                $ionicLoading.hide();
                console.log("get user detail service error:" + JSON.stringify(error));
            });
        });
    }]);