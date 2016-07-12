angular.module('gallery.controllers', ['jett.ionic.filter.bar', /*'aCarousel','ionic-material'*/ ])

.controller('AppCtrl', AppCtrl)
.controller('ImagelistCtrl',ImagelistCtrl)
.controller('ImageCtrl', ImageCtrl)
.controller('CategoryCtrl',CategoryCtrl)
.controller('FavoriteCtrl',FavoriteCtrl)

.directive('scrollWatch', function($rootScope) {
  return function(scope, elem, attr) {
    var start = 150, is_scrolling = false, header;
    elem.bind('scroll', function(e) {
        if (is_scrolling 
            // || !scope.showSubHeader
            ) {return;}
        is_scrolling = true;

        
        (function(e){
            setTimeout(function(){
                header = document.querySelector('.nav-bar-block[nav-bar="active"] ion-header-bar');
                var scrollTop = (e.detail)?e.detail.scrollTop : e.target.scrollTop;
                if(scrollTop > start) {
                    header.style.top = '-44px';
                    header.style.background = 'none';
                    header.style.opacity = '0.5';
                } else {
                    header.style.top = '0px';
                    if (scrollTop > 200) {
                        header.style.background = '#fff';
                    } else {
                        header.style.background = 'none';

                    }
                    header.style.opacity = '1';
                }
                start = scrollTop;
                is_scrolling = false;
            },300);
        })(e);
    });
  };
})

.directive('ripple', function($rootScope) {
    return function(scope, currentElement, attr) {
        var onlongtouch; 
        var timer;
        if (currentElement[0].tagName == "ION-ITEM") {
            currentElement = angular.element(currentElement[0].querySelector(".item-content"));
        }
        var ink1 = angular.element(currentElement[0].querySelector(".ripple-ink"));

        if( !angular.isDefined(ink1) || ink1.length == 0 ) {
            ink1 = angular.element("<span class='ripple-ink'></span>");
            currentElement.prepend(ink1);
        }
        // currentElement.bind('click', makeInk);
        // currentElement.bind('tap', makeInk);
        currentElement.bind('touchstart', touchstart);
        currentElement.bind('touchend', touchend);
        function touchstart(e) {timer = setTimeout(makeInk.call(this,e), 500); }

        function touchend(e) {if (timer) clearTimeout(timer); }

        function makeInk(event) {
                var ink = angular.element(event.currentTarget.querySelector(".ripple-ink"));
                ink.removeClass("animate");

                if(!ink[0].offsetHeight && !ink[0].offsetWidth)
                {

                    d = Math.max(event.currentTarget.offsetWidth, event.currentTarget.offsetHeight);
                    ink.css("height", d + "px");
                    ink.css("width", d + "px");
                }
                if (event.type == 'click') {
                    x = event.offsetX - ink[0].offsetWidth / 2;
                    y = event.offsetY - ink[0].offsetHeight / 2;

                } else {
                    var rect = event.currentTarget.getBoundingClientRect();
                    var x = event.targetTouches[0].pageX - rect.left;
                    var y = event.targetTouches[0].pageY - rect.top;

                    x = x - ink[0].offsetWidth / 2;
                    y = y - ink[0].offsetHeight / 2;

                }

                ink.css("top", y +'px');
                ink.css("left", x +'px');
                ink.addClass("animate");  
        }
 
    };
})

