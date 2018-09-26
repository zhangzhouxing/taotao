 //控制层 
app.controller('goodsController' ,function($scope,$controller,goodsService,uploadService,itemCatService,typeTemplateService){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	};
	
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	};
	
	//查询实体 
	$scope.findOne=function(id){				
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;					
			}
		);				
	};
	
	//保存 
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.id!=null){//如果有ID
			serviceObject=goodsService.update( $scope.entity ); //修改  
		}else{
			serviceObject=goodsService.add( $scope.entity  );//增加 
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					//重新查询 
		        	$scope.reloadList();//重新加载
				}else{
					alert(response.message);
				}
			}		
		);				
	};
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		goodsService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];
				}						
			}		
		);				
	};
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	};

	//新增商品
	$scope.add = function () {
		goodsService.add($scope.entity).success(
			function (response) {
				if(response.success){
					alert("保存成功");
					//清空entity
					$scope.entity={};
					//清空富文本编辑器
					editor.html('');
				}else{
					alert(response.message);
				}
            }
		);
    };
    
	//商品图片上传
	$scope.uploadFile = function () {
		uploadService.uploadFile().success(
			function (response) {
				if(response.success){
					//获取上传文件地址
					$scope.image_entity.url = response.message;
				}else{
					alert(response.message);
				}
            }
		).error(
			function(){
				alert("上传发生错误");
			}
		)
    };

    $scope.entity = {goods:{},goodsDesc:{itemImages:[]}};//定义页面实体结构
	//添加图片列表
	$scope.add_image_entity = function () {
		$scope.entity.goodsDesc.itemImages.push($scope.image_entity);
    };

    //列表中移除图片
	$scope.remove_image_entity = function (index) {
		$scope.entity.goodsDesc.itemImages.splice(index,1);
    };

    //读取商品一级分类
	$scope.selectItemCat1List = function () {
		itemCatService.findByParentId(0).success(
			function (response) {
				$scope.itemCat1List = response;
            }
		)
    };

	//$watch 方法用于监控某个变量的值，当被监控的值发生变化，就自动执行相应的函数.
	//读取商品二级分类
	$scope.$watch('entity.goods.category1Id', function (newValue, oldValue) {
		//根据选择的Id值，查询二级商品分类
		itemCatService.findByParentId(newValue).success(
			function (response) {
				$scope.itemCat2List = response;
            }
		);
		if (oldValue != undefined){
			$scope.entity.goods.category2Id = -1;
		}
    });

	//读取商品三级分类
	$scope.$watch('entity.goods.category2Id',function (newValue, oldValue) {
		//根据选择的Id值，查询三级商品分类
		itemCatService.findByParentId(newValue).success(
			function (response) {
				$scope.itemCat3List = response;
            }
		);
        if (oldValue != undefined){
            $scope.entity.goods.category3Id = -1;
        }
    });

	//三级商品分类选择后，读取模板ID
	$scope.$watch('entity.goods.category3Id',function (newValue, oldValue) {
		itemCatService.findOne(newValue).success(
			function (response) {
				$scope.entity.goods.typeTemplateId = response.typeId; //更新模板ID；
            }
		);

        if (oldValue != undefined){
            $scope.entity.goods.typeTemplateId = -1;
        }
    });

	//模板ID选择后，更新品牌列表
	$scope.$watch('entity.goods.typeTemplateId',function(newValue, oldValue){
		typeTemplateService.findOne(newValue).success(
			function (response) {
                $scope.typeTemplate = response;
				if(response != ""){
                    $scope.typeTemplate.brandIds = JSON.parse($scope.typeTemplate.brandIds);//品牌列表
					$scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.typeTemplate.customAttributeItems);//扩展属性
				}
            }
		);

        //查询规格列表
        typeTemplateService.findSpecList(newValue).success(
        	function (response) {
				$scope.specList = response;
            }
		);
    });

	//我们需要将用户选中的选项保存在 tb_goods_desc 表的 specification_items 字段中，定义 json格式如下：
	$scope.entity = { goodsDesc:{itemImages:[],specificationItems:[]} };

	$scope.updateSpecAttribute = function ($event,name,value) {
		var object = $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems,'attributeName',name);
		if(object != null){
			if($event.target.checked){
				object.attributeValue.push(value);
			}else{
				//取消勾选
				object.attributeValue.splice(object.attributeValue.indexOf(value),1);//移除选项

				//如果选项都取消了则将此条记录移除
				if(object.attributeValue.length==0){
					$scope.entity.goodsDesc.specificationItems.splice(
						$scope.entity.goodsDesc.specificationItems.indexOf(object),1
					);
				}
			}
		}else {
			//若返回为空则构建一个specificationItems对象
			$scope.entity.goodsDesc.specificationItems.push(
				{"attributeName":name,"attributeValue":[value]}
			);
		}
    };

	//创建SKU列表
	$scope.createItemList = function () {
		//初始化表格单元行对象
		$scope.entity.itemList = [{spec:{},price:0,num:9999,status:'0',isDefault:'0'}];

		var items = $scope.entity.goodsDesc.specificationItems;

		for (var i=0; i<items.length;i++){
			$scope.entity.itemList = addColumn($scope.entity.itemList,items[i].attributeName,items[i].attributeValue);
        }
	}
	addColumn = function (list,columnName,columnValues) {
		var newList = [];//新的集合
		for(var i=0;i<list.length;i++){
			var oldRow =
 list[i];
			for (var j=0;j<columnValues.length;j++){
				var newRow = JSON.parse(JSON.stringify(oldRow));//深克隆
				newRow.spec[columnName] = columnValues[j];
				newList.push(newRow);
            }
        }
        return newList;
    }
});
