import { MdOutlineSearch } from "react-icons/md";

export default function SearchIcon({ ariaHidden = false }) {
  return (
    <span className="search-icon" aria-hidden={ariaHidden}>
      <MdOutlineSearch size={20} />
    </span>
  );
}

