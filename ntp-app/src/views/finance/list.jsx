import { useState, useEffect, useCallback } from "react"
import { Wallet, Plus, Search } from "lucide-react"
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
import { CustomPageTitle } from "@/components/ui-custom/custom-page-title"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DeleteTransactionConfirm } from "@/components/finance/delete-transaction-confirm"
import useTransactionListQuery from "@/queries/useTransactionListQuery"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"

// Mock data
const mockTransactions = [
  {
    id: 1,
    type: 'income',
    amount: 5000000,
    description: 'Thanh toán hợp đồng HD001',
    contract_id: 1,
    created_at: '2024-03-15T10:00:00Z',
    created_by: {
      id: 1,
      name: 'Accountant 1'
    }
  },
  {
    id: 2,
    type: 'expense',
    amount: 1000000,
    description: 'Chi phí vận hành',
    created_at: '2024-03-16T14:30:00Z',
    created_by: {
      id: 1,
      name: 'Accountant 1'
    }
  },
  // ... thêm mock data khác
];

const TRANSACTION_TYPE_OPTIONS = [
  { value: "all", label: "Tất cả loại" },
  { value: "income", label: "Thu" },
  { value: "expense", label: "Chi" }
];

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
const months = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `Tháng ${i + 1}`
}));

const ITEMS_PER_PAGE = 10;

const FinanceListPage = () => {
  const { toast } = useToast();
  const [showTransactionDialog, setShowTransactionDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Filter states
  const [filterValues, setFilterValues] = useState({
    type: "all",
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear()
  })

  // Comment out real API integration for now
  /*
  const { data: transactionData, isLoading: queryLoading, error } = useTransactionListQuery({
    ...filterValues,
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE
  });

  const transactions = transactionData?.data?.data ?? [];
  const totalItems = transactionData?.data?.total ?? 0;
  */

  // Use mock data instead
  const [transactions, setTransactions] = useState(mockTransactions)
  const totalItems = transactions.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Mock search functionality
  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    const filteredTransactions = mockTransactions.filter(t => {
      if (filterValues.type !== 'all' && t.type !== filterValues.type) return false;
      const transactionDate = new Date(t.created_at);
      if (transactionDate.getMonth() + 1 !== filterValues.month) return false;
      if (transactionDate.getFullYear() !== filterValues.year) return false;
      return true;
    });
    setTransactions(filteredTransactions);
  }, [filterValues]);

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      // Mock adding new transaction
      const newTransaction = {
        id: Math.max(...transactions.map(t => t.id)) + 1,
        ...data,
        created_at: new Date().toISOString(),
        created_by: {
          id: 1,
          name: 'Accountant 1'
        }
      };
      setTransactions([newTransaction, ...transactions])
      setShowTransactionDialog(false)
    } catch (error) {
      console.error('Error creating transaction:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = useCallback((transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDialog(true);
  }, []);

  const handleSuccess = useCallback(() => {
    setShowTransactionDialog(false);
    setSelectedTransaction(null);
  }, []);

  return (
    <div className="space-y-6">
      <CustomPageTitle title={'Quản lý tài chính (Chưa có phần dữ liệu)'} icon={<Wallet className="h-6 w-6 text-primary" />} />
      
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Thêm giao dịch
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedTransaction ? "Chỉnh sửa giao dịch" : "Thêm giao dịch mới"}
                </DialogTitle>
              </DialogHeader>
              <TransactionForm
                defaultValues={selectedTransaction}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                onSuccess={handleSuccess}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select
                  value={filterValues.type}
                  onValueChange={(value) => setFilterValues(prev => ({...prev, type: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSACTION_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filterValues.month.toString()}
                  onValueChange={(value) => setFilterValues(prev => ({...prev, month: parseInt(value)}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tháng" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filterValues.year.toString()}
                  onValueChange={(value) => setFilterValues(prev => ({...prev, year: parseInt(value)}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn năm" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button onClick={handleSearch} className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Tìm kiếm
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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

        <DeleteTransactionConfirm
          showDeleteDialog={showDeleteDialog}
          setShowDeleteDialog={setShowDeleteDialog}
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
        />

        <Card>
          <CardHeader>
            <CardTitle>Lịch sử giao dịch</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionTable 
              transactions={paginatedTransactions}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onEdit={handleEdit}
              setSelectedTransaction={setSelectedTransaction}
              setShowDeleteDialog={setShowDeleteDialog}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default FinanceListPage 