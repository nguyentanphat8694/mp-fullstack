import { useState, useCallback } from "react"
import { ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import useCustomerOptionsQuery from "@/queries/useCustomerOptionsQuery"
import PropTypes from "prop-types"
import { useDebounce } from "@/hooks/use-debounce"

const CustomerSelect = ({ 
  value, 
  onValueChange,
  placeholder = "Chọn khách hàng...",
  triggerClassName,
  error
}) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)

  const { data: customerOptions, isLoading } = useCustomerOptionsQuery(debouncedSearch)
  const customers = customerOptions?.data || []

  const handleOpenChange = useCallback((isOpen) => {
    setOpen(isOpen)
    if (!isOpen) {
      setSearch("")
    }
  }, [])

  const selectedCustomer = customers.find(customer => customer.id === value)

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            error && "border-destructive",
            triggerClassName
          )}
        >
          {value && selectedCustomer
            ? selectedCustomer.name
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <div className="flex flex-col">
          <div className="flex items-center border-b p-2">
            <Input
              placeholder="Tìm kiếm khách hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 focus-visible:ring-0"
            />
          </div>
          <div className="max-h-[200px] overflow-auto p-1">
            {isLoading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Đang tìm kiếm...
              </div>
            ) : customers.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Không tìm thấy khách hàng
              </div>
            ) : (
              customers.map((customer) => (
                <div
                  key={customer.id}
                  className={cn(
                    "flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                    "hover:bg-accent hover:text-accent-foreground",
                    value === customer.id && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => {
                    onValueChange(customer.id)
                    setOpen(false)
                  }}
                >
                  {customer.name}
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

CustomerSelect.propTypes = {
  value: PropTypes.number,
  onValueChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  triggerClassName: PropTypes.string,
  error: PropTypes.bool
}

export default CustomerSelect 