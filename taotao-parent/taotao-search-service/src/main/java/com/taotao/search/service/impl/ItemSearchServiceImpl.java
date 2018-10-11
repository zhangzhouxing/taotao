package com.taotao.search.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.taotao.pojo.TbItem;
import com.taotao.search.service.ItemSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.core.query.*;
import org.springframework.data.solr.core.query.result.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service(timeout = 3000)
public class ItemSearchServiceImpl implements ItemSearchService {

    @Autowired
    private SolrTemplate solrTemplate;

    @Autowired
    private RedisTemplate redisTemplate;

    /**
     * 查询品牌和规格列表
     */
    private Map searchBrandAndSpecList(String category){
        Map map = new HashMap();
        //获取模板ID
        Long typeId = (Long) redisTemplate.boundHashOps("itemCat").get(category);

        if(typeId != null){
            //根据模板ID查询品牌列表
            List brandList = (List) redisTemplate.boundHashOps("brandList").get(typeId);
            map.put("brandList",brandList);//返回值添加品牌列表

            //根据模板ID查询规格列表
            List specList = (List) redisTemplate.boundHashOps("specList").get(typeId);
            map.put("specList",specList);
        }
        return map;
    }

    @Override
    public Map<String, Object> search(Map searchMap) {

        Map<String, Object> map = new HashMap<>();

        //高亮结果查询
        map.putAll(searchList(searchMap));

        //商品分类查询
        List categoryList = searchCategoryList(searchMap);

        map.put("categoryList",categoryList);

        //查询品牌和规格列表
        String categoryName=(String)searchMap.get("category");

        if(!"".equals(categoryName)){//如果有分类名称
            map.putAll(searchBrandAndSpecList(categoryName));
        }else{//如果没有分类名称，按照第一个查询
            if(categoryList.size()>0){
                map.putAll(searchBrandAndSpecList((String) categoryList.get(0)));
            }
        }
        return map;
    }

    /**
     * 根据关键字搜索列表
     */
    private Map searchList(Map searchMap){
        Map map = new HashMap();

        HighlightQuery query = new SimpleHighlightQuery();

        //设置高亮的域
        HighlightOptions highlightOptions = new HighlightOptions().addField("item_title");

        highlightOptions.setSimplePrefix("<em style='color:red'>");//高亮前缀
        highlightOptions.setSimplePostfix("</em>");//高亮后缀
        query.setHighlightOptions(highlightOptions);//设置高亮选项

        //按照关键字查询
        Criteria criteria = new Criteria("item_keywords").is(searchMap.get("keywords"));
        query.addCriteria(criteria);

        //按分类筛选
        if(!"".equals(searchMap.get("category"))){
            Criteria filterCriteria = new Criteria("item_category").is(searchMap.get("category"));
            FilterQuery filterQuery = new SimpleFilterQuery(filterCriteria);
            query.addFilterQuery(filterQuery);
        }

        //按品牌筛选
        if(!"".equals(searchMap.get("brand"))){
            Criteria filterCriteria = new Criteria("item_brand").is(searchMap.get("brand"));
            FilterQuery filterQuery = new SimpleFilterQuery(filterCriteria);
            query.addFilterQuery(filterQuery);
        }

        //按规格筛选
        if(searchMap.get("spec") != null){
            Map<String,String> specMap = (Map) searchMap.get("spec");
            //遍历规格选项
            for (String key : specMap.keySet()){
                Criteria filterCriteria=new Criteria("item_spec_"+key).is( specMap.get(key) );
                FilterQuery filterQuery=new SimpleFilterQuery(filterCriteria);
                query.addFilterQuery(filterQuery);
            }
        }

        HighlightPage<TbItem> page = solrTemplate.queryForHighlightPage(query,TbItem.class);

        //循环高亮入口集合
        for (HighlightEntry<TbItem> h : page.getHighlighted()){
            TbItem item = h.getEntity();//获取原实体类

            if(h.getHighlights().size() > 0 && h.getHighlights().get(0).getSnipplets().size()>0){
                //设置高亮结果
                item.setTitle(h.getHighlights().get(0).getSnipplets().get(0));
            }
        }

        map.put("rows",page.getContent());
        return map;
    }

    /**
     * 查询分类列表
     */
    private List searchCategoryList(Map searchMap){
        List<String> list = new ArrayList<>();
        Query query = new SimpleQuery();

        //按照关键字查询
        Criteria criteria = new Criteria("item_keywords").is(searchMap.get("keywords"));

        query.addCriteria(criteria);

        //设置分组选项
        GroupOptions groupOptions = new GroupOptions().addGroupByField("item_category");
        query.setGroupOptions(groupOptions);

        //得到分组页
        GroupPage<TbItem> page = solrTemplate.queryForGroupPage(query,TbItem.class);

        //根据列得到分组结果集
        GroupResult<TbItem> groupResult = page.getGroupResult("item_category");

        //得到分组结果入口页
        Page<GroupEntry<TbItem>> groupEntries = groupResult.getGroupEntries();

        //得到分组入口集合
        List<GroupEntry<TbItem>> content = groupEntries.getContent();

        for(GroupEntry<TbItem> entry : content){
            //将分组结果的名称封装到返回值中
            list.add(entry.getGroupValue());
        }

        return list;
    }
}
