import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Menu, X, Settings, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PATHS } from "@/helpers/paths"
import useUserInfoStore from "@/stores/useUserInfoStore"
import PropTypes from "prop-types"

const navigation = [
  { name: "Dashboard", path: PATHS.DASHBOARD },
  { name: "Khách hàng", path: PATHS.CUSTOMERS.LIST },
  { name: "Lịch hẹn", path: PATHS.APPOINTMENTS.TODAY },
  { name: "Hợp đồng", path: PATHS.CONTRACTS.LIST },
  { name: "Sản phẩm", path: PATHS.PRODUCTS.LIST },
  { name: "Công việc", path: PATHS.TASKS.LIST },
  { name: "Nhân viên", path: PATHS.EMPLOYEES.LIST },
  { name: "Tài chính", path: PATHS.FINANCES },
]

const MainLayout = ({ children }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const { userInfo, logout } = useUserInfoStore()

  const handleLogout = () => {
    logout()
    navigate(PATHS.AUTH.LOGIN)
  }

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

            {/* User menu */}
            <div className="hidden lg:flex lg:justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userInfo?.avatar} />
                      <AvatarFallback>
                        {userInfo?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{userInfo?.user_display_name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="hover:bg-muted" onClick={() => navigate(PATHS.SETTINGS)}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Cài đặt</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-muted" onClick={() => navigate(PATHS.ACCOUNT)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Tài khoản</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:bg-muted" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
              <DropdownMenuSeparator />
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate(PATHS.SETTINGS)}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Cài đặt</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate(PATHS.ACCOUNT)}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Tài khoản</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </Button>
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

export default MainLayout

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
}