package com.webcrawler.webcrawler.controller;

import com.webcrawler.webcrawler.model.Frequency;
import com.webcrawler.webcrawler.model.URL;
import com.webcrawler.webcrawler.service.CrawlerServiceImplementation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Controller
public class CrawlerController {

    @Autowired
    CrawlerServiceImplementation crawlerServiceImplementation;

    @Autowired
    Frequency frequency;

    @GetMapping("/neighbours")
    public ResponseEntity<List<String>> getNeighbors(@RequestBody URL seedUrl){
        frequency.insertURL(seedUrl);
        List<String> neighbour=crawlerServiceImplementation.bfs(seedUrl.getUrl());
        return ResponseEntity.ok(neighbour);
    }

    @GetMapping("/shortcuts")
    public ResponseEntity<List<URL>> getShortcuts(){
        List<URL> shortcut=frequency.getTopFive();
        return ResponseEntity.ok(shortcut);
    }
}
