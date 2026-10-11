package com.webcrawler.webcrawler.repository;

import com.webcrawler.webcrawler.model.URL;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CrawlerRepository extends MongoRepository<URL, ObjectId> {
    public URL findByUrl(String url);
}