function AppCtrl($rootScope, $scope, $ionicModal, $timeout,$state, $ionicSideMenuDelegate, FavoriteService) {
    initImagesSettings();
    // slider();
    $scope.navBarTransparent = true;
    $scope.displaySearchButton = true;
    $rootScope.setAsWallpaper = setAsWallpaper;
    $rootScope.downloadImage = downloadImage;
    $rootScope.addToFav = addToFav;
    $rootScope.addToFavBulk = addToFavBulk;
    // this.editorChoice = editorChoice;
    function initImagesSettings(argument) {
        $rootScope.images = [];
        $rootScope.searchCriteria = {
            page : 1,
            orientation : 'all',
            editors_choice : false,
            order : 'popular',
            per_page : 24,
            image_type: 'photo',
            response_group: 'high_resolution'
        };
        $rootScope.showSearchCriteriaSwitch = false;
        $rootScope.catrgories = ['all','fashion', 'nature', 'backgrounds', 'science', 'education', 'people', 'feelings', 'religion', 'health', 'places', 'animals', 'industry', 'food', 'computer', 'sports', 'transportation', 'travel', 'buildings', 'business', 'music'];
    }
    function editorChoice(){
        $state.go('app.imagelist',{searchCriteria:{editors_choice:true}});
    }
    // ---------features---------
        function setAsWallpaper(imagePath) {
            var imageTitle = imagePath.split('/').pop().split('.').shift();
            if (!imageTitle) {
                imageTitle = 'gallery-images-' + Date.now();
            }
            var folderName = "Gallery-Images";
            var success = function() {
                toast("Successfully set wallpaper", 'success');
                $rootScope.$broadcast('setwallpaper-done');
            };

            var error = function(message) {
                toast("Could not set wallpaper", 'error');
                $rootScope.$broadcast('setwallpaper-done');
            };

            // For setting wallpaper & saving image
            wallpaper.setImage(imagePath, imageTitle, folderName, success, error); 
        }
        function downloadImage(imagePath) {
            var imageTitle = imagePath.split('/').pop().split('.').shift();
            if (!imageTitle) {
                imageTitle = 'gallery-images-' + Date.now();
            }
            var folderName = "Gallery-Images";
            var success = function() {
                toast("Successfully Download Image", 'success');
            };

            var error = function(message) {
                toast("Could not Download Image", 'error');
            };
            wallpaper.saveImage(imagePath, imageTitle, folderName, success, error);   
        }
        function addToFav(image) {
            var fav_result = FavoriteService.fav($rootScope.images[image.index].id);
            if(fav_result == 1){
                //added to fav
                toast("Added to Favorite", 'success');

            } else if (fav_result == 2){
                //removed from fav
                toast("Removed from Favorite", 'success');
            } else {
                toast("Opps! could not add to Favorite", 'error');
            }
        }
        function addToFavBulk() {
            var fav_result = FavoriteService.addToFavBulk($rootScope.selectedImages);
            if(fav_result){
                //added to fav
                toast("Added to Favorite", 'success');
            } else {
                toast("Opps! could not add to Favorite", 'error');
            }
        }
        function toast(message, type) {
            var backgroundColor, textColor;
            if (type &&  type == 'success') {
                backgroundColor = '#2E7D32';
            } else {
                backgroundColor = '#EF473A';
            }
            window.plugins.toast.showWithOptions({
                message: message,
                duration: "short", // 2000 ms
                position: "bottom",
                styling: {
                    opacity: 0.9, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
                    backgroundColor: '#333333', // make sure you use #RRGGBB. Default #333333
                    textColor: '#FEFEFE', // Ditto. Default #FFFFFF
                    textSize: 16, // Default is approx. 13.
                    cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100
                    horizontalPadding: 20, // iOS default 16, Android default 50
                    verticalPadding: 16 // iOS default 12, Android default 30
                }
            });
        }
    // --------selectable--------

        $rootScope.isSelectSate = false;
        $rootScope.selectedImages = [];

        $rootScope.touchPlay = touchPlay;
        $rootScope.stopTouchPlay = stopTouchPlay;
        $rootScope.selectImage = selectImage;
        $rootScope.downloadSelectedImage = downloadSelectedImage;
        $rootScope.setAsWallpaperThisImage = setAsWallpaperThisImage;
        
        function touchPlay(e){
            //hide fav content
            document.querySelector('ion-nav-view[name="fabContent"] .button-fab[nav-view="active"]').classList.remove('on');

            $rootScope.isSelectSate = true;
            if (!e.gesture.center.pageX || !e.gesture.center.pageY) {
                return;
            }
            e.currentTarget.classList.add('select-start');
            var ele = document.elementFromPoint(e.gesture.center.pageX, e.gesture.center.pageY);
            if (!ele) {
                return;
            }
            ele = ele.parentElement;
            selectImage(ele);
        }
        function stopTouchPlay() {
            $rootScope.isSelectSate = false;
            $rootScope.selectedImages = [];
            document.getElementById('brick-container').classList.remove('select-start');
            document.querySelector('ion-nav-view[name="fabContent"] .button-fab').classList.add('on');
            angular.element(document.querySelectorAll('#brick-container .brick-item')).removeClass('selected');
        }
        function selectImage(element) {
            element.classList.toggle('selected');
            var image_id = element.dataset.id;
            var position = $rootScope.selectedImages.indexOf(image_id);
            if (position == -1) {
                $rootScope.selectedImages.push(image_id);
            } else {
                $rootScope.selectedImages.splice(position, 1);
            }
        }
        function downloadSelectedImage(){
            img_path = getImagePathFromID($rootScope.selectedImages[0]);
            if (imagePath) {
                downloadImage(imagePath);
            }
        }
        function setAsWallpaperThisImage(){
            img_path = getImagePathFromID($rootScope.selectedImages[0]);
            if (imagePath) {
                setAsWallpaper(imagePath);
            }
        }
        function getImagePathFromID(id) {
            angular.forEach($rootScope.images,  function(value, key) {
                if (value.id == id) {
                    return value.largeUrl;
                }
            });
            return false;
        }
}
function ImagelistCtrl($log,$scope,$rootScope, $state, $timeout, imageService, $ionicFilterBar, $ionicLoading, $ionicSideMenuDelegate, debounceService) { 

    var vm = this,
        instance, 
        rowGridInit = false, 
        changeSearchCriteriaOrientation = true,
        isLoadMoreStart = false,
        sizes = [
            // { columns: 3, gutter: 5 },
            // { mq: '400px', columns: 3, gutter: 5 },
            // { mq: '500px', columns: 4, gutter: 5 }
            { columns: 2, gutter: 5 },
            { mq: '400px', columns: 2, gutter: 5 },
            { mq: '500px', columns: 3, gutter: 5 }
        ],
        previousCategotyId = 0;

    $scope.hasMoreImages = true;
    $scope.showSubHeader = true;

    vm.loadMore = loadMore;
    vm.doRefresh = doRefresh;
    vm.doPulling = function (){
        $log.log("pulling");
    };
    vm.openSlider = openSlider;
    vm.viewTitle = "Gallery";

    $scope.$on('$stateChangeSuccess', function() {});
    $scope.$on('$ionicView.loaded', function() {});
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        $log.log(viewData);
        viewData.enableBack = false;
    });

    $scope.$on('$ionicView.afterEnter', function() {
        $log.log("----after enter-----")
        // loadMore();
        if ($state.params
            && $state.params.searchCriteria
            && (angular.isDefined($state.params.searchCriteria.editors_choice) 
            || $state.params.searchCriteria.category)) {
            // document.getElementById("brick-container").style.height = 'auto';
            rowGridInit = false
            if (angular.isDefined($state.params.searchCriteria.editors_choice)) {
                $rootScope.searchCriteria.editors_choice = $state.params.searchCriteria.editors_choice;
                vm.viewTitle = "Editors Choice";
            }
            if (angular.isDefined($state.params.searchCriteria.category)) {
                $rootScope.searchCriteria.category = $state.params.searchCriteria.category;
                if ($state.params.searchCriteria.category != 'all') {
                    vm.viewTitle = $state.params.searchCriteria.category.capitalizeFirstLetter();
                }
            }
            $rootScope.images = [];
            $rootScope.searchCriteria.page = 1;
        }
        loadMore();
        $rootScope.showSearchCriteriaSwitch = true;
    });
    $scope.$on('$ionicView.afterLeave', function() {
        $rootScope.showSearchCriteriaSwitch = false;
    });

    $rootScope.toggleSearchCriteriaOrientation = function() {
        if (changeSearchCriteriaOrientation == false) {
            $rootScope.searchCriteria.orientation = 'horizontal';
            changeSearchCriteriaOrientation = true;
        } else{
            $rootScope.searchCriteria.orientation = 'vertical';
            changeSearchCriteriaOrientation = false;
        }
        doRefresh();
    };
    $rootScope.editorChoice = function (){
        $rootScope.searchCriteria.editors_choice = !$rootScope.searchCriteria.editors_choice;
        // vm.viewTitle = "Editors Choice";
        doRefresh();
    }

    $rootScope.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: $rootScope.images,
        debounce:true,
        // favoritesEnabled:true,
        update: function (filteredItems) {
            if (filteredItems) {
                if (filteredItems.length < $rootScope.images.length) {
                    $rootScope.searchCriteria.page = 1;
                    $rootScope.images = filteredItems;
                    rowGridInit = false;
                    if (filteredItems.length > 0 ) {
                        $timeout(function(){
                            brickLoader();
                        },0);
                    }
                }
            }
        },
        cancel : function (items) {
            // document.getElementById('sub-header').style.top = '44px';
            // document.querySelector('[scroll-watch]').style.top = '88px';
            $scope.showSubHeader = true;
        },
        done: function(){
            $scope.showSubHeader = false;
            // document.getElementById('sub-header').style.top = '0px';
            // document.querySelector('[scroll-watch]').style.top = '44px';

        },
        filterProperties: 'tags'
      });
    }

    init();

    function init() {
        // Set Ink
        // touchPlay();
    }
    function loadMore(cb) {
        if (isLoadMoreStart) {
            return;
        }
        isLoadMoreStart = true;
        imageService
            .getImages($rootScope.searchCriteria)
            .then(function (result) {
                $rootScope.searchCriteria.page += 1;
                $rootScope.images = $rootScope.images.concat(result);
            }, function (error) {
                $scope.hasMoreImages = false;
                console.log(error);
            })
            .finally(function(result){
                $timeout(function(items) {
                    calculateOnImageLoad(function(){
                        brickLoader();
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        isLoadMoreStart = false;
                        if (typeof cb == 'function') {
                            cb();
                        }
                    });
                },200);
            });
    }
    function brickLoader(){
        try{
            if (!rowGridInit) {
                instance = Bricks({
                   container: '#brick-container',
                   sizes: sizes,
                   packed: 'data-packed'
                })
                instance .resize(true);
                instance.pack();
                instance
                .on('pack',   () => console.log('ALL grid items packed.'))
                .on('update', () => console.log('NEW grid items packed.'))
                .on('resize', function (size) {$log.info(size);})
                rowGridInit = true;
                $log.info("#####--------init--------######");
            } else {
                
                    instance.update()
               
                $log.info("#####--------update--------######");
            }
        } catch (e){$log.info("#####--------brick error happen--------######");}
    }
    function doRefresh(cb) {
        $scope.hasMoreImages = false;
        // document.querySelector('scroll-refresher.invisible')
        rowGridInit = false;
        $rootScope.searchCriteria.page = 1;
        $rootScope.images = [];
        // $timeout(function(){
            loadMore(function(){
                $scope.$broadcast('scroll.refreshComplete');
                // $scope.hasMoreImages = true;
            });
        // },0);
    }
    function calculateOnImageLoad(cb) {
        var currentlyLoaded = 0;

        var items = document.querySelectorAll("#brick-container > *:not([data-packed]) img"), 
            totalImg = items.length, 
            img;
        for (var i = 0; i < totalImg; i++) {
            img = items[i];
            
            (function(i) {
                if (img.complete) {
                    currentlyLoaded++;
                    // items[i].style.opacity = 1;
                    // items[i].parentNode.classList.remove('loading');
                    if (currentlyLoaded == totalImg) {
                        if (typeof cb == 'function') {
                            cb();
                        }
                        setOpacity1();
                    }
                    return;
                }
                img.addEventListener("load", function(loadimg) {
                    currentlyLoaded++;
                    // items[i].style.opacity = 1;
                    // items[i].parentNode.classList.remove('loading');
                    if (currentlyLoaded == totalImg) {
                        if (typeof cb == 'function') {
                            cb();
                        }
                        setOpacity1();
                    }
                });
                img.addEventListener("error", function(errorimg) {
                    currentlyLoaded++;
                    // items[i].style.opacity = 1;
                    items[i].parentNode.classList.remove('loading');
                    items[i].parentNode.classList.add('error');
                    if (currentlyLoaded == totalImg) {
                        if (typeof cb == 'function') {
                            cb();
                        }
                    }
                });
            })(i);
        }
        function setOpacity1(){
            for (var i = 0; i < totalImg; i++) {
                items[i].style.opacity = 1;
                items[i].parentNode.classList.remove('loading');
            }
        }
    }
    function openSlider(event, index) {
        if ($rootScope.isSelectSate) {
            $rootScope.selectImage(event.currentTarget);
            // event.currentTarget.classList.toggle('selected');
            return;
        }
        var items = [];
        for (var i = 0; i < 5; i++) {
            if (!$rootScope.images[index + i]) {
                continue;
            }
            items.push({
                index: index + i,
                src: $rootScope.images[index + i]['largeUrl'],
                w: $rootScope.images[index + i]['lg_w'],
                h: $rootScope.images[index + i]['lg_h'],
            });
        }
        if (items.length > 0) {
            slider(items, index);
        }
    }
    function slider(items, thumb_index) {
        var pswpElement = document.querySelectorAll('.pswp')[0];
        var options = {
            index: 0,
            loop :false,
            barsSize : {top:0,bottom:0},
            counterEl : false,
            captionEl : false,
            fullscreenEl : false,
            // shareEl : false,
            favEl : true,
            setWallpaperEl : true,
            bgOpacity : 0.85,
            // tapToClose : true,
            tapToToggleControls : true,
            errorMsg : '<div class="pswp__error-msg"><i class="icon ion-sad-outline"></i>&nbsp;&nbsp;The image could not be loaded.</div>',
            getThumbBoundsFn: function(index) {
                // at opening time take thumb_index and at close time take curr index + thumbindex
                if (index) {
                    thumb_index += index;
                }
                var thumbnail = document.querySelectorAll('#brick-container .brick-item')[thumb_index];

                // get window scroll Y
                var pageYScroll = window.pageYOffset || document.documentElement.scrollTop; 
                // optionally get horizontal scroll

                // get position of element relative to viewport
                var rect = thumbnail.getBoundingClientRect(); 

                // w = width
                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }
        };

        $rootScope.gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        $rootScope.gallery.init();
        var detect_slide_prev_next = 0;
        $rootScope.gallery.listen('afterChange', function() { 
            // $log.log(arguments);
            if (detect_slide_prev_next > this.currItem.index) {
                //slide left
            } else {
                //slide right
                var i = $rootScope.gallery.items[$rootScope.gallery.items.length - 1].index + 1;
                if ($rootScope.images[i]) {
                    $rootScope.gallery.items.push({
                        index: i,
                        src: $rootScope.images[i]['largeUrl'],
                        w: $rootScope.images[i]['lg_w'],
                        h: $rootScope.images[i]['lg_h'],
                    });
                }
            }
            detect_slide_prev_next = this.currItem.index;
        });
    }

}

