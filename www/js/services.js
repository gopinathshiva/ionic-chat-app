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