package com.tasks.management.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String priority; // HIGH, MEDIUM, LOW

    @Column
    private String deadline; // e.g. "9:00 AM"

    @Column(nullable = false)
    private boolean done = false;

    @Column(nullable = false)
    private String owner; // username

    @Column
    private LocalDateTime createdAt = LocalDateTime.now();

    // GETTERS
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getPriority() { return priority; }
    public String getDeadline() { return deadline; }
    public boolean isDone() { return done; }
    public String getOwner() { return owner; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // SETTERS
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setPriority(String priority) { this.priority = priority; }
    public void setDeadline(String deadline) { this.deadline = deadline; }
    public void setDone(boolean done) { this.done = done; }
    public void setOwner(String owner) { this.owner = owner; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}