package com.qtma.be.repository;

import com.qtma.be.model.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, ObjectId> {
    Optional<User> findByEmail(String email);
    Optional<User> findById(String id);
    Optional<User> findBygoogleEmail(String googleEmail);
}
