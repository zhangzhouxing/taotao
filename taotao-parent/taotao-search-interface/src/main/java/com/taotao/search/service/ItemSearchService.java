package com.taotao.search.service;

import java.util.List;
import java.util.Map;

public interface ItemSearchService {
    /**
     * 搜索
     */
    Map<String,Object> search(Map searchMap);

    /**
     * 导入数据
     */
    void importList(List list);

    /**
     * 删除数据
     */
    void deleteByGoodsIds(List goodsIdList);
}
