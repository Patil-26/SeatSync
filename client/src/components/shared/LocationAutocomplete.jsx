import { useState, useEffect, useRef } from "react";

const LocationAutocomplete = ({ label, placeholder, onSelect, defaultValue = "" }) => {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.length < 3) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&addressdetails=1&limit=5&countrycodes=in`,
          { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleSelect = (item) => {
    const name = item.display_name.split(",").slice(0, 2).join(",").trim();
    setQuery(name);
    setResults([]);
    setOpen(false);
    onSelect({
      name,
      address: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    });
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {label && (
        <label className="block text-sm font-black uppercase tracking-wider mb-1">
          {label}
        </label>
      )}
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder || "Search location..."}
        className="input-field w-full"
        autoComplete="off"
      />
      {open && (loading || results.length > 0) && (
        <div
          className="absolute z-50 w-full mt-1 bg-white border-2 border-black rounded"
          style={{ boxShadow: "3px 3px 0 #1a1a1a" }}
        >
          {loading && (
            <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
          )}
          {results.map((item) => (
            <div
              key={item.place_id}
              onMouseDown={() => handleSelect(item)}
              className="px-4 py-3 text-sm cursor-pointer hover:bg-yellow-100 border-b border-gray-100 last:border-0"
            >
              <p className="font-bold truncate">{item.display_name.split(",")[0]}</p>
              <p className="text-xs text-gray-400 truncate">{item.display_name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;