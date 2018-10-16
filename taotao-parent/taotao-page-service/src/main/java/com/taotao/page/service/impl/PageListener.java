package com.taotao.page.service.impl;


import com.taotao.page.service.ItemPageService;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;

public class PageListener implements MessageListener {

    @Autowired
    private ItemPageService itemPageService;

    @Override
    public void onMessage(Message message) {
        TextMessage textMessage = (TextMessage) message;

        try {
            String text = textMessage.getText();
            System.out.println("接收到消息：" + text);

            itemPageService.getItemHtml(Long.parseLong(text));
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
