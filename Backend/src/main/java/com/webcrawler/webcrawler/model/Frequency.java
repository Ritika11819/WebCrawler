package com.webcrawler.webcrawler.model;

import com.webcrawler.webcrawler.repository.CrawlerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class Frequency {

    @Autowired(required = false)
    CrawlerRepository crawlerRepository;

    private final Map<URL, Integer> frequencyMap = new HashMap<>();

    public void insertURL(URL url) {
        if (url == null || url.getUrl() == null || url.getUrl().trim().isEmpty()) {
            return;
        }

        // Preserve database neighbors if available
        if ((url.getNeighbors() == null || url.getNeighbors().isEmpty()) && crawlerRepository != null) {
            URL dbUrl = crawlerRepository.findByUrl(url.getUrl());
            if (dbUrl != null) {
                url = dbUrl;
            }
        }

        frequencyMap.put(
                url,
                frequencyMap.getOrDefault(url, 0) + 1
        );
    }

    public List<URL> getTopFive() {
        List<URL> top = frequencyMap.entrySet()
                .stream()
                .sorted((a, b) ->
                        b.getValue().compareTo(a.getValue()))
                .limit(5)
                .map(Map.Entry::getKey)
                .toList();

        // If no searches have occurred yet, fetch top records directly from MongoDB database
        if (top.isEmpty() && crawlerRepository != null) {
            try {
                return crawlerRepository.findAll().stream().limit(5).toList();
            } catch (Exception e) {
                return Collections.emptyList();
            }
        }
        return top;
    }
}
