// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'firebase', 'starter.slideBarController', 'starter.loginController', 'starter.chatController', 'starter.profileController', 'starter.friendsController', 'starter.addFriendController', 'starter.accountController', 'starter.aboutController', 'starter.services', 'filters'])

        .run(function ($ionicPlatform, $state, $ionicLoading, $templateCache, Auth, userInfo) {
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

                $ionicLoading.show();
                if (Auth.getAuth()) {
                    console.log("User " + Auth.getAuth().uid + " is logged in with " + Auth.getAuth().provider);
                    userInfo.setUserDetail(Auth.getAuth());
                    $state.go('dashboard.chat');
                } else {
                    $state.go('login');
                }

                $ionicLoading.hide();
            });
        })

        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                    .state('login', {
                        url: '/login',
                        views: {
                            '': {
                                templateUrl: "templates/login.html",
                                controller: "loginController"
                            }
                        }
                    })
                    .state('dashboard', {
                        url: "/dashboard",
                        abstract: true,
                        templateUrl: "templates/slide-menu.html",
                        controller: "slideBarController"
                    })
                    .state('dashboard.chat', {
                        url: "/chat",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/chat.html",
                                controller: "chatController"
                            }
                        }
                    })
                    .state('dashboard.profile', {
                        url: "/profile",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/profile.html",
                                controller: "profileController"
                            }
                        }
                    })
                    .state('dashboard.friends', {
                        url: "/friends",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/friends.html",
                                controller: "friendsController"
                            }
                        }
                    })
                    .state('dashboard.addFriend', {
                        url: "/addFriend",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/addFriend.html",
                                controller: "addFriendController"
                            }
                        }
                    })
                    .state('dashboard.about', {
                        url: "/about",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/about.html",
                                controller: "aboutController"
                            }
                        }
                    })
                    .state('dashboard.account', {
                        url: "/account",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/account.html",
                                controller: "accountController"
                            }
                        }
                    })
                    .state('dashboard.contactUs', {
                        url: "/contactUs",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/contact-us.html",
                                controller: "profileController"
                            }
                        }
                    });
            $urlRouterProvider.otherwise("/login");
        })

        .constant('$ionicLoadingConfig', {
            template: 'Loading Please Wait',
            duration: 15000
        });
;

