import {
  Dialog,
  DialogContent, DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PropTypes from "prop-types";

const CustomDialog = ({ isOpen, setIsOpen, triggerNode, description, className, title, contentNode, onOpenChange }) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        onOpenChange && onOpenChange(open);
      }}
    >
      <DialogTrigger asChild>{triggerNode}</DialogTrigger>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description ? description : ''}</DialogDescription>
        </DialogHeader>
        {contentNode}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;

CustomDialog.propTypes = {
  triggerNode: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string,
  contentNode: PropTypes.node,
  onOpenChange: PropTypes.func,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  description: PropTypes.string,
};
