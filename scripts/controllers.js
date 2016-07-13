/*jslint node: true */
'use strict';
/*global angular */
/*jslint browser: true*/
/*global $, jQuery, alert*/
angular.module('puppetApp')

	.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'menuFactory', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, menuFactory, AuthFactory) {
   		
		$scope.$state = $state;
		
		$scope.loggedIn = false;
		$scope.username = '';
    
		
        if ($state.current.name === 'app') {
			//console.log("We here " + $state.current.name);
			$(window).on('resize', function () {
                var windowWidth = $(window).width();
                if (windowWidth > 767) {
				    $('#main-nav').removeClass('fixed-menu animated slideInDown');
                } else {
				    $('#main-nav').addClass('fixed-menu animated slideInDown');
                }
			});
		}
         
		if (AuthFactory.isAuthenticated()) {
			$scope.loggedIn = true;
			$scope.username = AuthFactory.getUsername();
		}
        
		$scope.openLogin = function () {
			ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller: "LoginController" });
		};

		$scope.logOut = function () {
			AuthFactory.logout();
			$scope.loggedIn = false;
			$scope.username = '';
		};

		$rootScope.$on('login:Successful', function () {
			$scope.loggedIn = AuthFactory.isAuthenticated();
			$scope.username = AuthFactory.getUsername();
		});

		$rootScope.$on('registration:Successful', function () {
			$scope.loggedIn = AuthFactory.isAuthenticated();
			$scope.username = AuthFactory.getUsername();
		});

		$scope.stateis = function (curstate) {
			return $state.is(curstate);
		};

	}])

    .controller('GalleryController', ['$scope', '$state', '$stateParams', 'galleryFactory', 'ratingFactory', 'ngDialog', 'checkRateFactory', 'rateFactory', function ($scope, $state, $stateParams, galleryFactory, ratingFactory, ngDialog, checkRateFactory, rateFactory) {
        // $scope.toys = galleryFactory.getToys();
		//$scope.showMenu = true;
		$scope.showMessage = true;
        $scope.message = "Loading ...";
        $scope.tab = 0;
		$scope.filtText = "";
        $scope.pad = 0;
		$scope.ordering = "-rateUp";

		$scope.select = function (setTab) {
			$scope.tab = setTab;
			//console.log("Tab" + setTab);
			if (setTab === 1) {
				$scope.filtText = "Animals";
			} else if (setTab === 2) {
				$scope.filtText = "People";
			} else if (setTab === 3) {
				$scope.filtText = "Pillows";
			} else {
				$scope.filtText = "";
			}
		};

		$scope.isSelected = function (checkTab) {
			return ($scope.tab === checkTab);
		};

                
		$scope.selectPad = function (setPad) {
			$scope.pad = setPad;
			//console.log ("Tab" + setPad);
			if (setPad === 0) {
				$scope.ordering = "-rateUp";
			} else if (setPad === 1) {
				$scope.ordering = "-rateDown";
			} else if (setPad === 2) {
				$scope.ordering = "name";
			} else if (setPad === 3) {
				$scope.ordering = "category";
			} else {
				$scope.setPad = "-rateUp";
			}
		};

		$scope.isSelectedPad = function (checkPad) {
			return ($scope.pad === checkPad);
		};

		/*$scope.toys= [];
        galleryFactory.getToys()
        .then(
        function(response) {
            $scope.toys = response.data;
            }
        );*/
		//$scope.toys = galleryFactory.getToys().query();
		galleryFactory.query(
            function (response) {
                $scope.toys = response;
				$scope.showMessage = false;
                //$scope.showMenu = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

		//showDetails = false;
		//console.log("showDetails"+showDetails);
		//$scope.obj = {name: 'ss', id:1};
        $scope.clickToOpen = function (path, caption) {
			//console.log('path ' + path);
			//console.log('name ' + caption);
			ngDialog.open({template: '<p><br><img src="' + path + '" width=100%></p><p class="center">' + caption + '</p>', scope: $scope, plain: true });
		};
		
		
		$scope.doRate = function (param, toy) {
			$scope.check = checkRateFactory.doCheckIp(toy);
			if ($scope.check) {
				toy = checkRateFactory.doAdding(toy, param);
				rateFactory.update({id: $stateParams.id}, toy);
				//$scope.rateUp = $scope.toy.rateUp;
				//$scope.rateDown = $scope.toy.rateDown;
			} else {
				$scope.message = "You already voted!";
				$scope.showMessage = true;
			}
		};
	}])


    .controller('GalleryDetailController', ['$scope', '$state', '$stateParams', 'galleryFactory', 'checkRateFactory', 'rateFactory', function ($scope, $state, $stateParams, galleryFactory, checkRateFactory, rateFactory) {

    //$scope.toy= galleryFactory.getToy(3);
		/*$scope.toy= [];       
        galleryFactory.getToy(parseInt($stateParams.id,10))
        .then(
            function(response) {
                $scope.toy = response.data;
                }
            );  */
           
	    $scope.toy = {};
	    $scope.showMessage = true;
	    $scope.message = "Loading ...";

        $scope.toy = galleryFactory.get({
            id: $stateParams.id
        })
            .$promise.then(
                function (response) {
                    $scope.showMessage = false;
                    $scope.toy = response;
					
					/*$scope.rates = rateFactory.get({
						id: $stateParams.id
						})
					.$promise.then(
						function (response1) {
							$scope.toy.rates = response1;
							console.log("There");
							console.log($scope.rates);
						},
						function (response1) {
								$scope.message = "Error: " + response1.status + " " + response1.statusText;
								}
					)*/
				},
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
				
		$scope.doRate = function (param) {
			$scope.check = checkRateFactory.doCheckIp($scope.toy);
			if ($scope.check) {
				$scope.toy = checkRateFactory.doAdding($scope.toy, param);
				rateFactory.update({id: $stateParams.id}, $scope.toy);
				$scope.rateUp = $scope.toy.rateUp;
				$scope.rateDown = $scope.toy.rateDown;
			} else {
				$scope.message = "You already voted!";
				$scope.showMessage = true;
			}
			
		//$scope.$apply();
		};

    }])
    .controller('ContactController', ['$scope', 'feedbackFactory', 'AuthFactory', function ($scope, feedbackFactory,  AuthFactory) {
  		
        $scope.feedback = {
            name: "",
			areaCode: "",
            phone: "",
            email: ""
        };
		if (AuthFactory.isAuthenticated()) {
			$scope.feedback.name = AuthFactory.getFullName();
			$scope.feedback.email = AuthFactory.getEmail();
		}

		//console.log('22$rootScope.username ' + $rootScope.username);
        $scope.sendFeedback = function () {
            feedbackFactory.save($scope.feedback);
            $scope.feedback = {
                name: "",
				areaCode: "",
                phone: "",
                email: ""
            };
            $scope.feedbackForm.$setPristine();
        };

	}])

    .controller('CommentController', ['$scope', 'commentFactory', 'AuthFactory', function ($scope, commentFactory, AuthFactory) {

        $scope.userComment = {
            name: "",
            email: ""
        };

		if (AuthFactory.isAuthenticated()) {
			$scope.userComment.name = AuthFactory.getFullName();
			$scope.userComment.email = AuthFactory.getEmail();
		}
		
        $scope.sendComment = function () {
            //console.log($scope.userComment);
            commentFactory.save($scope.userComment);
			$scope.comments.push($scope.userComment);
            $scope.userComment = {
                name: "",
                email: ""
            };
            $scope.commentForm.$setPristine();

        };
        
	
        commentFactory.query(
            function (response) {
                $scope.comments = response;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
    }])

	.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

		$scope.loginData = $localStorage.getObject('userinfo', '{}');

		$scope.doLogin = function () {
			if ($scope.rememberMe) {
				$localStorage.storeObject('userinfo', $scope.loginData);
			}
			AuthFactory.login($scope.loginData);

			ngDialog.close();

		};

		$scope.openRegister = function () {
			ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller: "RegisterController" });
		};

	}])

	.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

		$scope.register = {};
		$scope.loginData = {};

		$scope.doRegister = function () {
			console.log('Doing registration', $scope.registration);

			AuthFactory.register($scope.registration);

			ngDialog.close();

		};
	}]);
