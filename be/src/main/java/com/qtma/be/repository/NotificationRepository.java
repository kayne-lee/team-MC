package com.qtma.be.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.qtma.be.model.User;

public interface NotificationRepository extends MongoRepository<User, ObjectId>  {
    List<User> findByEmail(String email);
}
