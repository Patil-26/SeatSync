import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";
import RideCard from "../../components/shared/RideCard.jsx";
import Spinner from "../../components/shared/Spinner.jsx";
import LocationAutocomplete from "../../components/shared/LocationAutocomplete.jsx";
import MapPreview from "../../components/shared/MapPreview.jsx";
import { SearchIllustration } from "../../components/shared/FlatIllustrations.jsx";
import useRideStore from "../../store/useRideStore.js";
import useAuthStore from "../../store/useAuthStore.js";
import api from "../../api/axios.js";

const SearchRides = () => {
  const [searchParams] = useSearchParams();
  const { rides, loading, total, searchRides } = useRideStore();
  const { user } = useAuthStore();

  const [form, setForm] = useState({
    sourceName: searchParams.get("source") || "",
    sourceLat: "", sourceLng: "",
    destinationName: searchParams.get("destination") || "",
    destinationLat: "", destinationLng: "",
    date: searchParams.get("date") || "",
    seats: "1",
  });

  const [mapSource, setMapSource] = useState(null);
  const [mapDestination, setMapDestination] = useState(null);
  const [searched, setSearched] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionReason, setSuggestionReason] = useState("");

  useEffect(() => {
    if (form.sourceName || form.destinationName) {
      searchRides(form);
      setSearched(true);
    }
    // fetch smart suggestions for logged-in passengers
    if (user?.role === "passenger") {
      setSuggestionsLoading(true);
      api.get("/smart/suggestions")
        .then((res) => {
          setSuggestions(res.data.suggestions || []);
          setSuggestionReason(res.data.reason || "");
        })
        .catch(() => setSuggestions([]))
        .finally(() => setSuggestionsLoading(false));
    }
  }, []);

  const handleSourceSelect = (location) => {
    setForm({ ...form, sourceName: location.name, sourceLat: location.lat, sourceLng: location.lng });
    setMapSource(location);
  };

  const handleDestinationSelect = (location) => {
    setForm({ ...form, destinationName: location.name, destinationLat: location.lat, destinationLng: location.lng });
    setMapDestination(location);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchRides(form);
    setSearched(true);
  };

  return (
    <div className="min-h-screen" style={{ background: "#fffef5" }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Search Form */}
        <div className="card mb-6 animate-fade-up">
          <p className="font-black uppercase tracking-wider text-sm mb-3">Search Rides</p>
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <LocationAutocomplete
                label="From"
                placeholder="Source city..."
                onSelect={handleSourceSelect}
                defaultValue={form.sourceName}
              />
              <LocationAutocomplete
                label="To"
                placeholder="Destination city..."
                onSelect={handleDestinationSelect}
                defaultValue={form.destinationName}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-black uppercase tracking-wider mb-1">Date</label>
                <input type="date" value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-black uppercase tracking-wider mb-1">Seats</label>
                <select value={form.seats}
                  onChange={(e) => setForm({ ...form, seats: e.target.value })}
                  className="input-field w-full">
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>{n} seat{n > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end col-span-2 md:col-span-1">
                <button type="submit" className="btn-primary w-full">Search</button>
              </div>
            </div>
          </form>
        </div>

        {/* Map Preview */}
        {(mapSource || mapDestination) && (
          <div className="mb-6 animate-fade-up">
            <p className="text-sm font-black uppercase tracking-wider mb-2">Route Preview</p>
            <MapPreview source={mapSource} destination={mapDestination} />
          </div>
        )}

        {/* Smart Suggestions — shown before search */}
        {!searched && user?.role === "passenger" && (
          <div className="mb-6 animate-fade-up">
            <div className="flex items-center gap-2 mb-3">
              <p className="text-sm font-black uppercase tracking-wider">
                {suggestionReason === "history" ? "🎯 Based on your travel history" : " Popular rides"}
              </p>
            </div>
            {suggestionsLoading ? (
              <div className="py-8 flex justify-center"><Spinner size="md" /></div>
            ) : suggestions.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-sm text-gray-400">No suggestions yet — search for your first ride!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {suggestions.map((ride, i) => (
                  <div key={ride._id} className="animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                    <RideCard ride={ride} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search Results */}
        {!searched ? (
          !user && (
            <div className="card text-center py-16 animate-fade-up">
              <div className="flex justify-center mb-4"><SearchIllustration size={80} /></div>
              <p className="font-black text-lg">FIND YOUR RIDE</p>
              <p className="text-sm text-gray-500 mt-1">Search by source and destination above</p>
            </div>
          )
        ) : loading ? (
          <div className="py-20"><Spinner size="lg" /></div>
        ) : rides.length === 0 ? (
          <div className="card text-center py-16 animate-fade-up">
            <div className="flex justify-center mb-4"><SearchIllustration size={80} /></div>
            <p className="font-black text-lg">NO RIDES FOUND</p>
            <p className="text-sm text-gray-500 mt-1">Try changing your search filters or check back later</p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 animate-fade-up">
              {total} ride{total !== 1 ? "s" : ""} available
            </p>
            <div className="space-y-4">
              {rides.map((ride, i) => (
                <div key={ride._id} className="animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <RideCard ride={ride} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchRides;