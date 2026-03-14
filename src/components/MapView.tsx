import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Shop } from "@/data/mockData";
import { Link } from "react-router-dom";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const shopIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const userIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:16px;height:16px;background:hsl(210,92%,52%);border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface MapViewProps {
  center: [number, number];
  shops: Shop[];
  className?: string;
}

export function MapView({ center, shops, className = "" }: MapViewProps) {
  return (
    <div className={`overflow-hidden rounded-lg border ${className}`}>
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", minHeight: "400px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap center={center} />
        <Marker position={center} icon={userIcon}>
          <Popup>Your location</Popup>
        </Marker>
        {shops.map(shop => (
          <Marker key={shop.id} position={[shop.lat, shop.lng]} icon={shopIcon}>
            <Popup>
              <div className="text-center">
                <strong>{shop.name}</strong>
                <br />
                <span className="text-xs">{shop.category}</span>
                <br />
                <Link to={`/shop/${shop.id}`} className="text-xs text-primary underline">
                  View Details →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
