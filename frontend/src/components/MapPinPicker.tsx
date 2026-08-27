/** Cartographic Editorial: a precise, click-to-place Leaflet marker for merchant storefront locations. */
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.DivIcon({
  className: "",
  html: "<div style='display:grid;place-items:center;width:30px;height:30px;background:#102a31;border:3px solid #72d2c7;border-radius:50% 50% 50% 5px;transform:rotate(-45deg);box-shadow:0 3px 12px rgba(16,42,49,.35)'><span style='display:block;width:7px;height:7px;border-radius:999px;background:#fff'></span></div>",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

function LocationMarker({ position, setPosition }: { position: [number, number] | null, setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={markerIcon} />
  );
}

function RecenterMap({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

export function MapPinPicker({ position, onChange, className = "" }: { position: [number, number] | null, onChange: (pos: [number, number]) => void, className?: string }) {
  const defaultCenter: [number, number] = [40.7128, -74.006];

  return (
    <div className={`relative z-0 h-[320px] w-full overflow-hidden border border-border ${className}`}>
      <MapContainer 
        center={position || defaultCenter} 
        zoom={14} 
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        scrollWheelZoom={true}
      >
        <TileLayer 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap center={position} />
        <LocationMarker position={position} setPosition={onChange} />
      </MapContainer>
    </div>
  );
}
