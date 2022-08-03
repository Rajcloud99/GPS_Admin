materialAdmin
	.directive('dashboard', dashboard)
	.service('getGraph', getGraph);

dashboard.$inject = [
	'$timeout',
	'$uibModal',
	'DatePicker',
	// 'dashboardService',
	'getGraph'
];

getGraph.$inject = [
	'$parse'
];

function dashboard(
	$timeout,
	$uibModal,
	DatePicker,
	// dashboardService,
	getGraph
){

	function link(scope, element, attrs, vm) {
		vm.activateChangeOnFullscreen = vm.activateChangeOnFullscreen || false;
		vm.filter = {};
		vm.fullscreen = vm.graph.fullscreen;
		vm.setting = vm.graph.setting;
		vm.response = false;

		vm.getHeight = getHeight;
		vm.refreshAnalytic = refreshAnalytic;

		scope.$watch('vm.graphNo', fillGraph);

		// init
		(function init() {

			vm.graphNo = vm.graph.graphType[0];
			if(vm.graph.linkMe)
				vm.graph.linkMe = vm.chart;
			vm.chart.options = getGraph.get(vm.graphNo);
			if(vm.graph.filter){
				if(vm.graph.apiFilter.from && vm.graph.apiFilter.from){
					vm.filter.from = new Date(vm.graph.apiFilter.from);
					vm.filter.to = new Date(vm.graph.apiFilter.to);
				}else{
					vm.filter.to = new Date(new Date().setHours(23,59,59));
					vm.filter.from = new Date(new Date(new Date().setMonth(new Date().getMonth() - 5)).setHours(0,0,0));
				}

				vm.filter.aggregateByValue = vm.graph.apiFilter.aggregateBy;
				vm.filter.levelValue = vm.graph.apiFilter.level;
			}
			if(vm.graphData){
				setResponse(vm.graphData);
				$timeout(function () {
					typeof vm.graph.callbackAfterDone === 'function' && vm.graph.callbackAfterDone(vm.graphData);
				});
			}else{
				// getData();
			}
		})();

		// Actual Function
		function fillGraph() {

			if(!vm.response)
				return;

			vm.chart.options = getGraph.get(vm.graphNo);
			vm.chart.data = getGraph.setValue(vm.graphNo, (vm.graphNo.formatResponse && vm.graphNo.formatResponse(vm.response)) || vm.response);
		}

		function getData() {
			dashboardService.getService(vm.graph.api, prepareFilter(), successCallback, failureCallback);

			function successCallback(response) {
				setResponse(response);
				$timeout(function () {
					typeof vm.graph.callbackAfterDone === 'function' && vm.graph.callbackAfterDone(vm.graphData);
				});
			}

			function failureCallback(err) {
				console.log(err, 'remove this log');
				swal('',err.data.message,'error');
			}
		}

		function getHeight(type) {
			let height;

			if(vm.sizeMatrix[type] === 1)
				height = '150px';
			else if(vm.sizeMatrix[type] === 2)
				height = '312px';
			else
				height = '474px';

			return {
				'height':  height
			}
		}

		function prepareFilter() {
			if(!vm.graph.filter)
				return vm.graph.apiFilter;

			let request = {};

			vm.filter.from = new Date(vm.filter.from.setHours(0,0,0));
			vm.filter.to = new Date(vm.filter.to.setHours(23,59,59));

			request.start_date = vm.filter.from.toISOString();
			request.end_date = vm.filter.to.toISOString();
			request.aggregateBy = vm.filter.aggregateByValue;
			request.level = vm.filter.levelValue;

			return request;
		}

		function refreshAnalytic(formData) {
			//console.log(formData);
			getData();
		}

		function setResponse(response) {
			vm.response = (vm.graph.formatResponse && vm.graph.formatResponse(response)) || response;
			vm.chart.data = getGraph.setValue(vm.graphNo, (vm.graphNo.formatResponse && vm.graphNo.formatResponse(vm.response)) || vm.response);
		}
	}

	return {
		link: link,
		restrict: 'E',
		scope: {
			'graph': '=graph',
			'graphData': '=graphData',
			'activateChangeOnFullscreen': '@'
		},
		controllerAs: 'vm',
		bindToController: true,
		transclude: true,
		templateUrl: 'component/kpi/kpi.html',
		controller: function($scope, $parse, $sce){
			var vm = this;
			vm.chart = {};
			vm.DatePicker = angular.copy(DatePicker);
			vm.resetGraphVal = true;
			vm.showFullscreen = false;
			vm.sizeMatrix = {
				'bulletChart': 1,
				'table': 2
			};

			vm.loadFullscreen = loadFullscreen;
			vm.resetGraph = resetGraph;
			vm.setMaxDate = setMaxDate;
			vm.showSetting = showSetting;
			vm.tableClick = tableClick;

			// actual Function

			function loadFullscreen () {
				vm.showFullscreen = vm.showFullscreen ? false : true;
				resetGraph();

				if(!vm.showFullscreen)
					vm.graphNo = vm.graph.graphType[0];
			}

			function resetGraph() {
				vm.resetGraphVal = false;
				$timeout(function () {
					vm.resetGraphVal = true;
				});
			}

			function setMaxDate() {
				vm.filter.to = null;
				let tempDate =  new Date(vm.filter.from);
				vm.maxDate = new Date(tempDate.setMonth(tempDate.getMonth() + 5));
			}

			function showSetting () {

				$uibModal.open({
					templateUrl: 'views/dashboard/kpiSettingModal.html',
					controller: ['$uibModalInstance', 'DatePicker', 'graphData', kpiSettingModalController],
					controllerAs: 'vm',
					resolve: {
						graphData: function() {
							return {
								target : vm.chart.data.ranges[0],
								date : vm.chart.data.date
							};
						}
					}
				}).result.then(function(response) {

					getGraph.applySettingUpdates(vm.graph.graphType[0], vm.chart.data, response);

					// $timeout(function () {
					// 	resetGraph();
					// });

				}, function(response) {
					vm.settingEvent({
						type: 'cancel'
					});
				});
			}
			
			function tableClick() {
				
			}
		}
	};
}


