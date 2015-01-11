/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('starter.addFriendController', []).controller('addFriendController', function ($scope, $firebase, $ionicModal, $ionicPopup, Auth, friendService, $ionicLoading) {
    $ionicLoading.show();
    var userInfo = JSON.parse(localStorage.getItem("userData"));
    $scope.currentUID = userInfo.fullUserDetail.uid;
    var currentProvider = JSON.parse(localStorage.getItem("token")).provider;
    console.log("current uid:" + $scope.currentUID);

    var addFriends = [];
    friendService.getAddFriendsService($scope.currentUID).then(function (data) {
        addFriends = data;
        addFriends.$loaded().then(function (data) {
            console.log(data, addFriends);
            var uids = [];
            for (var i = 0; i < addFriends.length; i++) {
                uids.push(addFriends[i].uid);
            }
            friendService.getUserDetail(uids).then(function (data) {
                console.log(data, $scope.addFriends);
                $scope.addFriends = data;
                $ionicLoading.hide();
            }, function (error) {
                $ionicLoading.hide();
                console.log("get user detail service error:" + JSON.stringify(error));
            });

            //console.log("messages : " + JSON.stringify($scope.messages));
        }, function (error) {
            console.log("get add friends service error:" + JSON.stringify(error));
            $ionicLoading.hide();
        });

    }, function (err) {
        console.log("search user service error:" + JSON.stringify(err));
        $ionicLoading.hide();
    });

    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.searchFriends = [];
        $scope.modal.remove();
    });
    $scope.search = function (user) {
        if (!user) {
            return;
        }
        $scope.searchedUser = user;
        $ionicLoading.show();
        $scope.modal.show();
        friendService.isUserBlocked(user).then(function (data) {
            if (!data) {
                doSearchUser(user);
            } else {
                $ionicLoading.hide();
            }
        }, function (err) {
            console.log("is user blocked service error" + JSON.stringify(err));
            $ionicLoading.hide();
        });
    };

    function doSearchUser(user) {
        friendService.searchUser(user).then(function (data) {
            $scope.searchFriends = data;
            $ionicLoading.hide();
        }, function (err) {
            console.log("search user service error:" + JSON.stringify(err));
            $ionicLoading.hide();
        });
    }

    $scope.accept = function (user, idx) {
        $ionicLoading.show();
        friendService.addUser($scope.currentUID, user.uid).then(function (data) {
            callRemoveUserFunction(user, idx);
        });
    };

    function callRemoveUserFunction(user, idx) {
        $ionicLoading.show();
        friendService.removeUser($scope.currentUID, user.uid).then(function (data) {
            $scope.addFriends.splice(idx, 1);
            $ionicLoading.hide();
        });
    }

    $scope.reject = function (user, idx) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Please Confirm once',
            template: 'Are you sure you want to reject this user?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                callRemoveUserFunction(user, idx);
            }
        });
    };

    $scope.sendRequest = function (user, idx) {
        $ionicLoading.show();
        friendService.sendFriendRequest($scope.currentUID, user.uid).then(function (data) {
            removeSearchedUser(user, idx);
        }, function (err) {
            console.log("send request service error:" + JSON.stringify(err));
            $ionicLoading.hide();
        });
        console.log("current user id:" + $scope.currentUID + "with provider:" + currentProvider + " is sending request to " + user.uid);
    };

    function removeSearchedUser(user, idx) {
        $scope.searchFriends.splice(idx, 1);
        if ($scope.searchFriends && $scope.searchFriends.length === 0) {
            $scope.modal.hide();
        }
        $ionicLoading.hide();
    }

    $scope.blockUser = function (user, idx) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Please Confirm once',
            template: 'Are you sure you want to block this user?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                $ionicLoading.show();
                friendService.blockUser($scope.currentUID, user).then(function () {
                    removeSearchedUser(user, idx);
                });
            }
        });
    };
});