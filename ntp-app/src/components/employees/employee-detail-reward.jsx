import {format} from "date-fns";
import PropTypes from "prop-types";

export const EmployeeDetailReward = ({employee}) => {
  return (<div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-4">Thưởng</h3>
      <div className="space-y-4">
        {employee.rewards.map((reward) => (
          <div
            key={reward.id}
            className="rounded-lg border p-4 space-y-2"
          >
            <div className="flex justify-between">
              <p className="font-medium">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(reward.amount)}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(reward.date), 'dd/MM/yyyy')}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">{reward.reason}</p>
          </div>
        ))}
      </div>
    </div>

    <div>
      <h3 className="text-lg font-semibold mb-4">Phạt</h3>
      <div className="space-y-4">
        {employee.penalties.map((penalty) => (
          <div
            key={penalty.id}
            className="rounded-lg border p-4 space-y-2"
          >
            <div className="flex justify-between">
              <p className="font-medium text-destructive">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(penalty.amount)}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(penalty.date), 'dd/MM/yyyy')}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">{penalty.reason}</p>
          </div>
        ))}
      </div>
    </div>
  </div>);
}

EmployeeDetailReward.propTypes = {
  employee: PropTypes.object,
}