//基本控制器
app.controller('baseController', function ($scope) {

    //分页控制配置
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 10,
        itemsPerPage: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
            $scope.reloadList();
        }
    };

    //重新加载列表
    $scope.reloadList = function () {
        $scope.search($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
    };

    //复选框选中的ID集合
    $scope.selectIds = [];

    //更新复选框
    $scope.updateSelection = function ($event, id) {
        if ($event.target.checked) {
            //复选框被选中，则增加到ID集合中
            $scope.selectIds.push(id);
        } else {
            //复选框未选中，则将该id从ID集合中删除
            var idx = $scope.selectIds.indexOf(id);//获取该id在ID集合中的索引
            $scope.selectIds.splice(idx, 1);//删除该id
        }
    };

    $scope.jsonToString = function (jsonString, key) {
        var json = JSON.parse(jsonString); //将Json字符串转为JSON对象

        var value = "";

        for (var i = 0; i < json.length; i++) {
            if (i > 0) {
                value += "  ";
            }
            value += json[i][key];
        }

        return value;
    };

    //从集合中按照key查询对象
    $scope.searchObjectByKey = function (list, key, keyValue) {
        for (var i = 0; i < list.length; i++){
            if(list[i][key] == keyValue){
                return list[i];
            }
        }
        return null;
    }
});