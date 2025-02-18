import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.jsx';
import PropTypes from 'prop-types';

const MenuDropdown = ({items, trigger}) => {
  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {trigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {items && items.map((item, idx) => (
              <DropdownMenuItem
                  key={`dropdown-${item.label}-${idx}`}
                  onClick={item.onClick}>
                {item.icon && item.icon}
                {item.label}
              </DropdownMenuItem>))}
        </DropdownMenuContent>
      </DropdownMenu>
  );
};

export default MenuDropdown;

MenuDropdown.propTypes = {
  trigger: PropTypes.node.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.string,
    label: PropTypes.string,
    onClick: PropTypes.func,
  })),
};