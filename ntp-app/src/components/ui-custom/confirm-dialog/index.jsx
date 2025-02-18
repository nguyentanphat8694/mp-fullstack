import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog.jsx";
import PropTypes from 'prop-types';

const ConfirmDialog = ({trigger, title, content, cancelButton, actionButton}) => {
  return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          {trigger}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{content}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelButton.onClick} className={cancelButton.className}>
              {cancelButton.isPending ? cancelButton.labelPending : cancelButton.label}
            </AlertDialogCancel>
            <AlertDialogAction onClick={actionButton.onClick} className={actionButton.className}>
              {actionButton.isPending ? actionButton.labelPending : actionButton.label}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  );
};

export default ConfirmDialog;

const btnShape = PropTypes.shape({
  label: PropTypes.string,
  onClick: PropTypes.func,
  isPending: PropTypes.bool,
  labelPending: PropTypes.string,
  className: PropTypes.string,
})

ConfirmDialog.propTypes = {
  trigger: PropTypes.node.isRequired,
  title: PropTypes.string,
  content: PropTypes.string,
  cancelButton: btnShape,
  actionButton: btnShape,
};