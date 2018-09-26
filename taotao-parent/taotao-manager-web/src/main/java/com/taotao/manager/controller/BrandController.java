package com.taotao.manager.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.taotao.pojo.TbBrand;
import com.taotao.sellergoods.service.BrandService;
import entity.PageResult;
import entity.Result;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * 品牌controller
 */
@RestController
@RequestMapping("/brand")
public class BrandController {

    @Reference
    private BrandService brandService;

    /**
     * 删除品牌
     */
    @RequestMapping("/delete")
    public Result delete(Long[] ids){
        try{
            brandService.delete(ids);
            return new Result(true,"删除成功");
        }catch(Exception e){
            return new Result(false, "删除失败");
        }
    }

    /**
     * 根据品牌ID获取实体
     */
    @RequestMapping("/findOne")
    public TbBrand findOne(Long id){
        return brandService.findOne(id);
    }

    /**
     * 修改品牌
     */
    @RequestMapping("/update")
    public Result update(@RequestBody TbBrand brand){
        try{
            brandService.update(brand);
            return new Result(true, "修改成功");
        }catch(Exception e){
            return new Result(false, "修改失败");
        }
    }

    /**
     * 新增品牌
     */
    @RequestMapping("/add")
    public Result add(@RequestBody TbBrand brand) {
        try {
            brandService.add(brand);
            return new Result(true, "增加成功");
        } catch (Exception e) {
            return new Result(false, "增加失败");
        }
    }

    /**
     * 条件分页列表
     */
    @RequestMapping("/search")
    public PageResult findByPage(int page, int rows, @RequestBody TbBrand brand){
        return brandService.findPage(page, rows, brand);
    }

    /**
     *返回分页列表
     */
    @RequestMapping("/findPage")
    public PageResult findByPage(int page, int rows){
       return brandService.findPage(page,rows);
    }

    /**
     * 返回全部品牌列表
     */
    @RequestMapping("/findAll")
    public List<TbBrand> findAll(){
        return brandService.findAll();
    }

    /**
     * 品牌下拉框数据
     */
    @RequestMapping("/selectOptionList")
    public List<Map> selectOptionList(){
        return brandService.selectOptionList();
    }
}
