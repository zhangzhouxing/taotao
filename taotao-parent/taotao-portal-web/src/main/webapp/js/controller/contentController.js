//广告控制层（运营商后台）
app.controller("contentController",function ($scope,contentService) {

    //广告集合
    $scope.contentList = [];

    //根据分类ID查询广告列表
    $scope.findByCategoryId = function (categoryId) {
        contentService.findByCategoryId(categoryId).success(
            function (response) {
                $scope.contentList[categoryId] = response;
            }
        )
    };
});