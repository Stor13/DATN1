import React from "react";
import { useDropdown } from "../../Contexts/Dropdown-context";

const List = ({ children }) => {
  const { show } = useDropdown();
  return (
    <>
      {show && (
        <div className="absolute top-full left-0 w-full bg-white shadow-sm max-h-[224px] overflow-y-auto">
          {children}
        </div>
      )}
    </>
  );
};

export default List;
