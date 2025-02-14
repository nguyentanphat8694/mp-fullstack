import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, ReceiptText, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ContractTable } from "@/components/contracts/contract-table"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import CustomSelect from "@/components/ui-custom/custom-select"
import { CONTRACT_TYPE_OPTIONS } from "@/helpers/constants"
import { CustomPageTitle } from "@/components/ui-custom/custom-page-title"
import useContractListQuery from "@/queries/useContractListQuery"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data for testing UI
const mockContracts = [
  {
    id: 1,
    code: "HD001",
    customer: {
      id: 1,
      name: "Nguyễn Văn A"
    },
    type: "dress_rental",
    start_date: "2024-02-15",
    total_amount: 15000000
  },
  {
    id: 2,
    code: "HD002", 
    customer: {
      id: 2,
      name: "Trần Thị B"
    },
    type: "wedding_photo",
    start_date: "2024-02-25",
    total_amount: 25000000
  }
];

const ContractListPage = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter states
  const [filterValues, setFilterValues] = useState({
    search: "",
    type: "all",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  })

  // Query params state
  const [filterParams, setFilterParams] = useState({
    search: "",
    type: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    limit: itemsPerPage,
    offset: 0
  })

  //Integration code - commented for now
  const { data, isPending } = useContractListQuery(filterParams)

  const handleSearch = useCallback(() => {
    setCurrentPage(1)
    const newParams = {
      ...filterParams,
      search: filterValues.search,
      type: filterValues.type !== 'all' ? filterValues.type : '',
      month: filterValues.month,
      year: filterValues.year,
      offset: 0
    }
    setFilterParams(newParams)
  }, [filterValues])

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
    setFilterParams(prev => ({
      ...prev,
      offset: (page - 1) * itemsPerPage
    }))
  }, [itemsPerPage])


  // Generate years from 2020 to current year
  const years = Array.from(
    { length: new Date().getFullYear() - 2019 },
    (_, i) => 2020 + i
  )

  // Generate months 1-12
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: format(new Date(2024, i, 1), 'MMMM', { locale: vi })
  }))

  return (
    <div className="space-y-6">
      <CustomPageTitle 
        title={'Danh sách hợp đồng (Chưa có phần dữ liệu)'}
        icon={<ReceiptText className="h-6 w-6 text-primary" />} 
      />

      <div className="flex justify-end">
        <Button onClick={() => navigate('/contracts/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo hợp đồng
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Tìm theo mã HĐ, tên khách..."
          value={filterValues.search}
          onChange={(e) => setFilterValues(prev => ({...prev, search: e.target.value}))}
          className="w-full"
        />

        <CustomSelect
          value={filterValues.type}
          onValueChange={(value) => setFilterValues(prev => ({...prev, type: value}))}
          triggerName="Loại hợp đồng"
          options={CONTRACT_TYPE_OPTIONS}
        />

        <div className="flex gap-2">
          <Select
            value={filterValues.month.toString()}
            onValueChange={(value) => setFilterValues(prev => ({...prev, month: parseInt(value)}))}
          >
            <SelectTrigger className="w-[140px]">
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
            <SelectTrigger className="w-[100px]">
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
        </div>

        <Button onClick={() => {}} className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Tìm kiếm
        </Button>
      </div>

      {/*Integration code - commented for now*/}
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <ContractTable
          contracts={data?.data?.data?.data || []}
          currentPage={currentPage}
          totalPages={Math.ceil((data?.total || 0) / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      )}


      {/*/!* Using mock data for testing UI *!/*/}
      {/*<ContractTable*/}
      {/*  contracts={mockContracts}*/}
      {/*  currentPage={1}*/}
      {/*  totalPages={1}*/}
      {/*  onPageChange={() => {}}*/}
      {/*/>*/}
    </div>
  )
}

export default ContractListPage 