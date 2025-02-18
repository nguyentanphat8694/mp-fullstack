import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog.jsx';
import PropTypes from 'prop-types';

const Modal = ({trigger, title, titleDescription, children}) => {
  return (
      <Dialog>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent
            className="sm:max-w-[425px] max-h-[80vh] overflow-auto flex flex-col">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {titleDescription}
            </DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
  );
};

export default Modal;

Modal.propTypes = {
  trigger: PropTypes.node.isRequired,
  title: PropTypes.string,
  titleDescription: PropTypes.string,
  children: PropTypes.node.isRequired,
};