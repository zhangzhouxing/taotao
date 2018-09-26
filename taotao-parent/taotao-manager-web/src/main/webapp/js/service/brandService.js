//品牌服务层
app.service('brandService', function ($http) {
    //查询所有品牌
    this.findAll = function () {
        return $http.get('../brand/findAll.do');
    };

    //分页查询
    this.findPage = function (page, rows) {
        return $http.get('../brand/findPage.do?page=' + page + '&rows=' + rows);
    };

    //查询实体
    this.findOne = function (id) {
        return $http.get('../brand/findOne.do?id=' + id);
    };

    //新增品牌
    this.add = function (entity) {
        return $http.post('../brand/add.do', entity);
    };

    //修改品牌
    this.update = function (entity) {
        return $http.post('../brand/update.do', entity);
    };

    //删除品牌
    this.delete = function (ids) {
        return $http.get('../brand/delete.do?ids=' + ids);
    };

    //搜索
    this.search = function (page, rows, searchEntity) {
        return $http.post('../brand/search.do?page=' + page + "&rows=" + rows, searchEntity);
    };

    //品牌下拉列表数据
    this.selectOptionList = function(){
        return $http.get('../brand/selectOptionList.do');
    };
});