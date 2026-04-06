package com.example.smartexpensesplitter.service;

import com.example.smartexpensesplitter.model.Expense;
import com.example.smartexpensesplitter.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    /**
     * Balance calculation logic:
     * - For each expense:
     *   - Split the amount equally between all people listed in splitBetween.
     *   - Each person owes their share (subtract from their balance).
     *   - The payer gets the full amount added to their balance.
     * - Positive balance means the person should RECEIVE money.
     * - Negative balance means the person OWES money.
     */
    public Map<String, Double> calculateBalances() {
        Map<String, Double> balances = new HashMap<>();

        List<Expense> expenses = expenseRepository.findAll();

        for (Expense expense : expenses) {
            double amount = expense.getAmount();
            String paidBy = expense.getPaidBy().trim();

            List<String> participants = Arrays.stream(expense.getSplitBetween().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();

            if (participants.isEmpty()) {
                continue;
            }

            double share = amount / participants.size();

            // each participant owes their share
            for (String person : participants) {
                balances.put(person, balances.getOrDefault(person, 0.0) - share);
            }

            // payer gets full amount credited
            balances.put(paidBy, balances.getOrDefault(paidBy, 0.0) + amount);
        }

        // Round to 2 decimal places for nicer display
        balances.replaceAll((name, value) -> Math.round(value * 100.0) / 100.0);

        return balances;
    }
}

