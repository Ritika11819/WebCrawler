package com.webcrawler.webcrawler.controller;

import com.webcrawler.webcrawler.model.Frequency;
import com.webcrawler.webcrawler.model.URL;
import com.webcrawler.webcrawler.service.CrawlerServiceImplementation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class CrawlerController {

    @Autowired
    CrawlerServiceImplementation crawlerServiceImplementation;

    @Autowired
    Frequency frequency;

    @RequestMapping(value = {"/neighbours", "/neighbors"}, method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<List<String>> getNeighbors(
            @RequestBody(required = false) URL seedUrlBody,
            @RequestParam(value = "url", required = false) String urlParam) {

        String targetUrl = "";
        if (seedUrlBody != null && seedUrlBody.getUrl() != null && !seedUrlBody.getUrl().trim().isEmpty()) {
            targetUrl = seedUrlBody.getUrl().trim();
        } else if (urlParam != null && !urlParam.trim().isEmpty()) {
            targetUrl = urlParam.trim();
        }

        if (targetUrl.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        URL seedUrl = seedUrlBody != null ? seedUrlBody : new URL();
        seedUrl.setUrl(targetUrl);

        frequency.insertURL(seedUrl);

        List<String> neighbour = crawlerServiceImplementation.bfs(targetUrl);
        return ResponseEntity.ok(neighbour);
    }

    @GetMapping("/shortcuts")
    public ResponseEntity<List<URL>> getShortcuts() {
        List<URL> shortcut = frequency.getTopFive();
        return ResponseEntity.ok(shortcut);
    }
}
