package com.qtma.be.repository;

import com.qtma.be.model.User;
import com.qtma.be.model.UserCourse;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserCourseRepository extends MongoRepository<UserCourse, ObjectId> {
    Optional<UserCourse> findByEmail(String email);
    Optional<UserCourse> findById(String id);
}
