import { FiSearch } from "react-icons/fi";

function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3">
      <FiSearch className="text-slate-500" />
      <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" placeholder={placeholder} />
    </label>
  );
}

export default SearchBar;

