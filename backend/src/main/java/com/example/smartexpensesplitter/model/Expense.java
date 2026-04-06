package com.example.smartexpensesplitter.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Amount is required")
    @Min(value = 1, message = "Amount must be at least 1")
    private Double amount;

    @NotBlank(message = "PaidBy is required")
    private String paidBy;

    /**
     * Comma-separated list of people this expense is split between,
     * for example: "A,B,C"
     */
    @NotBlank(message = "splitBetween is required")
    private String splitBetween;

    public Expense() {
    }

    public Expense(String description, Double amount, String paidBy, String splitBetween) {
        this.description = description;
        this.amount = amount;
        this.paidBy = paidBy;
        this.splitBetween = splitBetween;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaidBy() {
        return paidBy;
    }

    public void setPaidBy(String paidBy) {
        this.paidBy = paidBy;
    }

    public String getSplitBetween() {
        return splitBetween;
    }

    public void setSplitBetween(String splitBetween) {
        this.splitBetween = splitBetween;
    }
}

