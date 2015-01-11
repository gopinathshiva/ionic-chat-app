var app = angular.module('starter.services', []);
app.factory("Auth", ["$firebaseAuth", "$q", function ($firebaseAuth, $q) {
        var ref = new Firebase("https://incandescent-inferno-8147.firebaseio.com/");
        var auth = {
            getRef: ref,
            getAuth: function (token) {
                var defer = $q.defer();
                ref.authWithCustomToken(token, function (error, authData) {
                    if (error) {
                        defer.reject(error);
                    } else {
                        defer.resolve(authData);
                    }
                });
                return defer.promise;
            },
            getOAuth: function (provider) {
                var defer = $q.defer();
                var token = JSON.parse(localStorage.getItem("token"));
                if (!token) {
                    defer.reject();
                } else {
                    ref.authWithOAuthToken(provider, token.accessToken, function (error, authData) {
                        if (error) {
                            defer.reject(error);
                        } else {
                            defer.resolve(authData);
                        }
                    });
                }
                return defer.promise;
            },
            logout: function () {
                return $firebaseAuth(ref).$unauth();
            }
        };
        return auth;
    }]);

app.factory('loginService', ['$firebaseAuth', '$q', function ($firebaseAuth, $q) {
        var ref = new Firebase("https://incandescent-inferno-8147.firebaseio.com/");
        var auth = $firebaseAuth(ref);
        var authLogin = {
            createAccount: function (email, password) {
                return auth.$createUser(email, password);
            },
            customLogin: function (email, password) {
                return auth.$authWithPassword({
                    email: email,
                    password: password,
                    rememberMe: true
                });
            },
            loginProvider: function (providerName, scope) {
                var defer = $q.defer();
                ref.authWithOAuthPopup(providerName, function (error, authData) {
                    if (error) {
                        defer.reject(error);
                    } else {
                        defer.resolve(authData);
                    }
                }, {
                    remember: "sessionOnly",
                    scope: scope
                });
                return defer.promise;
            }
        };
        return authLogin;
    }]);
app.factory('userInfo', ["$q", function ($q) {
        var userInfo = {
            setUserDetail: function (detail) {
                var defer = $q.defer();
                var authObj = {
                    authToken: detail.token,
                    accessToken: "",
                    provider: "",
                    uid: ""
                };
                userInfo.fullUserDetail = detail;
                if (detail.provider.toLowerCase() === "google") {
                    userInfo.name = detail.google.displayName;
                    userInfo.email = detail.google.email;
                    userInfo.picture = detail.google.cachedUserProfile.picture;
                    userInfo.accessToken = detail.google.accessToken;
                    authObj.accessToken = detail.google.accessToken;
                } else if (detail.provider.toLowerCase() === "facebook") {
                    userInfo.name = detail.facebook.displayName;
                    userInfo.email = detail.facebook.email;
                    userInfo.picture = detail.facebook.cachedUserProfile.picture.data.url;
                    userInfo.accessToken = detail.facebook.accessToken;
                    authObj.accessToken = detail.facebook.accessToken;
                } else {
                    userInfo.email = detail.password.email;
                }
                userInfo.uid = detail.uid || detail.auth.uid;
                authObj.uid = detail.uid || detail.auth.uid;
                authObj.provider = detail.provider || detail.auth.provider;
                localStorage.setItem('userData', JSON.stringify(userInfo));
                localStorage.setItem('token', JSON.stringify(authObj));
                userInfo.authToken = detail.token;
                defer.resolve(userInfo);
                return defer.promise;
            }
        };
        return userInfo;
    }]);

app.factory('friendService', function (Auth, $q, $firebase) {
    var user = {
        searchUser: function (email) {
            var defer = $q.defer();
            var searchRef = Auth.getRef.child('users');
            var users = [];
            searchRef.orderByChild('email').equalTo(email).once("value", function (snapshot) {
                if (!snapshot.val()) {
                    defer.resolve(users);
                    return;
                }
                var data = snapshot.val();
                for (var key in data) {
                    data[key].uid = key;
                    users.push(data[key]);
                }
                console.log(JSON.stringify(users));
                defer.resolve(users);
            });
            return defer.promise;
        },
        getAddFriendsService: function (uid) {
            var defer = $q.defer();
            var getAddFriendRef = Auth.getRef.child("addFriends/" + uid);
            var getAddFriendRef = $firebase(getAddFriendRef);
            defer.resolve(getAddFriendRef.$asArray());
            return defer.promise;
        },
        sendFriendRequest: function (userID, requestID) {
            var defer = $q.defer();
            var getAddFriendRef = Auth.getRef.child("addFriends");
            var reqObj = {uid: userID};
            var ids = getAddFriendRef.child(requestID).push(reqObj);
            defer.resolve(ids.key());
            return defer.promise;
        },
        getUserDetail: function (uids) {
            var defers = [];
            if (!angular.isArray(uids)) {
                defers[0] = getUser(uids);
            } else {
                for (var i = 0; i < uids.length; i++) {
                    defers[i] = getUser(uids[i]);
                }
            }
            function getUser(uid) {
                var defer = $q.defer();
                var getAddFriendRef = Auth.getRef.child("users/" + uid);
                getAddFriendRef = $firebase(getAddFriendRef).$asObject();
                getAddFriendRef.$loaded().then(function (data) {
                    defer.resolve(data);
                });
                return defer.promise;
            }
            return $q.all(defers);
        },
        addUser: function (currentID, requestedID) {
            var defer1 = $q.defer();
            var defer2 = $q.defer();
            var getAddFriendRef = Auth.getRef.child("friends/" + currentID);
            var obj = {uid: requestedID};
            var addUser = getAddFriendRef.push(obj);
            defer1.resolve(addUser.key());
            getAddFriendRef = Auth.getRef.child("friends/" + requestedID);
            obj = {uid: currentID};
            addUser = getAddFriendRef.push(obj);
            defer2.resolve(addUser.key());
            return $q.all([defer1.promise, defer2.promise]);
        },
        removeUser: function (currentID, requestedID) {
            var defer = $q.defer();
            var getAddFriendRef = Auth.getRef.child("addFriends/" + currentID);
            getAddFriendRef.orderByChild('uid').equalTo(requestedID).once("value", function (snapshot) {
                var pushId = '';
                for (var propName in snapshot.val()) {
                    pushId = propName;
                    break;
                }
                Auth.getRef.child("addFriends/" + currentID + "/" + pushId).remove(function (data) {
                    defer.resolve(data);
                });
            });
            return defer.promise;
        },
        blockUser: function (currentID, requestedUser) {
            var defer = $q.defer();
            var getBlockUserRef = Auth.getRef.child("blockUser/" + currentID);
            var obj = {uid: requestedUser.uid, email: requestedUser.email};
            var blockedUser = getBlockUserRef.push(obj);
            defer.resolve(blockedUser.key());
            return defer.promise;
        },
        isUserBlocked: function (email) {
            var defer = $q.defer();
            var getBlockUserRef = Auth.getRef.child("blockUser");
            getBlockUserRef.orderByChild('email').equalTo(email).once("value", function (snapshot) {
                if (!snapshot.val()) {
                    defer.resolve(false);
                    return;
                }
                defer.resolve(true);
            });
            return defer.promise;
        }
    };
    return user;
});