//品牌控制层
app.controller('brandController',function($scope,$controller,brandService){

    $controller('baseController',{$scope:$scope});//继承

    //查询所有品牌
    $scope.findAll = function () {
        brandService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        )
    };

    //分页查询
    $scope.findPage = function(page, rows){
        brandService.findPage(page,rows).success(
            function (response) {
                $scope.list = response.rows;//获取当前分页列表
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }

        )
    };

    //定义查询的条件对象
    $scope.searchEntity = {};
    //条件分页查询
    $scope.search = function (page,rows) {
        brandService.search(page,rows,$scope.searchEntity).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;
            }

        )
    };

    //新增品牌
    $scope.save = function () {
        if($scope.entity.id != null){
            brandService.update($scope.entity).success(
                function (response) {
                    if(response.success){
                        $scope.reloadList();//重新查询
                    }else{
                        alert(response.message);
                    }
                }
            )
        }else {
            brandService.add($scope.entity).success(
                function (response) {
                    if(response.success){
                        $scope.reloadList();//重新查询
                    }else{
                        alert(response.message);
                    }
                }
            )
        }


    };

    //根据品牌ID进行回显
    $scope.findOne = function (id) {
        brandService.findOne(id).success(
            function (response) {
                $scope.entity = response;
            }
        )
    };

    //批量删除品牌列表
    $scope.delete = function () {
        brandService.delete($scope.selectIds).success(
            function (response) {
                if(response.success){
                    $scope.reloadList();
                }else{
                    alert(response.message);
                }
            }
        )
    };
});