var app = angular.module('starter.services', []);
/**
 * A simple example service that returns some data.
 */
//app.factory('loginService', function ($firebaseSimpleLogin, $q, $rootScope, $state) {
//    var firebaseRef = new Firebase('https://incandescent-inferno-8147.firebaseio.com/');
//    var auth = $firebaseSimpleLogin(firebaseRef, function (err, data) {
//        alert(data);
//    });
//    function statusChange() {
//        fns.getUser().then(function (user) {
//            fns.user = user || null;
//        });
//    }
//
//    var fns = {
//        user: {},
//        provider: null,
//        googleUser: {},
//        fbUser: {},
//        normalUser: {},
//        getUser: function () {
//            return auth.$getCurrentUser();
//        },
//        loginProvider: function (providerName, scope) {
//            var defer = $q.defer();
//            firebaseRef.authWithOAuthPopup(providerName, function (error, authData) {
//                if (error) {
//                    defer.reject(error);
//                } else {
//                    defer.resolve(authData);
//                }
//            }, {
//                remember: "sessionOnly",
//                scope: scope
//            });
//            return defer.promise;
//        },
//        login: function (email, pass) {
//            return auth.$login('password', {
//                email: email,
//                password: pass,
//                rememberMe: true
//            });
//        },
//        logout: function () {
//            auth.$logout();
//            sessionStorage.removeItem('accessToken');
//            sessionStorage.removeItem('provider');
//            sessionStorage.removeItem('authToken');
//            $state.go('login');
//        },
//        createAccount: function (email, pass, name) {
//            return auth.$createUser(email, pass)
//                    .then(function () {
//                        // authenticate so we have permission to write to Firebase
//                        return fns.login(email, pass);
//                    })
//                    .then(function (user) {
//                        // store user data in Firebase after creating account
//                        return user;
////                                return createProfile(user.uid, email, name).then(function () {
////                                    return user;
////                                })
//                    });
//        },
//        changePassword: function (email, oldpass, newpass) {
//            return auth.$changePassword(email, oldpass, newpass);
//        },
//        changeEmail: function (password, newEmail) {
//            return changeEmail(password, fns.user.email, newEmail, this);
//        },
//        removeUser: function (email, pass) {
//            return auth.$removeUser(email, pass);
//        }
//    };
//
//    $rootScope.$on('$firebaseSimpleLogin:login', statusChange);
//    $rootScope.$on('$firebaseSimpleLogin:logout', statusChange);
//    $rootScope.$on('$firebaseSimpleLogin:error', statusChange);
//    statusChange();
//
//    return fns;
//});
app.factory("Auth", ["$firebaseAuth", function ($firebaseAuth) {
        var ref = new Firebase("https://incandescent-inferno-8147.firebaseio.com/");
        var auth = {
            getRef: ref,
            getFirebaseRef: function () {
                return $firebaseAuth(ref);
            },
            getAuth: function () {
                return $firebaseAuth(ref).$getAuth();
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
app.factory('userInfo', [function () {
        var userInfo = {
            setUserDetail: function (detail) {
                userInfo.fullUserDetail = detail;
                if (detail.provider.toLowerCase() === "google") {
                    userInfo.name = detail.google.displayName;
                    userInfo.email = detail.google.email;
                    userInfo.picture = detail.google.cachedUserProfile.picture;
                    userInfo.accessToken = detail.google.accessToken;
                    localStorage.setItem('accessToken', detail.google.accessToken);
                } else if (detail.provider.toLowerCase() === "facebook") {
                    userInfo.name = detail.facebook.displayName;
                    userInfo.email = detail.facebook.email;
                    userInfo.picture = detail.facebook.cachedUserProfile.picture.data.url;
                    userInfo.accessToken = detail.facebook.accessToken;
                    localStorage.setItem('accessToken', detail.facebook.accessToken);
                }
                localStorage.setItem('provider', detail.provider);
                userInfo.authToken = detail.token;
                localStorage.setItem('authToken', detail.token);
            }
        };
        return userInfo;
    }]);

app.factory('friendService', function (Auth, $q) {
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
            var getAddFriendRef = Auth.getRef.child("addFriends");
            getAddFriendRef.orderByChild(uid).equalTo(uid).on('value', function (snapshot) {
                var getAddFriendsList = [];
                if (!snapshot.val()) {
                    defer.resolve(getAddFriendsList);
                    return;
                }
                var data = snapshot.val();

                console.log(JSON.stringify(getAddFriendsList));
                defer.resolve(getAddFriendsList);
            });
            return defer.promise;
        },
        sendFriendRequest: function (userID, requestID) {
            var defer = $q.defer();
            var getAddFriendRef = Auth.getRef.child("addFriends");
            var reqObj = {uid: userID};
            var ids = getAddFriendRef.child(requestID).push(reqObj);
            defer.resolve(ids.key());
            return defer.promise;
        }
    };
    return user;
});