function ImageCtrl($scope, $rootScope, $state, $stateParams, $ionicSlideBoxDelegate) {
    if (!$rootScope.images[parseInt($stateParams.id)]) {
        $state.go('app.imagelist');
    }
    $scope.image_slides = [];
    for (var i = 0; i < 5; i++) {
        if (!$rootScope.images[parseInt($stateParams.id)]) {
            $state.go('app.imagelist');
        }
        $scope.image_slides.push({
            'src': $rootScope.images[parseInt($stateParams.id) + i]['largeUrl'],
        });
    }

    $scope.slideHasChanged = function() {
        // $scope.image_slides.splice($scope.image_slides.length - 1)
        $scope.image_slides.shift();
        $scope.image_slides.push({
            // 'src': 'http://lorempixel.com/360/640?' + ($ionicSlideBoxDelegate.currentIndex() + 3)
            'src': $rootScope.images[parseInt($stateParams.id) + (i++)]['largeUrl']
        });
        $ionicSlideBoxDelegate.update();
    };
    $scope.$on('$ionicView.enter', function() {
        $scope.$parent.navBarTransparent = true;
        $scope.$parent.displaySearchButton = false;
        $scope.$parent.hideSheetFav = true;
        document.querySelector('ion-nav-view[name="fabContent"]').style.display = 'none';

    });
    $scope.$on('$ionicView.afterLeave', function() {
        $scope.$parent.navBarTransparent = false;
        $scope.$parent.displaySearchButton = true;
        document.querySelector('ion-nav-view[name="fabContent"]').style.display = 'block';

    });
    $scope.$on('$ionicView.afterEnter', function() {
        setTimeout(function() {
            document.querySelector('.slider-container .slider-slides').style.transform = "translate(0px, 0px) translateZ(0px)";
        }, 500);
        document.querySelector('.slider-container .slider-slides').style.transform = "translate(-60px, 0px) translateZ(0px)";
    });
}

