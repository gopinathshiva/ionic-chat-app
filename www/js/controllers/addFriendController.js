/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('starter.addFriendController', []).controller('addFriendController', function ($scope, $firebase, Auth) {
    var homeRef = Auth.getRef;
    var addFriendRef = $firebase(homeRef.child("addFriend"));
    $scope.addFriends = addFriendRef.$asArray();
    $scope.addFriends = [
        {
            userName: "Gopi",
            userEmail: "sgopinath31@gmail.com",
            userPicture: "./img/ionic.png",
            message: "hey"
        },
        {
            userName: "",
            userEmail: "",
            userPicture: "",
            message: ""
        },
        {
            userName: "",
            userEmail: "",
            userPicture: "./img/ionic.png",
            message: ""
        }
    ];
    $scope.accept = function (user) {
        var friendsRef = $firebase(homeRef.child("friends"));
        friendsRef.child(user.userEmail).push(user);
    };

    $scope.reject = function (user) {
        $scope.addFriends.$remove(user.userEmail).then(function (ref) {
            ref.key() === user.userEmail; // true
        });
    };
});