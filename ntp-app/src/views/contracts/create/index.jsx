import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ContractForm } from "@/components/contracts/contract-form"
import { useToast } from "@/hooks/use-toast"

const CreateContractPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      // TODO: Call API to create contract
      await fetch('/api/contracts', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      
      toast({
        title: "Tạo hợp đồng thành công",
        description: `Hợp đồng ${data.code} đã được tạo.`
      })
      
      navigate('/contracts')
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo hợp đồng. Vui lòng thử lại.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Tạo hợp đồng mới</h1>
      </div>

      <ContractForm 
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export default CreateContractPage 