package com.qtma.be.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import com.qtma.be.model.User;
import com.qtma.be.model.UserCourse;
import com.qtma.be.model.Course;
import com.qtma.be.model.Assignment;
import com.qtma.be.service.TwilioService;
import com.qtma.be.repository.UserCourseRepository;
import com.qtma.be.repository.UserRepository;

@Service
public class NotificationUtil {

    @Autowired
    private TwilioService twilioService;

    @Autowired
    private UserCourseRepository userCourseRepository;

    @Autowired
    private UserRepository userRepository;

    // Cron expression set to run every minute
// Your email for identifying user
    // private static final String MY_EMAIL = "21kl78@queensu.ca"; 

    // @Scheduled(cron = "0 * * * * ?") // Runs every minute
    // public void sendAssignmentNotifications() {
    //     // Retrieve your user by email
    //     User user = userRepository.findByEmail(MY_EMAIL).orElse(null);
        
    //     if (user == null || user.getPhone() == null) {
    //         System.out.println("User not found or phone number missing.");
    //         return;
    //     }
        
    //     String phoneNumber = user.getPhone();
    //     List<UserCourse> userCourses = userCourseRepository.findByEmail(MY_EMAIL).map(List::of).orElse(List.of());

    //     // Collect all assignments
    //     List<String> assignments = userCourses.stream()
    //         .flatMap(userCourse -> userCourse.getCourses().stream())
    //         .flatMap(course -> course.getAssignments().stream())
    //         .map(assignment -> "- " + assignment.getTitle() + " (Due: " + assignment.getDueDate() + ")")
    //         .collect(Collectors.toList());
        
    //     if (assignments.isEmpty()) {
    //         twilioService.sendSms(phoneNumber.toString(), "You have no assignments.");
    //     } else {
    //         String message = "Your Assignments:\n" + String.join("\n", assignments);
    //         twilioService.sendSms(phoneNumber, message);
    //     }
        
    //     System.out.println("Assignment list SMS sent to: " + phoneNumber);
    // }

    @Scheduled(cron = "0 0 9 * * ?") // Runs every day at 9 AM
    public void checkAndSendNotifications() {
        LocalDateTime now = LocalDateTime.now();

        // Retrieve all users
        List<User> users = userRepository.findAll();

        // For each user
        for (User user : users) {
            // Get the array of notification days before the assignment is due
            List<Integer> notificationDaysBeforeList = user.getNotificationCount();  // Now a List<Integer>
        
            List<UserCourse> userCourses = userCourseRepository.findByEmail(user.getEmail())
                        .map(userCourse -> List.of(userCourse)) // Return the user's courses
                        .orElse(List.of());
        
            for (UserCourse userCourse : userCourses) {
                for (Course course : userCourse.getCourses()) {
                    // For each assignment in the course
                    for (Assignment assignment : course.getAssignments()) {
                        // Skip "Random Task" assignments
                        if (assignment.getTitle().toLowerCase().contains("random task")) {
                            continue;
                        }
        
                        LocalDateTime dueDate = LocalDateTime.parse(assignment.getDueDate(), 
                                DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                        
                        // Loop through each notification day setting
                        for (int notificationDaysBefore : notificationDaysBeforeList) {
                            LocalDateTime notifyDate = dueDate.minusDays(notificationDaysBefore);
        
                            // If the notify date is today, send a notification
                            if (notifyDate.toLocalDate().equals(now.toLocalDate())) {
                                String phoneNumber = user.getPhone();
                                if (phoneNumber != null) {
                                    // Prepare the notification message
                                    String message = "Reminder: Your assignment '" + assignment.getTitle() + 
                                                     "' in course '" + course.getTitle() + 
                                                     "' is due in " + notificationDaysBefore + " days!";
                                    // Send SMS via Twilio
                                    twilioService.sendSms(phoneNumber, message);
                                    System.out.println("Sent SMS to: " + phoneNumber + " - Message: " + message);
                                } else {
                                    System.out.println("No phone number for user: " + user.getEmail());
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
