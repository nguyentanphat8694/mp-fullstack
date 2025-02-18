import {
  Calendar, Edit, Eye, MoreVertical, Trash2, UserPlus,
  Menu, X, Settings, User, LogOut, Users, CheckCircle, XCircle,
  Info, ShoppingBag, Tag,
} from 'lucide-react';
import {ICON_NAME} from '@/helpers/constants.js';
import PropTypes from 'prop-types';

const Icon = ({name, className}) => {
  switch (name) {
    case ICON_NAME.CALENDAR:
      return <Calendar className={className ?? "h-4 w-4"}/>;
    case ICON_NAME.CHECK_CIRCLE:
      return <CheckCircle className={className ?? "h-4 w-4"}/>;
    case ICON_NAME.EDIT:
      return <Edit className={className ?? "h-4 w-4"}/>;
    case ICON_NAME.EYE:
      return <Eye className={className ?? "h-4 w-4"}/>;
    case ICON_NAME.INFO:
      return <Info className={className ?? "h-4 w-4"}/>;
    case ICON_NAME.LOGOUT:
      return <LogOut className={className ?? "h-4 w-4"}/>;
    case ICON_NAME.MENU:
      return <Menu className={className ?? "h-4 w-4"}/>;
    case ICON_NAME.MORE_VERTICAL:
      return <MoreVertical className={className ?? "h-4 w-4"}/>;
    case ICON_NAME.SETTINGS:
      return <Settings className={className ?? "h-4 w-4"}/>;
    case ICON_NAME.SHOPPING_BAG:
      return <ShoppingBag className={className ?? "h-4 w-4"}/>;
    case ICON_NAME.TAG:
      return <Tag className={className ?? "h-4 w-4"}/>;
    case ICON_NAME.TRASH:
      return <Trash2 className={className ?? "h-4 w-4"}/>;
    case ICON_NAME.USER:
      return <User className={className ?? "h-4 w-4"}/>;
    case ICON_NAME.USER_PLUS:
      return <UserPlus className={className ?? "h-4 w-4"}/>;
    case ICON_NAME.USERS:
      return <Users className={className ?? "h-4 w-4"}/>;
    case ICON_NAME.X:
      return <X className={className ?? "h-4 w-4"}/>;
    case ICON_NAME.X_CIRCLE:
      return <XCircle className={className ?? "h-4 w-4"}/>;
  }
};

export default Icon;

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
}