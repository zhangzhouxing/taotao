//搜索控制层
app.controller('searchController',function($scope,searchService){

    //搜索对象
    $scope.searchMap={'keywords':'','category':'','brand':'','spec':{}};

	//搜索
	$scope.search=function(){
		searchService.search($scope.searchMap).success(
			function(response){
				$scope.resultMap=response; //搜索返回的结果
			}
		);		
	};

	//添加搜索项
	$scope.addSearchItem = function (key,value) {
        //如果点击的是分类或品牌
        if(key == 'category' || key == 'brand'){
			$scope.searchMap[key] = value;
        }else {
        	$scope.searchMap.spec[key] = value;
		}

        $scope.search();//执行搜索
    };

    //移除符合搜索条件
	$scope.removeSearchItem = function (key) {
		if(key == "category" || key == "brand"){
			$scope.searchMap[key] ="";
		}else{
			delete $scope.searchMap.spec[key];//移除此属性
		}

		$scope.search();//执行搜索
    }
});