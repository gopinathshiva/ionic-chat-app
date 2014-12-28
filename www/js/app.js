// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCookies', 'firebase', 'starter.slideBarController', 'starter.loginController', 'starter.chatController', 'starter.profileController', 'starter.friendsController', 'starter.addFriendController', 'starter.accountController', 'starter.aboutController', 'starter.settingsController', 'starter.services', 'filters', 'appConstants'])

        .run(function ($ionicPlatform, $ionicLoading, $location, $state, $rootScope, $cookieStore, Auth, userInfo) {
            $ionicLoading.show();
            $rootScope.$watch(function () {
                return $cookieStore.get('isLoggedIn');
            }, function (newValue) {
                if (newValue) {
                    if ($location.path() === "/login") {
                        $state.go("dashboard.chat");
                    } else {
                        $location.path($location.path());
                    }
                } else {
                    $location.path('login');
                }
            });
            Auth.getAuth().then(function (data) {
                $cookieStore.put('isLoggedIn', true);
                if (!localStorage.getItem("userData")) {
                    userInfo.setUserDetail(data);
                }
                console.log("User " + data.uid + " is logged in with " + data.provider);
                $ionicLoading.hide();
            }, function (error) {
                $cookieStore.put('isLoggedIn', false);
                console.log("app run token error" + JSON.stringify(error));
                $ionicLoading.hide();
                $location.path('login');
            });
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }

                try {
                    navigator.splashscreen.hide();
                } catch (e) {

                }

            });
            $rootScope.$on('$stateChangeStart',
                    function (event, toState, toParams, fromState, fromParams) {

                        console.log('toState.name: ' + toState.name);
                        console.log('fromState.name: ' + fromState.name);

                        if (!localStorage.getItem("userData") && localStorage.getItem("token")) {
                            event.preventDefault();
                            $ionicLoading.show();
                            var provider = JSON.parse(localStorage.getItem("token")).provider;
                            if (provider !== "password") {
                                Auth.getOAuth(provider).then(function (data) {
                                    userInfo.setUserDetail(data).then(function (data) {
                                        $ionicLoading.hide();
                                        $state.go(toState.name);
                                    });
                                }, function (error) {
                                    console.log("get OAuth service error" + JSON.stringify(error));
                                    $ionicLoading.hide();
                                });
                            }
                        }
                    });
        })

        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                    .state('login', {
                        url: '/login',
                        views: {
                            '': {
                                module: "public",
                                templateUrl: "templates/login.html",
                                controller: "loginController"
                            }
                        }
                    })
                    .state('dashboard', {
                        url: "/dashboard",
                        abstract: true,
                        module: "private",
                        templateUrl: "templates/slide-menu.html",
                        controller: "slideBarController"
                    })
                    .state('dashboard.chat', {
                        url: "/chat",
                        views: {
                            'menuContent': {
                                module: "private",
                                templateUrl: "templates/chat.html",
                                controller: "chatController"
                            }
                        }
                    })
                    .state('dashboard.friends', {
                        url: "/friends",
                        views: {
                            'menuContent': {
                                module: "private",
                                templateUrl: "templates/friends.html",
                                controller: "friendsController"
                            }
                        }
                    })
                    .state('dashboard.addFriend', {
                        url: "/addFriend",
                        views: {
                            'menuContent': {
                                module: "private",
                                templateUrl: "templates/addFriend.html",
                                controller: "addFriendController"
                            }
                        }
                    })
                    .state('dashboard.about', {
                        url: "/about",
                        views: {
                            'menuContent': {
                                module: "private",
                                templateUrl: "templates/about.html",
                                controller: "aboutController"
                            }
                        }
                    })
                    .state('dashboard.settings', {
                        url: "/settings",
                        views: {
                            'menuContent': {
                                module: "private",
                                templateUrl: "templates/settings.html",
                                controller: "settingsController"
                            }
                        }
                    })
                    .state('dashboard.account', {
                        url: "/account",
                        views: {
                            'menuContent': {
                                module: "private",
                                templateUrl: "templates/account.html",
                                controller: "accountController"
                            }
                        }
                    })
                    .state('dashboard.contactUs', {
                        url: "/contactUs",
                        views: {
                            'menuContent': {
                                module: "private",
                                templateUrl: "templates/contact-us.html",
                                controller: "profileController"
                            }
                        }
                    });
            $urlRouterProvider.otherwise("/login");
        }
        )

        .constant('$ionicLoadingConfig', {
            template: 'Loading Please Wait',
            duration: 15000
        });
;

