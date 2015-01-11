/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.chatController', []).controller('chatController', function ($scope, $ionicNavBarDelegate, $ionicScrollDelegate, $firebase, $ionicLoading, Auth, userDatas) {
    $scope.currentChatUser = userDatas[0];
    $scope.userInfo = userDatas[1];
    $ionicNavBarDelegate.setTitle($scope.currentChatUser.name || $scope.currentChatUser.email);
    var ref = Auth.getRef.child('messages/' + $scope.userInfo.uid + "/" + $scope.currentChatUser.uid).limitToLast(20);
    var messageRef = $firebase(ref);
    var isRefreshing = false;

    function loadMessages() {
        if (!isRefreshing) {
            $ionicLoading.show();
        }
        $scope.messages = messageRef.$asArray();
        $scope.messages.$loaded().then(function () {
            $ionicScrollDelegate.scrollBottom();
            if (isRefreshing) {
                isRefreshing = false;
                $scope.$broadcast('scroll.refreshComplete');
            } else {
                isRefreshing = false;
                $ionicLoading.hide();
            }
            //console.log("messages : " + JSON.stringify($scope.messages));
        }, function (error) {
            console.log("get message service error:" + JSON.stringify(error));
            if (isRefreshing) {
                $scope.$broadcast('scroll.refreshComplete');
            } else {
                $ionicLoading.hide();
            }
        });
    }

    loadMessages();

    ref.on('child_added', function () {
        $ionicScrollDelegate.scrollBottom();
    });
    $scope.doRefresh = function () {
        isRefreshing = true;
        loadMessages();
    };
    $scope.send = function (message) {
        $scope.newMessage = '';
        $ionicScrollDelegate.scrollBottom();
        var msgObj = {
            sender: $scope.userInfo.email,
            senderName: $scope.userInfo.name || '',
            receiver: "Shiva",
            receiverName: '',
            message: message,
            timeStamp: new Date().getTime(),
            isRead: false,
            isSent: false,
            isReceived: false
        };
        $scope.messages.$add(msgObj).then(function (data) {
            console.log("message added with key:" + data.key());
            var item = $scope.messages.$getRecord(data.key());
            item.isSent = true;
            $scope.messages.$save(item).then(function (data) {
                console.log("message updated with key" + data.key());
            }, function (err) {
                console.log("update message service error:" + JSON.stringify(err));
            });
        }, function (err) {
            console.log("add message service error:" + JSON.stringify(err));
        });
    };
});

