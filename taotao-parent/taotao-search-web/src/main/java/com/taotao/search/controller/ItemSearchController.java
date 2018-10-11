package com.taotao.search.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.taotao.search.service.ItemSearchService;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/itemsearch")
public class ItemSearchController {

    @Reference
    private ItemSearchService itemSearchService;

    @RequestMapping("/search")
    public Map<String, Object> search(@RequestBody Map searchMap){

        Map<String, Object> search = itemSearchService.search(searchMap);

        return search;
    }
}
