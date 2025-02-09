import { useEffect, useState } from "react"
import { Calendar as CalendarIcon, Search, ChevronDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {AppointmentCard} from "@/components/appointments/appointment-card.jsx";
import {CustomPageTitle} from "@/components/ui-custom/custom-page-title/index.jsx";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import CustomSelect from "@/components/ui-custom/custom-select"
import {APPOINTMENT_STATUS_OPTIONS} from '@/helpers/constants'
import useAppointmentListQuery from "@/queries/useAppointmentListQuery"

const MOCK_USER_ID = 1; // TODO: Get from auth contex

const AppointmentListPage = () => {
  const { toast } = useToast()
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isScheduledOpen, setIsScheduledOpen] = useState(true)
  const [isReceivingOpen, setIsReceivingOpen] = useState(true)
  const [isCompletedOpen, setIsCompletedOpen] = useState(true)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Integration code (commented)
  /*
  const { 
    data: appointmentData,
    isLoading: isLoadingAppointments,
    error
  } = useAppointmentListQuery({
    searchTerm,
    date: selectedDate,
    status: selectedStatus
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách lịch hẹn",
        variant: "destructive"
      });
    }
  }, [error]);

  useEffect(() => {
    if (appointmentData?.data) {
      setAppointments(appointmentData.data);
    }
  }, [appointmentData]);
  */

  // Group appointments by status
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    if (!acc[appointment.status]) {
      acc[appointment.status] = [];
    }
    acc[appointment.status].push(appointment);
    return acc;
  }, {});

  // Mock data for testing UI
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const mockAppointments = [
          {
            id: 1,
            customer: {
              id: 1,
              name: "Nguyễn Văn A",
              phone: "0123456789"
            },
            appointment_date: "2024-03-20T09:30:00",
            created_at: "2024-03-19T15:30:00",
            note: "Tư vấn váy cưới",
            status: "scheduled",
            assigned: null
          },
          {
            id: 2,
            customer: {
              id: 2,
              name: "Trần Thị B",
              phone: "0987654321"
            },
            appointment_date: "2024-03-20T10:00:00",
            created_at: "2024-03-19T16:30:00",
            note: "Chụp ảnh cưới ngoại cảnh",
            status: "receiving",
            assigned: {
              id: 1,
              name: "Nhân viên A"
            }
          },
          {
            id: 3,
            customer: {
              id: 3,
              name: "Lê Văn C",
              phone: "0369852147"
            },
            appointment_date: "2024-03-20T14:15:00",
            created_at: "2024-03-19T17:30:00",
            note: "Xem mẫu album",
            status: "receiving",
            assigned: {
              id: 2,
              name: "Nhân viên B"
            }
          },
          {
            id: 4,
            customer: {
              id: 4,
              name: "Phạm Thị D",
              phone: "0741852963"
            },
            appointment_date: "2024-03-20T15:30:00",
            created_at: "2024-03-20T08:30:00",
            note: "Tư vấn gói chụp ảnh trọn gói",
            status: "completed",
            assigned: {
              id: 1,
              name: "Nhân viên A"
            }
          }
        ]
        
        setAppointments(mockAppointments)
      } catch (error) {
        console.error("Error fetching appointments:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách lịch hẹn",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [toast])

  const handleReceive = async (id) => {
    // API call here
    console.log("Receiving appointment:", id)
  }

  const handleSearch = () => {
    // When using real API:
    // Will be handled automatically by the query hook when filter params change
    console.log("Searching with:", {
      searchTerm,
      date: selectedDate,
      status: selectedStatus
    });
  };

  const renderStatusSection = (status, isOpen, setIsOpen, title) => {
    const appointments = groupedAppointments[status] || [];
    if (!appointments.length) return null;

    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {title} ({appointments.length})
          </h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isOpen ? "rotate-180" : ""
                )}
              />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="flex flex-col gap-4">
            {/* Using flex to create rows */}
            {Array.from({ length: Math.ceil(appointments.length / 3) }).map((_, rowIndex) => (
              <div 
                key={rowIndex} 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {appointments.slice(rowIndex * 3, (rowIndex + 1) * 3).map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onReceive={handleReceive}
                    currentUserId={MOCK_USER_ID}
                  />
                ))}
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <CustomPageTitle title={'Lịch hẹn'} icon={<CalendarIcon className="h-6 w-6 text-primary" />} />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "PPP", { locale: vi })
              ) : (
                <span>Chọn ngày</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              locale={vi}
            />
          </PopoverContent>
        </Popover>

        <CustomSelect
          value={selectedStatus}
          onValueChange={setSelectedStatus}
          triggerName="Chọn trạng thái"
          options={APPOINTMENT_STATUS_OPTIONS}
        />

        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" />
          Tìm kiếm
        </Button>
      </div>

      {/* Appointments sections */}
      <div className="grid gap-8">
        {renderStatusSection(
          'scheduled',
          isScheduledOpen,
          setIsScheduledOpen,
          'Chờ tiếp nhận'
        )}
        {renderStatusSection(
          'receiving',
          isReceivingOpen,
          setIsReceivingOpen,
          'Đang tiếp nhận'
        )}
        {renderStatusSection(
          'completed',
          isCompletedOpen,
          setIsCompletedOpen,
          'Hoàn thành'
        )}
        {!appointments.length && (
          <p className="text-muted-foreground text-center">
            Không có lịch hẹn nào trong ngày
          </p>
        )}
      </div>
    </div>
  )
}

export default AppointmentListPage 