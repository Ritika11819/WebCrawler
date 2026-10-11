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
        URL url = crawlerRepository.findByUrl(seedUrl);
        return url.getNeighbors();
    }
}
