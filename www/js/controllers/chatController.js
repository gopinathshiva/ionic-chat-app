/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter.chatController', []).controller('chatController', function ($scope, $ionicScrollDelegate, $firebase, $ionicLoading, Auth, userInfo) {

    var ref = Auth.getRef.child('messages');
    var messageRef = $firebase(ref);
    var senderName = userInfo.profileName;
    $scope.messages = messageRef.$asArray();

    $ionicLoading.show();
    $scope.messages.$loaded().then(function (data) {
        $ionicLoading.hide();
        $ionicScrollDelegate.scrollBottom();
        //console.log("messages : " + JSON.stringify($scope.messages));
    }, function (error) {
        console.log("get message service error:" + JSON.stringify(error));
        $ionicLoading.hide();
    });

    ref.on('child_added', function (dataSnapshot) {
        $ionicScrollDelegate.scrollBottom();
    });

    $scope.send = function (message) {
        $scope.newMessage = '';
        $ionicScrollDelegate.scrollBottom();
        var msgObj = {
            message: message,
            sender: userInfo.email,
            senderName: senderName,
            receiver: "Shiva",
            timeStamp: new Date().getTime(),
            isRead: false,
            isSent: false,
            isReceived: false
        };

        $scope.messages.$add(msgObj).then(function (data) {
            console.log(data.key());
        }, function (err) {
            console.log("push message service error:" + JSON.stringify(err));
        });
    };
});

