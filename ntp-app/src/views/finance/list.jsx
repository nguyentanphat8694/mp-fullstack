import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionTable } from "@/components/finance/transaction-table"
import { TransactionForm } from "@/components/finance/transaction-form"

const FinanceListPage = () => {
  const [transactions, setTransactions] = useState([])
  const [contracts, setContracts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showTransactionDialog, setShowTransactionDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Call API to get transactions
        const response = await fetch('/api/transactions')
        const data = await response.json()
        setTransactions(data)
      } catch (error) {
        console.error('Error fetching transactions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        // TODO: Call API to get active contracts
        const response = await fetch('/api/contracts?status=active')
        const data = await response.json()
        setContracts(data)
      } catch (error) {
        console.error('Error fetching contracts:', error)
      }
    }

    fetchContracts()
  }, [])

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      // TODO: Call API to create transaction
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const newTransaction = await response.json()
      setTransactions([newTransaction, ...transactions])
      setShowTransactionDialog(false)
    } catch (error) {
      console.error('Error creating transaction:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý tài chính</h1>
        <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm giao dịch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm giao dịch mới</DialogTitle>
            </DialogHeader>
            <TransactionForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              contracts={contracts}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Tổng thu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(
                transactions
                  .filter(t => t.type === 'income')
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tổng chi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(
                transactions
                  .filter(t => t.type === 'expense')
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Số dư</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(
                transactions.reduce((sum, t) => 
                  sum + (t.type === 'income' ? t.amount : -t.amount), 
                  0
                )
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử giao dịch</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable transactions={transactions} />
        </CardContent>
      </Card>
    </div>
  )
}

export default FinanceListPage 