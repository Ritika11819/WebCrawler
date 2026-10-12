package com.webcrawler.webcrawler.service;

import com.webcrawler.webcrawler.model.URL;
import com.webcrawler.webcrawler.repository.CrawlerRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CrawlerRepositoryService {

    @Autowired
    CrawlerRepository crawlerRepository;

    public List<String> getNeighbors(String seedUrl) {
        if (seedUrl == null || seedUrl.trim().isEmpty()) {
            return java.util.Collections.emptyList();
        }

        URL url = crawlerRepository.findByUrl(seedUrl);
        if (url == null) {
            if (seedUrl.endsWith("/")) {
                url = crawlerRepository.findByUrl(seedUrl.substring(0, seedUrl.length() - 1));
            } else {
                url = crawlerRepository.findByUrl(seedUrl + "/");
            }
        }

        if (url == null) {
            if (seedUrl.startsWith("https://")) {
                url = crawlerRepository.findByUrl(seedUrl.replace("https://", "http://"));
                if (url == null) url = crawlerRepository.findByUrl(seedUrl.replace("https://", ""));
            } else if (seedUrl.startsWith("http://")) {
                url = crawlerRepository.findByUrl(seedUrl.replace("http://", "https://"));
                if (url == null) url = crawlerRepository.findByUrl(seedUrl.replace("http://", ""));
            } else {
                url = crawlerRepository.findByUrl("https://" + seedUrl);
                if (url == null) url = crawlerRepository.findByUrl("http://" + seedUrl);
            }
        }

        if (url == null || url.getNeighbors() == null) {
            return java.util.Collections.emptyList();
        }
        return url.getNeighbors();
    }
}
