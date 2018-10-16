package com.taotao.search.service.impl;

import com.alibaba.fastjson.JSON;
import com.taotao.pojo.TbItem;
import com.taotao.search.service.ItemSearchService;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;
import java.util.List;
import java.util.Map;

public class ItemSearchListener implements MessageListener {

    @Autowired
    private ItemSearchService itemSearchService;

    @Override
    public void onMessage(Message message) {
        System.out.println("监听接收到消息...");

        try{
            TextMessage textMessage = (TextMessage) message;

            String text = textMessage.getText();

            List<TbItem> itemList = JSON.parseArray(text, TbItem.class);

            for (TbItem item : itemList){
                System.out.println(item.getId()+" "+item.getTitle());

                //将 spec 字段中的 json字符串转换为 map
                Map specMap = JSON.parseObject(item.getSpec());

                //给带注解的字段赋值
                item.setSpecMap(specMap);
            }

            //将输入导入到solr
            itemSearchService.importList(itemList);
        }catch(Exception e){
            e.printStackTrace();
        }
    }
}
