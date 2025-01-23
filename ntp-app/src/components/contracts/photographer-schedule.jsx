import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export const PhotographerSchedule = ({
  value,
  onChange,
  type,
  startDate,
  endDate
}) => {
  const [photographers, setPhotographers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [schedules, setSchedules] = useState([])

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        // TODO: Call API to get photographers based on type
        const role = type === 'wedding_photo' ? 'photo-wedding' : 'photo-pre-wedding'
        const response = await fetch(`/api/photographers?role=${role}`)
        const data = await response.json()
        setPhotographers(data)
      } catch (error) {
        console.error('Error fetching photographers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPhotographers()
  }, [type])

  useEffect(() => {
    const fetchSchedules = async () => {
      if (startDate && endDate) {
        try {
          // TODO: Call API to get schedules
          const response = await fetch(
            `/api/schedules?start=${format(startDate, 'yyyy-MM-dd')}&end=${format(endDate, 'yyyy-MM-dd')}`
          )
          const data = await response.json()
          setSchedules(data)
        } catch (error) {
          console.error('Error fetching schedules:', error)
        }
      }
    }

    fetchSchedules()
  }, [startDate, endDate])

  const isAvailable = (photographerId) => {
    return !schedules.some(schedule => 
      schedule.photographer_id === photographerId &&
      schedule.status !== 'cancelled'
    )
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thợ chụp hình</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {photographers.map((photographer) => (
            <TableRow key={photographer.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="font-medium">{photographer.name}</p>
                    <p className="text-sm text-muted-foreground">{photographer.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{photographer.phone}</TableCell>
              <TableCell>
                <Badge
                  variant={isAvailable(photographer.id) ? "success" : "destructive"}
                >
                  {isAvailable(photographer.id) ? "Có sẵn" : "Bận"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant={value === photographer.id ? "default" : "outline"}
                  disabled={!isAvailable(photographer.id)}
                  onClick={() => onChange(photographer.id)}
                >
                  {value === photographer.id ? "Đã chọn" : "Chọn"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 