angular.module('gallery', ['ionic', 'ionic.service.core', 'ionic.service.analytics', 'gallery.controllers', 'starter.services', 'ionic-native-transitions'])

.run(function($ionicPlatform, $ionicAnalytics) {
    $ionicPlatform.ready(function() {
        $ionicAnalytics.register();
        var push = new Ionic.Push({
            "debug": true
        });
        push.register(function(token) {
            console.log("Device token:", token.token);
        });
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
}).config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicFilterBarConfigProvider, $ionicNativeTransitionsProvider) {
    // Turn off caching for demo simplicity's sake
    // $ionicConfigProvider.views.maxCache(7);
    $ionicConfigProvider.scrolling.jsScrolling(false);
    /*
    $ionicNativeTransitionsProvider.setDefaultOptions({
        "duration"          : 300,
        "androiddelay"      : 100, // Longer delay better for older androids
        // "fixedPixelsTop"    : 64, // looks OK on iOS
    });
     $ionicNativeTransitionsProvider.setDefaultTransition({
        type: 'slide',
        direction: 'right'
    });
     $ionicNativeTransitionsProvider.setDefaultBackTransition({
        type: 'slide',
        direction: 'left'
    });
     */
    String.prototype.capitalizeFirstLetter = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    $ionicFilterBarConfigProvider.transition("vertical");
    $ionicFilterBarConfigProvider.theme("light");

    $stateProvider
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl',
        controllerAs: 'vm'
    })

    .state('app.imagelist', {
        url: '/imagelist',
        cache: false,
        params: {
            searchCriteria: null
        },
        views: {
            'menuContent': {
                templateUrl: 'templates/fullscreen-brick.html',
                controller: 'ImagelistCtrl',
                controllerAs: 'vm'
            },
            'fabContent': {
                template: '<button ripple ripple-light ng-click="showFilterBar()" class="button button-fab button-fab-bottom-right expanded button-assertive flap" id="upload-image"> <i class="icon ion-android-search"> </i> </button>', 
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('upload-image').classList.toggle('on');
                    }, 900);
                }
            } } })

    .state('app.image', {
        url: '/image/:id',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/image.html',
                controller: 'ImageCtrl',
                controllerAs: 'vm'
            },
            'fabContent': {
                template: ''
            }
        }
    })
    .state('app.favlist', {
        url: '/favlist',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/fav-list.html',
                controller: 'FavoriteCtrl',
                controllerAs: 'vm'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.category', {
        url: '/category',
        views: {
            'menuContent': {
                templateUrl: 'templates/category.html',
                controller: 'CategoryCtrl',
                controllerAs: 'vm'
            },
            'fabContent': {
                template: '<button ng-click="showFilterBar()" ripple ripple-light class="button button-fab button-fab-bottom-right expanded button-assertive flap" id="upload-image2"> <i class="icon ion-android-search"> </i> </button>', 
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('upload-image2').classList.toggle('on');
                        console.log(document.getElementById('upload-image2').classList);
                    }, 900);
                }
            } } })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/imagelist');
});