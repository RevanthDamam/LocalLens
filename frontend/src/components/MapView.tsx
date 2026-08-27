/** Cartographic Editorial: category icons provide immediate map-legibility for live and sample shop records. */
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCategoryMeta, type Shop } from "@/data/catalog";

const userIcon = new L.DivIcon({ className: "", html: "<div style='width:16px;height:16px;background:#0e7c78;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 10px rgba(16,42,49,.35)'></div>", iconSize: [16, 16], iconAnchor: [8, 8] });

function markerIcon(category: string) {
  const { color, tint, name, markerGlyph } = getCategoryMeta(category);
  return new L.DivIcon({
    className: "category-map-marker",
    html: `<div title="${name}" aria-label="${name} marker" style="display:grid;place-items:center;width:32px;height:32px;color:${color};background:${tint};border:2px solid ${color};border-radius:50% 50% 50% 5px;transform:rotate(-45deg);box-shadow:0 3px 12px rgba(16,42,49,.28)"><span style="font:700 18px/1 sans-serif;transform:rotate(45deg)">${markerGlyph}</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
}

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom()); }, [center, map]);
  return null;
}

export function MapView({ center, shops, className = "" }: { center: [number, number]; shops: Shop[]; className?: string }) {
  const markers = useMemo(() => shops.map((shop) => ({ shop, icon: markerIcon(shop.category) })), [shops]);
  return <div className={`overflow-hidden border border-border ${className}`}><MapContainer center={center} zoom={13} scrollWheelZoom style={{ height: "100%", width: "100%", minHeight: "420px" }}><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><RecenterMap center={center} /><Marker position={center} icon={userIcon}><Popup>Your current reference point</Popup></Marker>{markers.map(({ shop, icon }) => { const category = getCategoryMeta(shop.category); const Icon = category.Icon; return <Marker key={shop.id} position={[shop.lat, shop.lng]} icon={icon}><Popup><div className="min-w-[180px] py-1"><div className="flex items-center gap-2"><Icon className="h-4 w-4" style={{ color: category.color }} /><strong>{shop.name}</strong></div><p className="mt-1 text-xs">{shop.category}{shop.isSample ? " · Sample listing" : ""}</p><Link to={`/shop/${shop.id}`} className="mt-2 inline-block text-xs font-bold text-teal-700 underline">Open listing →</Link></div></Popup></Marker>; })}</MapContainer></div>;
}
