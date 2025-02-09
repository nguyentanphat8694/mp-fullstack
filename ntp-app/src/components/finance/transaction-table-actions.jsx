import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import PropTypes from "prop-types"
import { useCallback } from "react"

export const TransactionTableActions = ({ 
  transaction, 
  onEdit, 
  setSelectedTransaction,
  setShowDeleteDialog 
}) => {
  const handleEdit = useCallback(() => onEdit && onEdit(transaction), [transaction, onEdit]);
  
  const handleDelete = useCallback(() => {
    setSelectedTransaction(transaction);
    setShowDeleteDialog(true);
  }, [transaction]);

  // Only show actions for transactions with contract_id
  if (!transaction.contract_id) return null;

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleEdit}
      >
        <Pencil className="h-4 w-4"/>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4"/>
      </Button>
    </div>
  );
};

TransactionTableActions.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.number,
    contract_id: PropTypes.number,
  }),
  onEdit: PropTypes.func,
  setSelectedTransaction: PropTypes.func,
  setShowDeleteDialog: PropTypes.func
}; 