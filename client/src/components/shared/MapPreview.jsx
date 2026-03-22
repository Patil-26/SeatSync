import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons broken by webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const sourceIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const destIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Auto-fit map bounds when markers change
const FitBounds = ({ source, destination }) => {
  const map = useMap();
  useEffect(() => {
    if (source && destination) {
      const bounds = L.latLngBounds(
        [source.lat, source.lng],
        [destination.lat, destination.lng]
      );
      map.fitBounds(bounds, { padding: [40, 40] });
    } else if (source) {
      map.setView([source.lat, source.lng], 12);
    } else if (destination) {
      map.setView([destination.lat, destination.lng], 12);
    }
  }, [source, destination, map]);
  return null;
};

const MapPreview = ({ source, destination }) => {
  if (!source && !destination) return null;

  const center = source
    ? [source.lat, source.lng]
    : [destination.lat, destination.lng];

  return (
    <div
      className="w-full rounded overflow-hidden border-2 border-black"
      style={{ height: "280px", boxShadow: "3px 3px 0 #1a1a1a" }}
    >
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {source && (
          <Marker position={[source.lat, source.lng]} icon={sourceIcon}>
            <Popup>{source.name}</Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={[destination.lat, destination.lng]} icon={destIcon}>
            <Popup>{destination.name}</Popup>
          </Marker>
        )}
        <FitBounds source={source} destination={destination} />
      </MapContainer>
    </div>
  );
};

export default MapPreview;