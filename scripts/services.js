/*jslint node: true */
'use strict';
/*global angular */
/*jslint browser: true*/
/*global $, jQuery, alert*/
angular.module('puppetApp')
    .constant("baseURL", "http://localhost:3000/api/")
	//.constant("baseURL", "/api/")

    .service('menuFactory', [function () {
		
        this.setInit = function ($state) {
            var windowWidth = $(window).width();
			if ($state.current.name === 'app') {
				$(window).on('resize', function () {
					var windowWidth = $(window).width();
					if (windowWidth > 767) {
						$('#main-nav').removeClass('fixed-menu animated slideInDown');
					} else {
						$('#main-nav').addClass('fixed-menu animated slideInDown');
					}
				});
			}
        };
		this.checkState = function ($state) {
			//console.log('state');
			//console.log($state.current);
            if ($state.current === 'app') {
				$('#main-nav').removeClass('fixed-menu animated slideInDown');
			} else {
				$('#main-nav').addClass('fixed-menu animated slideInDown');
			}
        };
    }])
	/*.factory('galleryFactory', ['$http','baseURL', function ($http, baseURL) {
                         var galfac = {};
                    galfac.getToys = function (){
                                       return $http.get(baseURL+"toys");
                                    };
                    galfac.getToy = function (index) {
                                       //return $http.get(baseURL+"toys?_id"+id);
					
					return $http.get(baseURL+"toys/"+index);
                    };
                    return galfac;

}])     */
    .factory('galleryFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
        return $resource(baseURL + "toys/:id", null, {
            'update': {
                method: 'PUT'
            }
        });
    }])
/*	.factory('rateFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "toys/:id/rates/:toysId", {id: "@Id", toysId: "@toysId"}, {
		//return $resource(baseURL + "toys/:id/rates", {id: "@Id"}, {
            'update': {
                method: 'PUT'
            }
        });

	}])*/
    .factory('IPfactory', ['$http', function ($http, $rootScope) {
		//$scope.global = $rootScope;
		var ipfac = {},
            json = 'http://ipv4.myexternalip.com/json';
		ipfac.getIP = function () {
            return $http.get(json);
        };

		return ipfac;
    }])
	
	.factory('rateFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
        return $resource(baseURL + "toys/:id", null, {
            'update': {
                method: 'PUT'
            }
        });
    }])

    .factory('checkRateFactory', ['$resource', '$rootScope', 'baseURL', function ($resource, $rootScope, baseURL) {
        var checkFac = {};
		checkFac.doCheckIp = function (toy, param) {
            var arr = toy.ips,
                idx = arr.indexOf($rootScope.ip);
			if (idx === -1) {
				return toy;
			} else {
				return null;
			}
			//return toy;
		};
		
		checkFac.doAdding = function (toy, param) {
			if (param === 'UP') {
				toy.rateUp = toy.rateUp + 1;
			} else {
				toy.rateDown = toy.rateDown + 1;
			}
			toy.ips.push($rootScope.ip);
			return toy;
		};

		return checkFac;
    }])

    .factory('feedbackFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
        return $resource(baseURL + "feedbacks/:id", null, {
            'update': {
                method: 'PUT'
            }
        });
    }])

    .factory('commentFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
        return $resource(baseURL + "comments/:id", null, {
            'update': {
                method: 'PUT'
            }
        });
    }])
	
	.factory('ratingFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
        return $resource(baseURL + "toys/:id", null, {
            'update': {
                method: 'PUT'
            }
        });
    }])
	.factory('$localStorage', ['$window', function ($window) {
		return {
			store: function (key, value) {
				$window.localStorage[key] = value;
			},
			get: function (key, defaultValue) {
				return $window.localStorage[key] || defaultValue;
			},
			remove: function (key) {
				$window.localStorage.removeItem(key);
			},
			storeObject: function (key, value) {
				$window.localStorage[key] = JSON.stringify(value);
			},
			getObject: function (key, defaultValue) {
				return JSON.parse($window.localStorage[key] || defaultValue);
			}
		};
	}])

	.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog', function ($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog) {

		var authFac = {},
			TOKEN_KEY = 'Token',
			isAuthenticated = false,
			username = '',
			firstname = '',
			lastname = '',
			email = '',
			fullname = '',
			authToken; //= undefined;

		function useCredentials(credentials) {
			isAuthenticated = true;
			username = credentials.username;
			authToken = credentials.token;
			firstname = credentials.firstname;
			lastname = credentials.lastname;
			email = credentials.email;
			fullname = authFac.getFullName();
			// Set the token as header for your requests!
			$http.defaults.headers.common['x-access-token'] = authToken;
		}
		
		function destroyUserCredentials() {
			authToken = undefined;
			username = '';
			firstname = '';
			lastname = '';
			fullname = '';
			email = '';
			isAuthenticated = false;
			$http.defaults.headers.common['x-access-token'] = authToken;
			$localStorage.remove(TOKEN_KEY);
		}

		function loadUserCredentials() {
			var credentials = $localStorage.getObject('userinfo', '{}');
			if (credentials.username !== undefined) {
				useCredentials(credentials);
			}
		}

		function storeUserCredentials(credentials) {
			$localStorage.storeObject(TOKEN_KEY, credentials);
			useCredentials(credentials);
		}
		authFac.login = function (loginData) {

			$resource(baseURL + "customers/login")
				.save(loginData,
					  function (response) {
						storeUserCredentials({username: loginData.username, token: response.token});
						$rootScope.$broadcast('login:Successful');
					},
					  function (response) {
						isAuthenticated = false;

						var message = '<div class="ngdialog-message">' +
							'<div><h3>Login Unsuccessful</h3></div>' +
							'<div><p>' +  response.data.error.message + '</p><p>' +
							response.data.error.name + '</p></div>' +
							'<div class="ngdialog-buttons">' +
							'<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>' +
							'</div>';

						ngDialog.openConfirm({ template: message, plain: 'true'});
					}

					);

		};

		authFac.logout = function () {
			$resource(baseURL + "customers/logout").get(function (response) {
			});
			destroyUserCredentials();
		};

		authFac.register = function (registerData) {

			$resource(baseURL + "customers")
				.save(registerData,
					  function (response) {
						authFac.login({username: registerData.username, password: registerData.password});
						if (registerData.rememberMe) {
							$localStorage.storeObject('userinfo',
								{username: registerData.username, password: registerData.password, firstname: registerData.firstname,
									lastname: registerData.lastname, email: registerData.email});
						}

						$rootScope.$broadcast('registration:Successful');
					},
					  function (response) {

						var message =
							'<div class="ngdialog-message">' +
							'<div><h3>Registration Unsuccessful</h3></div>' +
							'<div><p>' +  response.data.error.message +
							'</p><p>' + response.data.error.name + '</p></div>';

						ngDialog.openConfirm({ template: message, plain: 'true'});

					}

					);
		};

		authFac.isAuthenticated = function () {
			return isAuthenticated;
		};
		
		authFac.getUsername = function () {
			return username;
		};
		
		authFac.getFullName = function () {
			if (firstname || lastname) {
				fullname = firstname + ' ' + lastname;
			} else {
				fullname = username;
			}
			return fullname;
		};
		
		authFac.getEmail = function () {
			return email;
		};
		

		loadUserCredentials();

		return authFac;

	}]);