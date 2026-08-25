/** Cartographic Editorial: real Leaflet mapping with the current live shop set rendered as simple field markers. */
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Shop } from "@/data/mockData";
import { Link } from "react-router-dom";

const userIcon = new L.DivIcon({ className: "", html: "<div style='width:16px;height:16px;background:#0e7c78;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 10px rgba(16,42,49,.35)'></div>", iconSize: [16, 16], iconAnchor: [8, 8] });
const shopIcon = new L.DivIcon({ className: "", html: "<div style='width:27px;height:27px;background:#102a31;border:3px solid #72d2c7;border-radius:50% 50% 50% 5px;transform:rotate(-45deg);box-shadow:0 3px 12px rgba(16,42,49,.35)'><span style='display:block;width:7px;height:7px;margin:7px;border-radius:50%;background:#fff'></span></div>", iconSize: [27, 27], iconAnchor: [13, 27] });

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom()); }, [center, map]);
  return null;
}

export function MapView({ center, shops, className = "" }: { center: [number, number]; shops: Shop[]; className?: string }) {
  return <div className={`overflow-hidden border border-border ${className}`}><MapContainer center={center} zoom={13} scrollWheelZoom style={{ height: "100%", width: "100%", minHeight: "420px" }}><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><RecenterMap center={center} /><Marker position={center} icon={userIcon}><Popup>Your current reference point</Popup></Marker>{shops.map((shop) => <Marker key={shop.id} position={[shop.lat, shop.lng]} icon={shopIcon}><Popup><div className="min-w-[160px] py-1"><strong>{shop.name}</strong><p className="mt-1 text-xs">{shop.category}</p><Link to={`/shop/${shop.id}`} className="mt-2 inline-block text-xs font-bold text-teal-700 underline">Open listing →</Link></div></Popup></Marker>)}</MapContainer></div>;
}
