"use client";

import { SummaryCards } from "@/components/SummaryCards";
import { TransactionList } from "@/components/TransactionList";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { useTransactions } from "@/hooks/useTransactions";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useRef } from "react";

export default function Home() {
  const { transactions, isMounted, addTransaction, exportData, importData } = useTransactions();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await importData(file);
        alert("Data imported successfully!");
      } catch (error) {
        alert("Failed to import data. Please check the file format.");
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-10 px-4 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Personal Finance Tracker</h1>
            <p className="text-muted-foreground text-lg">Manage your expenses and income locally.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={exportData} className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleImportClick} className="flex items-center gap-2">
              <Upload className="h-4 w-4" /> Import
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <AddTransactionDialog onAddTransaction={addTransaction} />
          </div>
        </div>

        {!isMounted ? (
          <div className="flex justify-center py-10 text-muted-foreground">Initializing tracker...</div>
        ) : (
          <>
            <SummaryCards transactions={transactions} />

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Recent Transactions</h2>
              <TransactionList transactions={transactions} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
