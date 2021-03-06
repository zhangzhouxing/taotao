package com.taotao.manager.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 登录控制层
 */
@RestController
@RequestMapping("/login")
public class LoginController {

    @RequestMapping("/name")
    public Map name(){
        Map map = new HashMap();

        String name = SecurityContextHolder.getContext().getAuthentication().getName();

        map.put("loginName",name);

        return map;
    }

}
