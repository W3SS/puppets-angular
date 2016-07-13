/*jslint node: true */
'use strict';
/*global angular */
angular.module('puppetApp', ['ui.router', 'ngDialog', 'ngResource'])
	.run(function ($rootScope, IPfactory) {
		$rootScope.ip = "";
		IPfactory.getIP().then(
			function (response) {
                $rootScope.ip = response.data.ip;
            },
            function (e) {
                console.log("error");
            }
		);
	})
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            // route for the home page
            .state('app', {
                url: '/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
			            controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html'
                        
                    },
                    'footer': {
                        templateUrl : 'views/footer.html'
                    }
                }

            })
            // route for the gallery page
            .state('app.gallery', {
                url: 'gallery',
                views: {
                    'content@': {
                        templateUrl : 'views/gallery.html',
                        controller  : 'GalleryController'
                    }
                }
            })
            // route for the lightbox page
            .state('app.imagebig', {
                url: '/gallery/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/gallery.html'//,
                        //controller  : 'DishDetailController'
                    }
                }
            })
            // route for the detail page
            .state('app.gallerydetail', {
                url: 'gallery/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/gallerydetail.html',
                        controller  : 'GalleryDetailController'
                    }
                }
            })

            // route for the about page
            .state('app.comments', {
                url: 'comments',
                views: {
                    'content@': {
                        templateUrl : 'views/comments.html',
                        controller  : 'CommentController'
                    }
                }
            })
            // route for the contact page
            .state('app.contact', {
                url: 'contact',
                views: {
                    'content@': {
                        templateUrl : 'views/contact.html',
                        controller  : 'ContactController'
                    }
                }
            })
            // route for the favorites page
            .state('app.favorites', {
                url: 'favorites',
                views: {
                    'content@': {
                        templateUrl : 'views/favorites.html'//,
                        //controller  : 'FavoritesController'                  
                    }
                }
            });
    
        $urlRouterProvider.otherwise('/');
    });

