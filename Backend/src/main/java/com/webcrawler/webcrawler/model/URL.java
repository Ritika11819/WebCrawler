package com.webcrawler.webcrawler.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.List;

@Document(collection = "url")
public class URL {
    @MongoId
    ObjectId _id;
    String url;
    List<String> neighbors;

    public URL() {
    }

    public URL(String url) {
        this.url = url;
    }

    public URL(String url, List<String> neighbors) {
        this.url = url;
        this.neighbors = neighbors;
    }

    public ObjectId getId() {
        return _id;
    }

    public void setId(ObjectId id) {
        this._id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public List<String> getNeighbors() {
        return neighbors;
    }

    public void setNeighbors(List<String> neighbors) {
        this.neighbors = neighbors;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        URL url1 = (URL) o;
        return java.util.Objects.equals(url, url1.url);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(url);
    }
}
