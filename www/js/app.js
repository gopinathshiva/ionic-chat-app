// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCookies', 'firebase', 'starter.slideBarController', 'starter.loginController', 'starter.chatController', 'starter.profileController', 'starter.friendsController', 'starter.addFriendController', 'starter.accountController', 'starter.aboutController', 'starter.settingsController', 'starter.services', 'filters', 'appConstants'])

        .run(function ($ionicPlatform, $ionicLoading, $location, $state, $rootScope, $cookieStore, $ionicPopup, Auth, userInfo, friendService) {
            $ionicLoading.show();
            $cookieStore.put('isLoggedIn', false);
            var currentLocation = '';
            //watch function to perform sessions all on tabs
            $rootScope.$watch(function () {
                return $cookieStore.get('isLoggedIn');
            }, function (isLoggedIn) {
                if (isLoggedIn) {
                    console.log(currentLocation);
                    if ($location.path() === "/login" && currentLocation === "/login") {
                        $location.path("dashboard/friends");
                    } else {
                        $location.path(currentLocation);
                    }
                } else {
                    currentLocation = $location.path();
                    $location.path('login');
                }
            });

            //authenticating user is done here
            var token = localStorage.getItem("token");
            if (token) {
                token = JSON.parse(token).authToken;
                Auth.getAuth(token).then(function (data) {
                    $cookieStore.put('isLoggedIn', true);
                    if (!localStorage.getItem("userData") && data.provider === "password") {
                        userInfo.setUserDetail(data);
                    }
                    console.log("User " + data.uid + " is logged in with " + data.provider);
                    $ionicLoading.hide();
                }, function (error) {
                    $ionicPopup.alert({
                        title: "Session Expired",
                        template: "Please Login to Continue"
                    });
                    $cookieStore.put('isLoggedIn', false);
                    localStorage.removeItem('token');
                    localStorage.removeItem('userData');
                    $ionicLoading.hide();
                    $state.go('login');
                });
            } else {
                $ionicLoading.hide();
            }

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
                        if ($cookieStore.get('isLoggedIn')) {
                            if (toState.name === "login" && localStorage.getItem("token")) {
                                event.preventDefault();
                            }
                            if (!localStorage.getItem("userData") && localStorage.getItem("token")) {
                                event.preventDefault();
                                $ionicLoading.show();
                                var token = JSON.parse(localStorage.getItem("token"));
                                if (token.provider !== "password") {
                                    Auth.getOAuth(token.provider).then(function (data) {
                                        userInfo.setUserDetail(data).then(function () {
                                            $ionicLoading.hide();
                                            $state.go(toState.name);
                                        });
                                    }, function (error) {
                                        console.log("get OAuth service error" + JSON.stringify(error));
                                        $ionicLoading.hide();
                                    });
                                } else {
                                    friendService.getUserDetail(token.uid).then(function (data) {
                                        data = data[0];
                                        var userObj = {
                                            name: data.name,
                                            email: data.email,
                                            picture: data.picture,
                                        };
                                        localStorage.setItem('userData', JSON.stringify(userObj));
                                        $ionicLoading.hide();
                                        $state.go(toState.name);
                                    }, function (err) {
                                        console.log("get user detail service error" + JSON.stringify(err));
                                        $ionicLoading.hide();
                                    });
                                }
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
                                controller: "chatController",
                                resolve: {
                                    userDatas: ['$q', function ($q) {
                                            var defer = $q.defer();
                                            if (localStorage.getItem('currentChatUser') && localStorage.getItem('userData')) {
                                                defer.resolve([JSON.parse(localStorage.getItem('currentChatUser')), JSON.parse(localStorage.getItem('userData'))]);
                                            } else {
                                                defer.reject();
                                            }
                                            return defer.promise;
                                        }]
                                }
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
        .factory('authInterceptor', function ($q, $location) {
            return {
                request: function (config) {

                    config.headers = config.headers || {};
                    if (localStorage.getItem("token")) {
                        var token = JSON.parse(localStorage.getItem("token")).authToken;
                        if (token) {
                            config.headers.Authorization = 'Bearer ' + token;
                        }
                    }

                    return config;
                },
                response: function (response) {
                    if (response.status === 401) {
                        $location.path('login');
                        // handle the case where the user is not authenticated
                    }
                    return response;
                }
            };
        })

        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
        })

        .constant('$ionicLoadingConfig', {
            template: 'Loading Please Wait',
            duration: 15000
        });


