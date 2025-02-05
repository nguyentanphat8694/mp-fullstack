import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const CustomerHistory = ({ history = [] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử tương tác</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {history.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex gap-4">
              {/* Timeline line */}
              <div className="relative flex items-center justify-center">
                <div className="absolute h-full w-[2px] bg-border" />
                <div className="relative h-2 w-2 rounded-full bg-primary" />
              </div>
              
              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{item.staff_name}</p>
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.action}</p>
                {item.note && (
                  <p className="mt-2 text-sm border-l-2 border-muted pl-4 italic">
                    {item.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export { CustomerHistory } 