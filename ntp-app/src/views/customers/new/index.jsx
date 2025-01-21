import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CustomerForm } from "@/components/customers/customer-form"
import { useToast } from "@/hooks/use-toast"

const NewCustomerPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true)
      // TODO: Call API to create customer
      console.log("Creating customer:", data)
      
      toast({
        title: "Thành công",
        description: "Đã thêm khách hàng mới"
      })
      navigate("/customers")
    } catch (error) {
      console.error("Error creating customer:", error)
      toast({
        title: "Lỗi",
        description: "Không thể thêm khách hàng",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Thêm khách hàng mới</h1>
      <div className="max-w-2xl">
        <CustomerForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default NewCustomerPage 