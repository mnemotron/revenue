/**
 * SHARE.MODULE
 */

var shareModule = angular.module('share.module', ['share.config']);

shareModule.controller('ctrlViewShare', function($scope, storageService, STORAGE_SERVICE_KEY, $location, shareService, logService, LOGTYPE, SHARE_LANGUAGE) {

	// EVENT: translate
	$scope.$emit('translate', {part : SHARE_LANGUAGE.PART});

	// EVENT: breadcrumb
	$scope.$emit('breadcrumb', {id : 'breadcrumb.share', link : '/viewShare'});
	
	$scope.selectedShare = storageService.get(STORAGE_SERVICE_KEY.SHARE);
	$scope.selectedDepot = storageService.get(STORAGE_SERVICE_KEY.DEPOT);
	$scope.selectedPortfolio = storageService.get(STORAGE_SERVICE_KEY.PORTFOLIO);
	
	$scope.getHistoricalQuotes = function(timePeriod, interval){
		
		shareService.getHistoricalQuotes(
				function successCallback(response){
				
					$scope.data = [response.data.quoteList];
					$scope.series = [response.data.name];
					$scope.labels = response.data.xLabelList;
					$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
					
					$scope.options = { 

							  elements: {
						            line: { tension: 0 },
						            point: { radius: 0 }
						        },
						
						    scales: {
						      yAxes: [
						        {
						          id: 'y-axis-1',
						          type: 'linear',
						          display: true,
						          position: 'left'
						        }
						      ]
						    }
						  }
					
				}, 
				function errorCallback(response){
					logService.set('Revenue.Depot.Share.Quote', LOGTYPE.ERROR, response.data);
				},
				{params: {api: 'DY', tickerId : 'BMW.DE', interval: interval, timePeriod: timePeriod}}		
				
			);
	}
	
	$scope.changeTimePeriod = function(timePeriod) {
		
		$scope.timePeriod = timePeriod;
		
		$scope.getHistoricalQuotes($scope.timePeriod, $scope.interval);
	}
	
	$scope.changeInterval = function(interval) {
		
		$scope.interval = interval;
		
		$scope.getHistoricalQuotes($scope.timePeriod, $scope.interval)
	}

	$scope.deleteShare = function(){
		
		shareService.deleteShare(function successCallback(response) {
			$location.path('/viewDepot');
		}, function errorCallback(response) {
			logService.set('Revenue.Share.Delete', LOGTYPE.ERROR, response.data);
			$scope.$emit('notify', {type : 'E', msgId : 'viewShare.share.delete.notify.error'});
		}, {params : {shareId : $scope.selectedShare.id}});

	}
	
	$scope.timePeriod = '1Y';
	$scope.interval = '1D';
	
	//GET HISTORICAL QUOTES
	$scope.getHistoricalQuotes($scope.timePeriod, $scope.interval);
	
});

shareModule.controller('ctrlViewAddShare', function($scope, storageService, logService, shareService, LOGTYPE, STORAGE_SERVICE_KEY, $location, SHARE_LANGUAGE) {

	//EVENT: translate
	$scope.$emit('translate', {part:SHARE_LANGUAGE.PART});
	
	$scope.createShare = function() {

		var portfolio = storageService.get(STORAGE_SERVICE_KEY.PORTFOLIO);
		var depot = storageService.get(STORAGE_SERVICE_KEY.DEPOT);
		
		$scope.share['portfolioId'] = portfolio.id;
		$scope.share['depotId'] = depot.id;
		
		shareService.createShare(
				function successCallback(response){
					$location.path( '/viewDepot' );
				}, 
				function errorCallback(response){
					logService.set('Revenue.Share.Create', LOGTYPE.ERROR, response.data);
					$scope.$emit('notify', {type:'E', msgId:'viewCreateShare.form.create.notify.error'});
				}, 
				$scope.share
		);
	}

});
