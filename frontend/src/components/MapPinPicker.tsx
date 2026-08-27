/** Cartographic Editorial: a fixed center pin lets merchants choose storefront coordinates by moving the map beneath it. */
import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function CenterCoordinates({ onChange }: { onChange: (position: [number, number]) => void }) {
  const map = useMapEvents({
    moveend() {
      const center = map.getCenter();
      onChange([center.lat, center.lng]);
    },
  });
  return null;
}

function RecenterMap({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      const currentCenter = map.getCenter();
      const nextCenter = L.latLng(center[0], center[1]);
      if (currentCenter.distanceTo(nextCenter) > 3) {
        map.flyTo(nextCenter, Math.max(map.getZoom(), 15), { animate: true, duration: 0.7 });
      }
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
        <CenterCoordinates onChange={onChange} />
      </MapContainer>
      <div className="pointer-events-none absolute inset-0 z-[500]" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full drop-shadow-[0_3px_10px_rgba(16,42,49,0.4)]">
          <div className="grid h-8 w-8 place-items-center rounded-[50%_50%_50%_5px] border-[3px] border-[#72d2c7] bg-[#102a31] -rotate-45">
            <span className="h-2 w-2 rounded-full bg-white rotate-45" />
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#102a31]/35" />
      </div>
    </div>
  );
}
