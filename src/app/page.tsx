"use client";

import { useEffect, useState } from "react";
import { SummaryCards } from "@/components/SummaryCards";
import { TransactionList } from "@/components/TransactionList";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { Transaction } from "@/types";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
      } else if (data) {
        setTransactions(data);
      }
      setLoading(false);
    }

    fetchTransactions();
  }, []);

  const handleAddTransaction = async (newTransaction: Omit<Transaction, "id" | "created_at">) => {
    const transactionToAdd = {
      ...newTransaction,
      id: Math.random().toString(36).substring(2, 11),
      created_at: new Date().toISOString(),
    } as Transaction;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('transactions')
        .insert([newTransaction])
        .select();

      if (error) {
        console.error('Error adding transaction:', error);
        // Fallback to local state for UX if Supabase fails (optional)
        setTransactions((prev) => [transactionToAdd, ...prev]);
      } else if (data) {
        setTransactions((prev) => [data[0], ...prev]);
      }
    } else {
      // Mock mode
      setTransactions((prev) => [transactionToAdd, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-10 px-4 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Personal Finance Tracker</h1>
            <p className="text-muted-foreground text-lg">Manage your expenses and income easily.</p>
          </div>
          <AddTransactionDialog onAddTransaction={handleAddTransaction} />
        </div>

        <SummaryCards transactions={transactions} />

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Recent Transactions</h2>
          {loading ? (
            <div className="flex justify-center py-10 text-muted-foreground">Loading transactions...</div>
          ) : (
            <TransactionList transactions={transactions} />
          )}
        </div>
      </main>
    </div>
  );
}
