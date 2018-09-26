//登录服务层
app.service('loginService',function ($http) {
   //读取认证用户名称
   this.loginName = function () {
       return $http.get("../login/name.do");
   };
});