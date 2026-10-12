package com.webcrawler.webcrawler.service;

import com.webcrawler.webcrawler.model.Frequency;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CrawlerServiceImplementation {

    @Autowired
    CrawlerRepositoryService crawlerRepositoryService;

    public List<String> bfs(String seedUrl){
        List<String> links=new ArrayList<>();
        HashMap<String,Boolean> visited=new HashMap<>();
        Queue<String> frontierQueue=new LinkedList<>();
        frontierQueue.add(seedUrl);
        visited.put(seedUrl,true);

        while(!frontierQueue.isEmpty()){
            String currentUrl=frontierQueue.poll();
            for(String neighbour : crawlerRepositoryService.getNeighbors(currentUrl)){
                if(!visited.containsKey(neighbour) || !visited.get(neighbour)){
                    frontierQueue.add(neighbour);
                    links.add(neighbour);
                    visited.put(neighbour,true);
                }
            }
        }
        return links;
    }
}