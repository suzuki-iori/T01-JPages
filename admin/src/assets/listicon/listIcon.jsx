const ListIcon = ({ isActive }) => (
    <svg
        width="65"
        height="65"
        viewBox="0 0 65 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="65" height="65" rx="32.5" fill={isActive ? "#ffc042" : "#D9D9D9"} />
        <line x1="18" y1="22" x2="47" y2="22" stroke="white" strokeWidth="3" />
        <line x1="18" y1="32.5" x2="47" y2="32.5" stroke="white" strokeWidth="3" />
        <line x1="18" y1="43" x2="47" y2="43" stroke="white" strokeWidth="3" />
    </svg>
  );

  export default ListIcon;