import PropTypes from "prop-types";

export const CustomPageTitle = ({title, icon}) => {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
};

CustomPageTitle.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.node,
}