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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { DatePicker } from "@/components/ui/date-picker"
import { Card, CardContent } from "@/components/ui/card"
import { UserSelect } from "@/components/ui-custom/user-select/index.jsx"
import PropTypes from "prop-types"
import { useFormContext } from "react-hook-form"

export const PhotographerSchedule = ({ control, name, type }) => {
  // Determine photographer role based on contract type
  const photographerRole = type === "wedding_photo" ? "photo_wedding" : "photo_pre_wedding"

  // Get form context to watch dates
  const { watch } = useFormContext();
  const startDate = watch(`${name}.start_date`);
  const endDate = watch(`${name}.end_date`);

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <FormField
          control={control}
          name={`${name}.photographer_id`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nhiếp ảnh</FormLabel>
              <FormControl>
                <UserSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  role={photographerRole}
                  placeholder="Chọn nhiếp ảnh..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name={`${name}.start_date`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày bắt đầu</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    toDate={endDate}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`${name}.end_date`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày kết thúc</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    fromDate={startDate}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

PhotographerSchedule.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["wedding_photo", "pre_wedding_photo"]).isRequired
}; 