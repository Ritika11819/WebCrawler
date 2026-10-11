package com.webcrawler.webcrawler.service;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CrawlerService {
    public List<String> bfs(String seedUrl, List<String> urls);
}
