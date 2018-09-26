app.controller('indexController', function ($scope, $controller, loginService) {
    //读取当前认证用户名称
    $scope.showLoginName = function () {
        loginService.loginName().success(
            function (response) {
                $scope.loginName = response.loginName;
            }
        );
    };

});