function getGraph(
	$parse
) {

	this.get = function (type) {

		switch (type.type){
			case "bulletChart":
				return {
					chart: {
						type: 'bulletChart',
						transitionDuration: 500,
						height: type.height || 75,
						margin: type.margin || {
							bottom: 35,
							left: 90
						},
						tickFormat: type.xAxisTickFormat,
						tooltip: {
							contentGenerator : type.customeTooltip
						}
					}
				};

			case "discreteBarChart":
				return {
					chart: {
						type: 'discreteBarChart',
						margin : {
							left: 75,
							bottom: 150
						},
						x: type.xAxisKey || function(d){return d;},
						y: type.yAxisKey || function(d){return d;},
						xAxis: {
							axisLabel: type.xAxisLabel || 'xAxis',
							rotateLabels: -70,
						},
						yAxis: {
							axisLabel: type.yAxisLabel || 'yAxis',
							tickFormat: type.yAxisTickFormat
						},
						// discretebar: {
						// 	dispatch: {
						// 		elementDblClick: function(e) {
						// 			if(vm.selectedMonth !== null || vm.filter.aggregateByValue !== 'Date Wise')
						// 				return;
						// 			let index = monthNames.indexOf(e.data['DATE']);
						// 			vm.selectedMonth = index !== -1 ? index : null ;
						// 			generateAggregatedByDay();
						// 			$timeout(vm.api.refresh,100)
						// 		},
						// 	}
						// },
						tooltip: {
							contentGenerator : type.customeTooltip
						}
					}
				};

			case "multiBarChart":
				return {
					chart: {
						type: 'multiBarChart',
						margin : {
							left: 75,
							bottom: 150
						},
                        stacked: type.stacked || false,
						// x: type.xAxisKey || function(d){return d;},
						// y: type.yAxisKey || function(d){return d;},
						xAxis: {
							axisLabel: type.xAxisLabel || 'xAxis',
							rotateLabels: -70,
                            // tickFormat: function(d){
                            //     return d ? d3.format(',f')(d) : 0;
                            // }
						},
						yAxis: {
							axisLabel: type.yAxisLabel || 'yAxis',
							// tickFormat: function(d){
                            //     return d ? d3.format(',.1f')(d) : 0;
                            // }
						},
						tooltip: {
							contentGenerator : type.customeTooltip
						}
					}
				};

			case 'table':
				return {
					chart:{
						type: 'table',
						head: type.head
					}
				};
			case 'pieChart':
				return {
					chart: {
						type: 'pieChart',
						donut: type.donut || false,
						x: type.xAxisKey || function(d){return d;},
						y: type.yAxisKey || function(d){return d;},
						showLabels: typeof type.showLabels !== 'undefined' ? type.showLabels : true,
						showLegend: typeof type.showLegend !== 'undefined' ? type.showLegend : true,
						duration: 500,
						labelThreshold: 0.01,
						labelSunbeamLayout: true,
						legendPosition: type.legendPosition,
						legend: {
							margin: {
								top: 0,
								right: 0,
								bottom: 0,
								left: 0
							},
							dispatch: {
								stateChange: type.legendStateChangeCallback
							}
						},
						tooltip: {
							contentGenerator : type.customeTooltip
						},
						pie: {
							dispatch: {
								elementDblClick: type.onDblClick,
								elementClick: type.click
							}
						}
					}
				};
		}
	};

	this.setValue = function (type, value) {
		switch (type.type){
			case "bulletChart": {

				let target = $parse('value'+ type.graphValue.ranges)({'value': value}) || 0,
					achived = $parse('value'+ type.graphValue.measures)({'value': value}) || 0;
				return  {
					title:  type.graphValue.title,
					subtitle:  type.graphValue.subtitle,
					ranges: [ target, Math.max(target, achived)],
					measures: [ achived ],
					date: [ $parse('value'+ type.graphValue.date)({'value': value})]
				};
			}

			case "discreteBarChart":
				return [
					{
						key: "Cumulative Return",
						values: value
					}
				];

			case "multiBarChart":
				return value;

			case 'table':
				return value.map( obj => {
					let temp = {};

					for(let i in type.body){
						temp[i] = $parse(type.body[i])(obj);
					}

					return temp;
				});

			case 'pieChart':
				return value;
		}
	};

	this.applySettingUpdates = function (type, value) {
		switch (type.type){
			case "bulletChart":
				 type.graphValue.ranges = [ value.target, Math.max(value.target,  type.graphValue.measures)],
				 type.graphValue.date = value.date;
				return;

			case "discreteBarChart": break;
		}
	};
}
