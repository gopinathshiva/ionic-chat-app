/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('starter.friendsController', []).controller('friendsController', ['$scope', 'Auth', '$firebase', '$ionicLoading', 'friendService', 'userInfo', function ($scope, Auth, $firebase, $ionicLoading, friendService, userInfo) {
        $ionicLoading.show();
        var homeRef = Auth.getRef;
        var friendRef = $firebase(homeRef.child("friends/" + userInfo.fullUserDetail.uid));
        var friends = friendRef.$asArray();
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

//        $scope.friends = [
//            {
//                friendName: "Gopi",
//                friendEmail: "sgopinath31@gmail.com",
//                status: "hi",
//                friendPicture: "./img/ionic.png"
//            },
//            {
//                friendName: "",
//                friendEmail: "",
//                status: "",
//                friendPicture: ""
//            },
//            {
//                friendName: "",
//                friendEmail: "",
//                status: "",
//                friendPicture: "./img/ionic.png"
//            }
//        ];
    }]);