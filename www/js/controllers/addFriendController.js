/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('starter.addFriendController', []).controller('addFriendController', function ($scope, $firebase, $ionicModal, $ionicPopup, Auth, friendService, $ionicLoading) {
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

    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    $scope.search = function (user) {
        if (!user) {
            return;
        }
        $scope.searchedUser = user;
        $ionicLoading.show();
        $scope.modal.show();
        friendService.searchUser(user).then(function (data) {
            $scope.searchFriends = data;
            $ionicLoading.hide();
        }, function (err) {
            console.log("search user service error:" + JSON.stringify(err));
            $ionicLoading.hide();
        });
    };

    $scope.accept = function (user) {
//        var friendsRef = $firebase(homeRef.child("friends"));
//        friendsRef.child(user.userEmail).push(user);
    };


    $scope.reject = function (user) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Please Confirm once',
            template: 'Are you sure you want to reject this user?'
        });
        confirmPopup.then(function (res) {
            if (res) {
//                $scope.addFriends.$remove(user.userEmail).then(function (ref) {
//                    ref.key() === user.userEmail; // true
//                });
            } else {
                console.log('You are not sure');
            }
        });
    };

    $scope.sendRequest = function () {
        console.log("send request clicked");
    };

    $scope.blockUser = function () {
        console.log("blockUser clicked");
    };
});