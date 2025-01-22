import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const TaskTimeline = ({ history = [] }) => {
  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <div key={index} className="flex gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={item.user.avatar} />
            <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.user.name}</span>
              <span className="text-sm text-muted-foreground">
                {format(new Date(item.timestamp), 'HH:mm dd/MM/yyyy', { locale: vi })}
              </span>
            </div>
            <p className="text-sm">{item.action}</p>
            {item.comment && (
              <p className="text-sm bg-muted p-3 rounded-lg mt-2">{item.comment}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export { TaskTimeline } 