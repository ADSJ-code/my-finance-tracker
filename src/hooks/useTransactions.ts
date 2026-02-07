"use client";

import { useState, useEffect } from "react";
import { Transaction } from "@/types";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";

const STORAGE_KEY = "finance-tracker-transactions";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse transactions from localStorage", e);
        setTransactions(MOCK_TRANSACTIONS);
      }
    } else {
      setTransactions(MOCK_TRANSACTIONS);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions, isMounted]);

  const addTransaction = (newTransaction: Omit<Transaction, "id" | "created_at">) => {
    const transactionToAdd: Transaction = {
      ...newTransaction,
      id: Math.random().toString(36).substring(2, 11),
      created_at: new Date().toISOString(),
    };
    setTransactions((prev) => [transactionToAdd, ...prev]);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `finance-tracker-export-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const imported = JSON.parse(content);
          if (Array.isArray(imported)) {
            setTransactions(imported);
            resolve();
          } else {
            reject(new Error("Invalid file format"));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  return {
    transactions: isMounted ? transactions : [],
    isMounted,
    addTransaction,
    exportData,
    importData,
  };
}
