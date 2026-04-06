package com.example.smartexpensesplitter.repository;

import com.example.smartexpensesplitter.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
}

