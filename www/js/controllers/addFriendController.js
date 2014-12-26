/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('starter.addFriendController', []).controller('addFriendController', function ($scope, $firebase, $ionicModal, $ionicPopup, Auth, friendService, $ionicLoading, userInfo) {
    $ionicLoading.show();

    $scope.currentUID = userInfo.fullUserDetail.uid;
    var currentProvider = userInfo.fullUserDetail.provider;
    console.log("current uid:" + $scope.currentUID);

    friendService.getAddFriendsService($scope.currentUID).then(function (data) {
        $scope.addFriends = data;
        $ionicLoading.hide();
    }, function (err) {
        console.log("search user service error:" + JSON.stringify(err));
        $ionicLoading.hide();
    });

//    var homeRef = Auth.getRef;
//    var addFriendRef = homeRef.child("addFriends");
//
//    addFriendRef = $firebase(addFriendRef);
//    $scope.addFriends = addFriendRef.$asArray();
//    $scope.addFriends.$loaded().then(function () {
//        $ionicLoading.hide();
//    }, function (err) {
//        $ionicLoading.hide();
//    });


//    $scope.addFriends = [
//        {
//            userName: "Gopi",
//            userEmail: "sgopinath31@gmail.com",
//            userPicture: "./img/ionic.png",
//            message: "hey"
//        },
//        {
//            userName: "",
//            userEmail: "",
//            userPicture: "",
//            message: ""
//        },
//        {
//            userName: "",
//            userEmail: "",
//            userPicture: "./img/ionic.png",
//            message: ""
//        }
//    ];

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

    $scope.sendRequest = function (user, idx) {
        $ionicLoading.show();
        friendService.sendFriendRequest($scope.currentUID, user.uid).then(function (data) {
            if (data) {
                $scope.searchFriends.splice(idx, 1);
            }
            $ionicLoading.hide();
        }, function (err) {
            console.log("send request service error:" + JSON.stringify(err));
            $ionicLoading.hide();
        });
        console.log("current user id:" + $scope.currentUID + "with provider:" + currentProvider + " is sending request to " + user.uid);
    };

    $scope.blockUser = function (user, idx) {
        $scope.searchFriends.splice(idx, 1);
        console.log("current user id:" + $scope.currentUID + "with provider:" + currentProvider + " is blocking " + user.uid);
    };
});