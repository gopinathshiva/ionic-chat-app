/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('starter.friendsController', []).controller('friendsController', ['$scope', 'Auth', '$firebase', function ($scope, Auth, $firebase) {
        var homeRef = Auth.getRef;
        var friendRef = $firebase(homeRef.child("friends"));
        $scope.friends = friendRef.$asArray();
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