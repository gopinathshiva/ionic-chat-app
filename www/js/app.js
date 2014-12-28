// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'angular-jwt', 'firebase', 'starter.slideBarController', 'starter.loginController', 'starter.chatController', 'starter.profileController', 'starter.friendsController', 'starter.addFriendController', 'starter.accountController', 'starter.aboutController', 'starter.settingsController', 'starter.services', 'filters', 'appConstants'])

        .run(function ($ionicPlatform, $state, $ionicLoading, $rootScope, Auth, userInfo) {
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

                $ionicLoading.show();
                Auth.getAuth().then(function (data) {
                    console.log("User " + data.uid + " is logged in with " + data.provider);
                    $state.go('dashboard.chat');
                }, function (error) {
                    console.log("app run token error" + JSON.stringify(error));
                    $ionicLoading.hide();
                    $state.go('login');
                });


            });
            $rootScope.$on('$stateChangeStart',
                    function (event, toState, toParams, fromState, fromParams) {

                        console.log('toState.name: ' + toState.name);
                        console.log('fromState.name: ' + fromState.name);
                        if (toState.name === "login" && localStorage.getItem('token')) {
                            $state.go('dashboard.chat');
                        } else if (fromState.name === "login") {
                            $state.go('login');
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

