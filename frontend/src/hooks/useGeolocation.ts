import { useState, useEffect } from "react";
import { DEFAULT_CENTER } from "@/data/mockData";

interface GeolocationState {
  position: [number, number];
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    position: DEFAULT_CENTER,
    loading: true,
    error: null,
    permissionDenied: false,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, loading: false, error: "Geolocation not supported" }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          position: [pos.coords.latitude, pos.coords.longitude],
          loading: false,
          error: null,
          permissionDenied: false,
        });
      },
      (err) => {
        setState(s => ({
          ...s,
          loading: false,
          error: err.message,
          permissionDenied: err.code === err.PERMISSION_DENIED,
        }));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return state;
}
