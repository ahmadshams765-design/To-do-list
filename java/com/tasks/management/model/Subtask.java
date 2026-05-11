package com.tasks.management.model;

import jakarta.persistence.*;

@Entity
@Table(name = "subtasks")
public class Subtask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private boolean done = false;

    @Column(nullable = false)
    private Long taskId;

    // GETTERS
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public boolean isDone() { return done; }
    public Long getTaskId() { return taskId; }

    // SETTERS
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDone(boolean done) { this.done = done; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }
}