describe('BrowseProductsCtrl', function () {

    var $scope, $rootScope, $controller, mockedGlobalData, mockedThen, $q, settings;
    var productResult, priceResult, browseProdCtrl, mockedProductSvc, mockedPriceSvc, deferredProducts, deferredPrices;

    mockedGlobalData = {};
    mockedGlobalData.store = {};
    mockedGlobalData.products = {};
    mockedGlobalData.products.meta = {};
    mockedGlobalData.products.meta.total = 10;

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    beforeEach(angular.mock.module('ds.shared'));
    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.products'));

    beforeEach(inject(function(_$rootScope_, _$controller_,_settings_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        settings = _settings_;
    }));


    beforeEach(inject(function (_$q_) {

        $q = _$q_;
        mockedProductSvc = {};
        productResult = [
            {'name': 'prod1'}

        ];
        productResult.headers =  [];
        deferredProducts = $q.defer();
        deferredProducts.resolve(productResult);
        mockedProductSvc.query = jasmine.createSpy('query').andReturn(deferredProducts.promise);

        priceResult = [];
        deferredPrices = $q.defer();
        deferredPrices.resolve(priceResult);
        mockedPriceSvc = {};
        mockedPriceSvc.query =  jasmine.createSpy('query').andReturn(deferredPrices.promise);
    }));

    describe('Initialization', function () {


        beforeEach(function () {

            browseProdCtrl = $controller('BrowseProductsCtrl',
                {$scope: $scope, 'ProductSvc': mockedProductSvc, 'PriceSvc':mockedPriceSvc, 'GlobalData':mockedGlobalData, 'settings': settings});

        });

        it('should set image placeholder', function(){
            expect($scope.PLACEHOLDER_IMAGE).toBeTruthy();
        });


        it('should query products', function () {
            $scope.products = [];

            // trigger promise resolution:
            $scope.$digest();
            expect(mockedProductSvc.query).toHaveBeenCalled();
            // indirect testing via resolved promise
            expect($scope.products).toEqualData(productResult);
        });


    });

    describe('function', function() {
        beforeEach(function () {
            browseProdCtrl = $controller('BrowseProductsCtrl',
                {$scope: $scope, 'ProductSvc': mockedProductSvc, 'PriceSvc': mockedPriceSvc, 'GlobalData': mockedGlobalData, 'settings': settings});

        });


        describe('addMore', function () {

            it(' should query products and add them to the scope if no sorting', function () {
                $scope.products = [];
                $scope.addMore();
                // validate that "add more" added products returned by query to the scope
                expect(mockedProductSvc.query).wasCalled();
                // expect($scope.products).toEqualData(products);
            });

            it('should not query products if sorting enabled', function () {
                $scope.sort = 'price';
                mockedProductSvc.query.reset();
                $scope.addMore();
                expect(mockedProductSvc.query.callCount).toBe(0);
            });

        });

        describe('setSortedPage', function () {
            it('setSortedPage should update current page and query products', function () {

                var page = 4;
                $scope.setSortedPage(page);
                expect(mockedProductSvc.query).toHaveBeenCalled();
                expect($scope.pageNumber).toEqual(page);
            })
        });

        describe('backToTop', function () {
            it('should scroll to 0, 0', function () {
                window.scrollTo(0, 5);
                $scope.backToTop();
                expect(window.pageYOffset).toEqualData(0);
            });

        });

    });

});