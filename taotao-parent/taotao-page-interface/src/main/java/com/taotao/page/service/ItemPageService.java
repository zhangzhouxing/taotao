package com.taotao.page.service;

/**
 * 商品详细页接口
 */
public interface ItemPageService {

    /**
     * 生成商品详细页
     */
    boolean getItemHtml(Long goodsId);

    /**
     * 删除商品详细页
     */
    boolean deleteItemHtml(Long[] goodsIds);
}
