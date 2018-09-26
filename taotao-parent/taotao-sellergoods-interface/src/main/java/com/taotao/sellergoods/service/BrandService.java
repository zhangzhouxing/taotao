package com.taotao.sellergoods.service;

import com.taotao.pojo.TbBrand;
import entity.PageResult;

import java.util.List;
import java.util.Map;

/**
 * 品牌服务层接口
 */
public interface BrandService {

    /**
     * 删除品牌
     */
    void delete(Long[] ids);

    /**
     * 根据品牌ID获取实体
     */
    TbBrand findOne(Long id);

    /**
     * 修改品牌
     */
    void update(TbBrand brand);

    /**
     * 增加品牌
     */
    void add(TbBrand brand);

    /**
     * 条件分页列表
     */
    PageResult findPage(int pageNum, int pageSize,TbBrand brand);

    /**
     * 返回分页列表
     */
    PageResult findPage(int pageNum, int pageSize);

    /**
     * 返回全部列表
     */
    List<TbBrand> findAll();

    /**
     * 品牌下拉框数据
     */
    List<Map> selectOptionList();
}
