import {Button} from "@/components/ui/button.jsx";
import {Calendar, Eye, Pencil, Trash2} from "lucide-react";
import PropTypes from "prop-types";
import {useCallback} from "react";
import {useNavigate} from "react-router-dom";

export const ProductTableActions = ({product, onEdit, setSelectedProduct, setShowDeleteDialog, setShowCheckModal}) => {
  const navigate = useNavigate();
  const handleViewDetail = useCallback(() => {
    navigate(`/products/${product.id}`)
  }, []);
  const handleEdit = useCallback(() => onEdit && onEdit(product), []);
  const handleDelete = useCallback(() => {
    setSelectedProduct(product);
    setShowDeleteDialog(true);
  }, []);
  const handleCheck = useCallback(() => {
    setSelectedProduct(product)
    setShowCheckModal(true)
  }, []);
  return (<div className="flex justify-end gap-2">
    <Button
      variant="ghost"
      size="icon"
      onClick={handleViewDetail}
    >
      <Eye className="h-4 w-4"/>
    </Button>
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
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCheck}
    >
      <Calendar className="h-4 w-4"/>
    </Button>
  </div>);
}

ProductTableActions.propTypes = {
  product: PropTypes.object,
  onEdit: PropTypes.func,
  setSelectedProduct: PropTypes.func,
  setShowDeleteDialog: PropTypes.func,
  setShowCheckModal: PropTypes.func,
}