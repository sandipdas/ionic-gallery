
(function() {
    'use strict';



	angular
		.module('starter.services', [])
		.service('ApiSettings', ApiSettings);

	ApiSettings.$inject = [];
	
	function ApiSettings(){
		this.getBaseUrl = 'https://pixabay.com/api/?key=2394489-de1617b68ca9029fee4278f39';
		this.imgPreviewKey = 'webformatURL';
		this.imgLargeKey = 'fullHDURL';
	}


    angular
        .module('starter.services')
        .factory('imageService', imageService)
        .factory('FavoriteService', FavoriteService)
        .factory('debounceService', debounceService);

    imageService.$inject = ["$http","$q", "ApiSettings", "FavoriteService"];
    FavoriteService.$inject = [];

    /* @ngInject */
    function imageService($http, $q, ApiSettings, FavoriteService) {
		init();
        var service = {
            getImages: getImages
        };
        return service;

        ////////////////

		function init() {
			
		}
        function getImages(searchCriteria) {
			var deferred = $q.defer();
			var url = ApiSettings.getBaseUrl;
			angular.forEach(searchCriteria, function(val, key){
				url += '&' + key + '=' + val;
			});
	        // $http.get('/data/images.json')
	        var fav_list = FavoriteService.getList();
	        $http.get(url)
				.then(function (result) {
					if (!result.data || !result.data.hits ) {
						deferred.reject('NO-DATA');
						return;
					}
					var formatResult = [];
					angular.forEach(result.data.hits, function(value, key) {
						var is_fav = false;
						if (searchCriteria.response_group == 'high_resolution') {
							if (fav_list && fav_list.length >0 && fav_list.indexOf(value.id_hash) != -1) {
								is_fav = true;
							}
							this.push({
								id : value.id_hash,
								is_fav : is_fav,
								previewUrl : value.webformatURL,
								// largeUrl : value.webformatURL,
								// largeUrl : value.fullHDURL,
								largeUrl : value.largeImageURL,
								lg_w : value.webformatWidth,
								lg_h : value.webformatHeight,
							});
						} else {
							if (fav_list && fav_list.length >0 && fav_list.indexOf(value.id) != -1) {
								is_fav = true;
							}
							this.push({
								id : value.id_hash,
								is_fav : is_fav,
								previewUrl : value.previewURL,
								largeUrl : value.webformatURL,
								lg_w : value.webformatWidth,
								lg_h : value.webformatHeight,
							});
						}
					}, formatResult);

					deferred.resolve(formatResult);
				}, function (error) { 
					var items = [
		                {
		                    previewUrl: 'img/t/1.jpg',
		                    largeUrl: 'img/t/1.jpg',
		                    lg_w: 600,
		                    lg_h: 400
		                },
		                {
		                    previewUrl: 'img/t/2.jpg',
		                    largeUrl: 'img/t/2.jpg',
		                    lg_w: 600,
		                    lg_h: 400
		                },
		                {
		                    previewUrl: 'img/t/3.jpg',
		                    largeUrl: 'img/t/3.jpg',
		                    lg_w: 600,
		                    lg_h: 400
		                },
		                {
		                    previewUrl: 'img/t/4.jpg',
		                    largeUrl: 'img/t/4.jpg',
		                    lg_w: 600,
		                    lg_h: 400
		                },
		                {
		                    previewUrl: 'img/t/5.jpg',
		                    largeUrl: 'img/t/5.jpg',
		                    lg_w: 600,
		                    lg_h: 400
		                },
		                {
		                    previewUrl: 'img/t/6.jpg',
		                    largeUrl: 'img/t/6.jpg',
		                    lg_w: 600,
		                    lg_h: 400
		                },
		                {
		                    previewUrl: 'img/t/6.jpg',
		                    largeUrl: 'img/t/6.jpg',
		                    lg_w: 600,
		                    lg_h: 400
		                },
		                {
		                    previewUrl: 'img/t/7.jpg',
		                    largeUrl: 'img/t/7.jpg',
		                    lg_w: 600,
		                    lg_h: 400
		                },
		                {
		                    previewUrl: 'img/t/8.jpg',
		                    largeUrl: 'img/t/8.jpg',
		                    lg_w: 600,
		                    lg_h: 400
		                },
		            ];

					deferred.resolve(items);
					// deferred.reject(error);
				});
			return deferred.promise;
        }	    
    }

    /* @ngInject */
    function FavoriteService() {
		init();

        var service = {
            fav: fav,
            addToFavBulk: addToFavBulk,
            getListByPage : getListByPage ,
            getList: getList
        }, fav_list_current_page = 1, per_page = 12;
        return service;

        ////////////////

		function init() {
			
		}
	    
	    function fav(data) {
	    	var fav_list, remove_from_fav_key = null;
	    	if (typeof(Storage) == "undefined") {
	    		return false;
	    	}
	    	fav_list = getList();
	    	if (fav_list) {
	    		// angular.forEach(fav_list, function(value, key) {
	    		// 	if (data.id == value.id) {
	    		// 		remove_from_fav_key = key;
	    		// 		return;
	    		// 	}
	    		// });
	    		remove_from_fav_key = fav_list.indexOf(data);
	    		if(remove_from_fav_key != -1){
		    		fav_list.splice(remove_from_fav_key, 1);
	    			localStorage.setItem("fav_list", JSON.stringify(fav_list));
		    		return 2;
	    		}
	    		// if (remove_from_fav_key != null) {
	    		// }
	    	} else {
	    		fav_list = [];
	    	}
    		fav_list.push(data);
	    	localStorage.setItem("fav_list", JSON.stringify(fav_list));
	    	return 1;
	    }

	    function addToFavBulk(data) {
	    	var fav_list, remove_from_fav_key = null, uniqueArray;
	    	if (typeof(Storage) == "undefined") {
	    		return false;
	    	}
	    	fav_list = getList();
	    	fav_list = fav_list.concat(data);
			uniqueArray = fav_list.filter(function(item, pos) {
				return fav_list.indexOf(item) == pos;
			});
	    	localStorage.setItem("fav_list", JSON.stringify(uniqueArray));
	    	return true;
	    }
	    function getList() {
	    	if (typeof(Storage) == "undefined") {
	    		return false;
	    	}
	    	return JSON.parse(localStorage.getItem("fav_list"));
	    }

	    function getListByPage(){
	    	var fav_list = getList(),
	    		t_len = fav_list.length,
	    		total_page = Math.ceil(t_len/per_page),
		    	fav_image_ids = fav_list.slice((fav_list_current_page-1)*per_page, fav_list_current_page*per_page);
	    	fav_list_current_page++
	    	return fav_image_ids;
	    }
    }

    function debounceService() {
		init();
        var service = {
            event: debounce
        };
        return service;

        ////////////////

		function init() {
			
		}
		function debounce(func, wait, immediate) {
		    var timeout;
		    return function() {
		        var context = this, args = arguments;
		        var later = function() {
		            timeout = null;
		            if (!immediate) func.apply(context, args);
		        };
		        var callNow = immediate && !timeout;
		        clearTimeout(timeout);
		        timeout = setTimeout(later, wait);
		        if (callNow) func.apply(context, args);
		    };
		};
	}
})();
