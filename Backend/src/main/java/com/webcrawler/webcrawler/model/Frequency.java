package com.webcrawler.webcrawler.model;

import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class Frequency {

    private final Map<URL, Integer> frequencyMap = new HashMap<>();

    public void insertURL(URL url) {
        frequencyMap.put(
                url,
                frequencyMap.getOrDefault(url, 0) + 1
        );
    }

    public List<URL> getTopFive() {
        return frequencyMap.entrySet()
                .stream()
                .sorted((a, b) ->
                        b.getValue().compareTo(a.getValue()))
                .limit(5)
                .map(Map.Entry::getKey)
                .toList();
    }
}