function CategoryCtrl($log,$scope,$rootScope, $timeout, imageService, $ionicFilterBar, $ionicLoading, $state) {
    var cat_name,
        vm = this,
        searchCriteria = JSON.parse(JSON.stringify($rootScope.searchCriteria));

    $rootScope.page = 1;
    searchCriteria.per_page = 6;
    searchCriteria.editors_choice = true;

    vm.catImages = {};
    vm.isError = {};
    vm.isLoading = {};
    vm.catImages = {};
    vm.showMore = showMore;
    vm.openSlider = openSlider;

    $scope.$on('$ionicView.afterEnter', function() {
        // calculateOnImageLoad();
    });

    for(var i = 1; i < $rootScope.catrgories.length ; i++){
        category = $rootScope.catrgories[i];
        vm.isError[category] = false;
        vm.isLoading[category] = true;
        vm.catImages[category] = [];
        loadByCategory(category);
    }

    function loadByCategory(category, cb) {
        searchCriteria.category = category;
        imageService
            .getImages(searchCriteria)
            .then(function (result) {
                vm.isLoading[category] = false;
                vm.catImages[category] = vm.catImages[category].concat(result);
            }, function (error) {
                vm.isError[category] = true;
                console.log(error);
            })
            .finally(function(result){
                if (typeof cb == 'function') {
                    cb();
                }
            });
    }

    function calculateOnImageLoad(cb) {
        var currentlyLoaded = 0;
        var imgContainers = document.querySelectorAll(".category-img .category-scroll-x");
        for (var j = 0; j < imgContainers.length; j++) {

            var items = imgContainers[j].querySelectorAll("img"), 
                totalImg = items.length, 
                img, container_width = 0;
                (function(container_width, currentlyLoaded){

                    for (var i = 0; i < totalImg; i++) {
                        img = items[i];
                        
                        (function(img, container, totalImg) {
                            if (img.complete) {
                                currentlyLoaded++;
                                container_width += img.clientWidth;
                                if (currentlyLoaded == totalImg) {
                                    if (typeof cb == 'function') {
                                        cb();
                                    }
                                    container.style.width = 2 + container_width + "px";
                                }
                                // container.style.width = container.clientWidth + img.clientWidth + "px";
                                return;
                            }
                            img.addEventListener("load", function(loadimg) {
                                currentlyLoaded++;
                                container_width += img.clientWidth;
                                if (currentlyLoaded == totalImg) {
                                    if (typeof cb == 'function') {
                                        cb();
                                    }

                                    container.style.width = 2 + container_width + "px";
                                    // setOpacity1();
                                }
                                // container.style.width = container.clientWidth + img.clientWidth + "px";
                            });
                            img.addEventListener("error", function(errorimg) {
                                currentlyLoaded++;
                                img.style.display = "none";
                                if (currentlyLoaded == totalImg) {
                                    if (typeof cb == 'function') {
                                        cb();
                                    }
                                }
                            });
                        })(img, imgContainers[j], totalImg);
                    }


                })(container_width, currentlyLoaded);
            // break;
        }
    }

    function showMore(category){
        $rootScope.images = [];
        $rootScope.searchCriteria.page = 1;
        $rootScope.searchCriteria.category = category;
        $state.go('app.imagelist',{searchCriteria:{category:category}});
    }

    function openSlider(event,category,cat_index, index) {
        var items = [];
        for (var i = 0, l = vm.catImages[category].length; i < l; i++) {
            if (!vm.catImages[category][i]) {
                continue;
            }
            items.push({
                index: index + i,
                src: vm.catImages[category][i]['largeUrl'],
                w: vm.catImages[category][i]['lg_w'],
                h: vm.catImages[category][i]['lg_h'],
            });
        }
        if (items.length > 0) {
            slider(items, cat_index, index);
        }
    }
    function slider(items, cat_index, thumb_index) {
        var pswpElement = document.querySelectorAll('.pswp')[0];
        var options = {
            index: thumb_index,
            loop :false,
            barsSize : {top:0,bottom:0},
            captionEl : false,
            fullscreenEl : false,
            // shareEl : false,
            favEl : true,
            setWallpaperEl : true,
            bgOpacity : 0.85,
            // tapToClose : true,
            tapToToggleControls : true,
            errorMsg : '<div class="pswp__error-msg"><i class="icon ion-sad-outline"></i>&nbsp;&nbsp;The image could not be loaded.</div>',
            getThumbBoundsFn: function(index) {
                // at opening time take thumb_index and at close time take curr index + thumbindex
                // if (index) {
                //     thumb_index += index;
                // }
                var thumbnail = document.querySelectorAll('.category-img:nth-of-type('+ (cat_index+1) +') .center-cropped')[index];

                // get window scroll Y
                var pageYScroll = window.pageYOffset || document.documentElement.scrollTop; 
                // optionally get horizontal scroll

                // get position of element relative to viewport
                var rect = thumbnail.getBoundingClientRect(); 

                // w = width
                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }
        };

        $rootScope.gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        $rootScope.gallery.init();
    }
}
function FavoriteCtrl($scope, $rootScope, $state, $stateParams, $ionicSlideBoxDelegate, FavoriteService, imageService){
    var vm = this,
        isLoadMoreStart = false,
        hasMoreImages = true,
        fav_list_page = 1;

    vm.hasMoreImages = true;
    vm.fav_list_images = [];

    vm.openSlider = openSlider;
    vm.loadMore = loadMore;
    vm.doRefresh = doRefresh;
    init();

    function init() {
        // Set Ink
    }
    function loadMore(cb) {
        if (isLoadMoreStart) {
            return;
        }
        isLoadMoreStart = true;
        var fav_list = FavoriteService.getListByPage();
        if (fav_list.length == 0) {
            vm.hasMoreImages = false;
            return;
        }
        imageService
            .getImages({response_group: 'high_resolution', id:fav_list.join()})
            .then(function (result) {
                fav_list_page += 1;
                vm.fav_list_images = vm.fav_list_images.concat(result);
            }, function (error) {
                isLoadMoreStart = false;
                vm.hasMoreImages = false;
                console.log(error);
            })
            .finally(function(result){
                isLoadMoreStart = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                if (typeof cb == 'function') {
                    cb();
                }
            });
    }

    function doRefresh(cb) {
        fav_list_page = 1;
        vm.fav_list_images = [];
        $timeout(function(){
            loadMore(function(){
                $scope.$broadcast('scroll.refreshComplete');
            });
        },0);
    }

    function openSlider(event,fav_index) {
        var items = [];
        for (var i = 0, l = vm.fav_list_images.length; i < l; i++) {
            if (!vm.fav_list_images[i]) {
                continue;
            }
            items.push({
                index: fav_index + i,
                src: vm.fav_list_images[i]['largeUrl'],
                w: vm.fav_list_images[i]['lg_w'],
                h: vm.fav_list_images[i]['lg_h'],
            });
        }
        if (items.length > 0) {
            slider(items, fav_index);
        }
    }
    
    function slider(items, thumb_index) {
        var pswpElement = document.querySelectorAll('.pswp')[0];
        var options = {
            index: thumb_index,
            loop :false,
            barsSize : {top:0,bottom:0},
            captionEl : false,
            fullscreenEl : false,
            // shareEl : false,
            favEl : true,
            setWallpaperEl : true,
            bgOpacity : 0.85,
            // tapToClose : true,
            tapToToggleControls : true,
            errorMsg : '<div class="pswp__error-msg"><i class="icon ion-sad-outline"></i>&nbsp;&nbsp;The image could not be loaded.</div>',
            getThumbBoundsFn: function(index) {
                var thumbnail = document.querySelectorAll('.category-img .center-cropped')[index];

                // get window scroll Y
                var pageYScroll = window.pageYOffset || document.documentElement.scrollTop; 
                // optionally get horizontal scroll

                // get position of element relative to viewport
                var rect = thumbnail.getBoundingClientRect(); 

                // w = width
                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }
        };

        $rootScope.gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        $rootScope.gallery.init();
    }
}




// var myEfficientFn = debounce(function() {
//     // All the taxing stuff you do
// }, 250);

// window.addEventListener('resize', myEfficientFn);


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