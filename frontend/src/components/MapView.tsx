/** Cartographic Editorial: Leaflet pins mount the same catalog icon components used in the category rail. */
import { useEffect, useMemo, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCategoryMeta, type Shop } from "@/data/catalog";

const userIcon = new L.DivIcon({ className: "", html: "<div style='width:18px;height:18px;background:#0e7c78;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 10px rgba(16,42,49,.35)'></div>", iconSize: [18, 18], iconAnchor: [9, 9] });

function createCategoryIcon() {
  return new L.DivIcon({ className: "category-map-pin", html: "<span class='category-map-pin__icon'></span>", iconSize: [38, 38], iconAnchor: [19, 36] });
}

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom()); }, [center, map]);
  return null;
}

function CategoryMarker({ shop }: { shop: Shop }) {
  const markerRef = useRef<L.Marker>(null);
  const { Icon, color, tint, name } = getCategoryMeta(shop.category);
  const icon = useMemo(createCategoryIcon, []);

  useEffect(() => {
    const marker = markerRef.current;
    let iconRoot: Root | undefined;
    const mountIcon = () => {
      const host = marker?.getElement()?.querySelector(".category-map-pin__icon");
      if (!host || iconRoot) return;
      iconRoot = createRoot(host);
      iconRoot.render(<span title={`${name} marker`} aria-label={`${name} marker`} style={{ alignItems: "center", background: tint, border: `2px solid ${color}`, borderRadius: "50% 50% 50% 7px", boxShadow: "0 4px 13px rgba(16,42,49,.24)", color, display: "grid", height: 34, justifyItems: "center", transform: "rotate(-45deg)", width: 34 }}><Icon aria-hidden="true" size={16} strokeWidth={2.35} style={{ transform: "rotate(45deg)" }} /></span>);
    };
    marker?.on("add", mountIcon);
    mountIcon();
    return () => { marker?.off("add", mountIcon); iconRoot?.unmount(); };
  }, [Icon, color, name, tint]);

  return <Marker ref={markerRef} position={[shop.lat, shop.lng]} icon={icon}><Popup><div className="min-w-[180px] py-1"><div className="flex items-center gap-2"><Icon className="h-4 w-4" style={{ color }} /><strong>{shop.name}</strong></div><p className="mt-1 text-xs">{shop.category}{shop.isSample ? " · Sample listing" : ""}</p><Link to={`/shop/${shop.id}`} className="mt-2 inline-block text-xs font-bold text-teal-700 underline">Open listing →</Link></div></Popup></Marker>;
}

export function MapView({ center, shops, className = "" }: { center: [number, number]; shops: Shop[]; className?: string }) {
  return <div className={`overflow-hidden ${className}`}><MapContainer center={center} zoom={13} scrollWheelZoom style={{ height: "100%", width: "100%", minHeight: "420px" }}><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><RecenterMap center={center} /><Marker position={center} icon={userIcon}><Popup>Your current reference point</Popup></Marker>{shops.map((shop) => <CategoryMarker key={shop.id} shop={shop} />)}</MapContainer></div>;
}
