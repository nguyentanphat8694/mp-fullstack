import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PATHS } from "@/helpers/paths"
import PropTypes from "prop-types";

const navigation = [
  { name: "Dashboard", path: PATHS.DASHBOARD },
  { name: "Khách hàng", path: PATHS.CUSTOMERS.LIST },
  { name: "Lịch hẹn", path: PATHS.APPOINTMENTS.TODAY },
  { name: "Hợp đồng", path: PATHS.CONTRACTS },
  { name: "Sản phẩm", path: PATHS.PRODUCTS.LIST },
  { name: "Công việc", path: PATHS.TASKS },
  { name: "Nhân viên", path: PATHS.EMPLOYEES },
  { name: "Tài chính", path: PATHS.FINANCES },
  { name: "Cài đặt", path: PATHS.SETTINGS },
]

const MainLayout = ({ children }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex lg:flex-1">
              <Button 
                variant="ghost" 
                className="flex items-center gap-x-2 text-xl font-semibold"
                onClick={() => navigate(PATHS.DASHBOARD)}
              >
                <span className="text-indigo-600">MB</span>
                <span>Management</span>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <Button
                variant="ghost"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden lg:flex lg:gap-x-4">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant={pathname === item.path ? "default" : "ghost"}
                  onClick={() => navigate(item.path)}
                >
                  {item.name}
                </Button>
              ))}
            </div>

          </div>

          {/* Mobile navigation */}
          <div className={cn(
            "lg:hidden",
            mobileMenuOpen ? "block" : "hidden"
          )}>
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant={pathname === item.path ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    navigate(item.path)
                    setMobileMenuOpen(false)
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export default MainLayout;

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
}