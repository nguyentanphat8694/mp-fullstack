import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ContractTable } from "@/components/contracts/contract-table"
import { DatePicker } from "@/components/ui/date-picker"
import {format} from "date-fns";
import CustomSelect from "@/components/ui-custom/custom-select/index.jsx";
import {CONTRACT_STATUS_OPTIONS, CONTRACT_TYPE_OPTION} from "@/helpers/constants.js";

// Mock data
const MOCK_CONTRACTS = [
  {
    id: 1,
    code: "HD001",
    customer_name: "Nguyễn Văn A",
    type: "dress_rental",
    status: "active",
    start_date: "2024-03-20",
    total_amount: 15000000,
    paid_amount: 5000000,
    created_by: "Sale 1",
    created_at: "2024-03-15"
  },
  {
    id: 2,
    code: "HD002",
    customer_name: "Trần Thị B",
    type: "wedding_photo",
    status: "pending",
    start_date: "2024-03-25",
    total_amount: 25000000,
    paid_amount: 10000000,
    created_by: "Sale 2",
    created_at: "2024-03-16"
  },
  {
    id: 3,
    code: "HD003",
    customer_name: "Lê Văn C",
    type: "pre_wedding_photo",
    status: "completed",
    start_date: "2024-03-18",
    total_amount: 20000000,
    paid_amount: 20000000,
    created_by: "Sale 1",
    created_at: "2024-03-10"
  }
]

const ContractListPage = () => {
  const navigate = useNavigate()
  const [contracts, setContracts] = useState(MOCK_CONTRACTS) // Use mock data
  const [filteredContracts, setFilteredContracts] = useState(MOCK_CONTRACTS)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState(null)

  useEffect(() => {
    let filtered = [...contracts]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(contract =>
        contract.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(contract => contract.type === typeFilter)
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(contract => contract.status === statusFilter)
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(contract => 
        contract.start_date === format(dateFilter, 'yyyy-MM-dd')
      )
    }

    setFilteredContracts(filtered)
  }, [contracts, searchTerm, typeFilter, statusFilter, dateFilter])

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Danh sách hợp đồng</h1>
        <Button onClick={() => navigate('/contracts/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo hợp đồng
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Tìm theo mã HĐ, tên khách..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />

        <CustomSelect
          value={typeFilter}
          onValueChange={setTypeFilter}
          triggerName="Loại hợp đồng"
          options={CONTRACT_TYPE_OPTION}
        />

        <CustomSelect
          value={statusFilter}
          onValueChange={setStatusFilter}
          triggerName="Trạng thái"
          options={CONTRACT_STATUS_OPTIONS}
        />

        <DatePicker
          placeholder="Lọc theo ngày"
          value={dateFilter}
          onChange={setDateFilter}
        />
      </div>

      <ContractTable 
        contracts={filteredContracts}
        onView={(contract) => navigate(`/contracts/${contract.id}`)}
        onEdit={(contract) => navigate(`/contracts/${contract.id}/edit`)}
      />
    </div>
  )
}

export default ContractListPage 