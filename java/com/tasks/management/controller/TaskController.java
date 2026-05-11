package com.tasks.management.controller;

import com.tasks.management.model.Task;
import com.tasks.management.model.Subtask;
import com.tasks.management.repository.TaskRepository;
import com.tasks.management.repository.SubtaskRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository taskRepository;
    private final SubtaskRepository subtaskRepository;

    public TaskController(TaskRepository taskRepository, SubtaskRepository subtaskRepository) {
        this.taskRepository = taskRepository;
        this.subtaskRepository = subtaskRepository;
    }

    // GET all tasks for a user
    @GetMapping
    public ResponseEntity<?> getTasks(@RequestParam String username) {
        List<Task> tasks = taskRepository.findByOwner(username);
        return ResponseEntity.ok(tasks);
    }

    // POST create a new task
    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        if (task.getTitle() == null || task.getTitle().isBlank()) {
            return ResponseEntity.badRequest().body("Title is required");
        }
        if (task.getOwner() == null || task.getOwner().isBlank()) {
            return ResponseEntity.badRequest().body("Owner is required");
        }
        Task saved = taskRepository.save(task);
        return ResponseEntity.ok(saved);
    }

    // PUT toggle task done/undone
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        return taskRepository.findById(id).map(task -> {
            task.setDone(body.get("done"));
            taskRepository.save(task);
            return ResponseEntity.ok(task);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE a task
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        // delete subtasks first
        List<Subtask> subtasks = subtaskRepository.findByTaskId(id);
        subtaskRepository.deleteAll(subtasks);
        taskRepository.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }

    // GET subtasks for a task
    @GetMapping("/{id}/subtasks")
    public ResponseEntity<?> getSubtasks(@PathVariable Long id) {
        List<Subtask> subtasks = subtaskRepository.findByTaskId(id);
        return ResponseEntity.ok(subtasks);
    }

    // POST add subtask
    @PostMapping("/{id}/subtasks")
    public ResponseEntity<?> addSubtask(@PathVariable Long id, @RequestBody Subtask subtask) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        subtask.setTaskId(id);
        Subtask saved = subtaskRepository.save(subtask);
        return ResponseEntity.ok(saved);
    }

    // PUT toggle subtask done/undone
    @PutMapping("/subtasks/{id}/status")
    public ResponseEntity<?> updateSubtaskStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        return subtaskRepository.findById(id).map(subtask -> {
            subtask.setDone(body.get("done"));
            subtaskRepository.save(subtask);
            return ResponseEntity.ok(subtask);
        }).orElse(ResponseEntity.notFound().build());
    }
}