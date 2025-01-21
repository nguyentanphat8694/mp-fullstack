import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PATHS } from "@/helpers/paths"

const RecentContracts = ({ contracts = [] }) => {
  const navigate = useNavigate()

  const handleViewContract = useCallback((id) => {
    navigate(`${PATHS.CONTRACTS}/${id}`)
  }, [navigate])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hợp đồng gần đây</CardTitle>
        <CardDescription>
          Danh sách các hợp đồng mới được tạo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contracts.map(contract => (
            <div 
              key={contract.id}
              className="flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {contract.customer_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {contract.service_type}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewContract(contract.id)}
              >
                Xem chi tiết
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export { RecentContracts } 