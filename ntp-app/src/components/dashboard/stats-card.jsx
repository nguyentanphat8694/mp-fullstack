import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const StatsCard = ({ title, value, icon: Icon, trend, className }) => {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={cn(
            "text-xs",
            trend > 0 ? "text-green-600" : "text-red-600"
          )}>
            {trend > 0 ? "+" : ""}{trend}% so với tháng trước
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export { StatsCard } 