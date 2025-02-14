import { useEffect, useState } from "react"
import { Activity, Users, FileText, Wallet } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentContracts } from "@/components/dashboard/recent-contracts"

const DashboardPage = () => {
  const [stats, setStats] = useState({
    total_customers: 0,
    total_contracts: 0,
    total_revenue: 0,
    total_appointments: 0
  })
  const [recentContracts, setRecentContracts] = useState([])

  useEffect(() => {
    // TODO: Fetch dashboard data from API
    const fetchDashboardData = async () => {
      try {
        // Mock data for now
        setStats({
          total_customers: 150,
          total_contracts: 45,
          total_revenue: 250000000,
          total_appointments: 12
        })

        setRecentContracts([
          {
            id: 1,
            customer_name: "Nguyễn Văn A",
            service_type: "Chụp ảnh cưới"
          },
          {
            id: 2, 
            customer_name: "Trần Thị B",
            service_type: "Thuê áo cưới"
          }
        ])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <h2 className="text-2xl font-bold">Dữ liệu giả</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tổng khách hàng"
          value={stats.total_customers}
          icon={Users}
          trend={5}
        />
        <StatsCard
          title="Tổng hợp đồng"
          value={stats.total_contracts}
          icon={FileText}
          trend={2}
        />
        <StatsCard
          title="Doanh thu"
          value={`${(stats.total_revenue / 1000000).toFixed(1)}M`}
          icon={Wallet}
          trend={-3}
        />
        <StatsCard
          title="Lịch hẹn hôm nay"
          value={stats.total_appointments}
          icon={Activity}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RecentContracts contracts={recentContracts}/>
        {/* Add more dashboard widgets here */}
      </div>
    </div>
  )
}

export default DashboardPage 