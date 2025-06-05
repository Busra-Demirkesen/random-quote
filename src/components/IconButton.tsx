interface IconButtonProps {
  onClick: () => void;
  iconClass: string;
  disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, iconClass, disabled }) => {
  return (
    <button
      onClick={onClick}
      className="px-5 py-2.5 m-2 rounded-md border-none cursor-pointer text-base transition-all duration-500 ease-linear bg-[#daccb8] text-white hover:bg-[#948571]"
      disabled={disabled}
    >
      <i className={iconClass}></i>
    </button>
  );
};

export default IconButton;
