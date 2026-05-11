package com.tasks.management.repository;

import com.tasks.management.model.Subtask;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubtaskRepository extends JpaRepository<Subtask, Long> {
    List<Subtask> findByTaskId(Long taskId);
}