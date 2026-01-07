"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Button, Card } from "@heroui/react";
import MapSearch from "./mapSearch";
import LoadingLayout from "../shared/loadingLayout";

// ---------------- STATIC LIBRARIES (for stable useLoadScript) ----------------
const LIBRARIES: ("places")[] = ["places"];

interface Props {
  hidesearch?: boolean;
  height?: string;
  view?: boolean;
  latlng?: google.maps.LatLngLiteral;
  other?: boolean;
  zoom?: number;
  outclick?: boolean;
  handleSubmit?: () => void;
  setOtherAddress?: (data: { country: string; state: string; city: string }) => void;
  setMyLocat?: (location: google.maps.LatLngLiteral) => void;
  marker?: google.maps.LatLngLiteral | null;
  setMarker?: (marker: google.maps.LatLngLiteral) => void;
  setAddress?: (address: string) => void;
  setState?: (state: string) => void;
  setOpen?: (state: boolean) => void;
}

const DEFAULT_CENTER = { lat: 9.082, lng: 8.6753 };

const MapView: React.FC<Props> = ({
  hidesearch = false,
  height = "47vh",
  latlng,
  outclick,
  other,
  setOtherAddress,
  zoom = 14,
  view = false,
  setMyLocat,
  marker,
  handleSubmit,
  setMarker,
  setAddress,
  setState,
  setOpen,
}) => {
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(DEFAULT_CENTER);
  const [myLocation, setMyLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [scale, setScale] = useState(8); // for pulsing animation

  const mapRef = useRef<google.maps.Map | null>(null);

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string ?? "AIzaSyCk55j_rxvh2Xwau4ifeyzl2uSv4W6nbw0"

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries: LIBRARIES,
  });

  // ---------------- HELPERS ----------------

  const panTo = useCallback((loc: google.maps.LatLngLiteral) => {
    mapRef.current?.panTo(loc);
    mapRef.current?.setZoom(14);
  }, []);

  const extractAddressData = useCallback(
    (components: google.maps.GeocoderAddressComponent[]) => {
      const get = (type: string) =>
        components.find((c) => c.types.includes(type))?.long_name || "";

      return {
        country: get("country"),
        state: get("administrative_area_level_1"),
        city: get("locality") || get("administrative_area_level_2"),
      };
    },
    []
  );

  // const parseLatLng = useCallback((value?: string): google.maps.LatLngLiteral | null => {
  //   if (!value) return null;
  //   const cleaned = value.replace(",", " ").trim();
  //   const [lat, lng] = cleaned.split(/\s+/).map(Number);
  //   if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  //   return { lat, lng };
  // }, []);

  // ---------------- MAP CLICK ----------------

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (hidesearch || !e.latLng || !window.google) return;

      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const loc = { lat, lng };
      setMarker?.(loc);

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: loc }, (results, status) => {
        if (status !== "OK" || !results?.[0]) return;

        const { formatted_address, address_components } = results[0];
        const { country, state, city } = extractAddressData(address_components);

        setAddress?.(formatted_address);
        setState?.(state);

        if (other) {
          setOtherAddress?.({ country, state, city });
        }
      });
    },
    [hidesearch, other, extractAddressData, setMarker, setAddress, setState, setOtherAddress]
  );

  // ---------------- INITIAL LOCATION ----------------

  console.log(center);
  console.log(latlng);
  

  useEffect(() => {

    if (latlng?.lat) {
      setCenter(latlng);
      setMarker?.(latlng);
    }

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const loc = { lat: coords.latitude, lng: coords.longitude };

        if (!latlng?.lat) {
          setMyLocat?.(loc);
          setCenter(loc);
        }
        setMyLocation(loc);
      },
      () => setCenter(DEFAULT_CENTER),
      { enableHighAccuracy: true }
    );
  }, []);

  // ---------------- EXTERNAL PAN ----------------

  useEffect(() => {
    if (outclick && marker) panTo(marker);
  }, [outclick, marker, panTo]);

  // ---------------- PULSING ANIMATION ----------------

  // useEffect(() => {
  //   if (!myLocation) return;
  //   let growing = true;
  //   const interval = setInterval(() => {
  //     setScale((prev) => {
  //       if (prev >= 12) growing = false;
  //       if (prev <= 8) growing = true;
  //       return growing ? prev + 0.5 : prev - 0.5;
  //     });
  //   }, 100);
  //   return () => clearInterval(interval);
  // }, [myLocation]);

  // ---------------- SELECT MY LOCATION ----------------

  const selectMyLocation = useCallback(() => {
    if (!myLocation || !window.google) return;
    setMarker?.(myLocation);
    panTo(myLocation);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: myLocation }, (results, status) => {
      if (status !== "OK" || !results?.[0]) return;
      const { formatted_address, address_components } = results[0];
      const { country, state, city } = extractAddressData(address_components);

      setAddress?.(formatted_address);
      setState?.(state);

      if (other) {
        setOtherAddress?.({ country, state, city });
      }
    });
  }, [myLocation, panTo, extractAddressData, setMarker, setAddress, setState, setOtherAddress, other]);

  // ---------------- UI ----------------

  if (loadError) {
    return <div className="p-4 text-center text-red-500">Failed to load Google Maps</div>;
  }

  return (
    <Card className="relative w-full rounded-3xl overflow-hidden bg-white" style={{ height }}>
      <LoadingLayout loading={!isLoaded}>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height }}
            center={outclick ? latlng : center}
            zoom={zoom}
            options={{ disableDefaultUI: true }}
            onLoad={(map) => { mapRef.current = map; }}
            onClick={onMapClick}
          >
            {!hidesearch && (
              <MapSearch
                setState={setState!}
                setMarker={setMarker!}
                setAddress={setAddress!}
                center={center}
                panTo={panTo}
              />
            )}

            {/* Selected location */}
            {marker && <Marker position={marker} />}

            {/* User location with pulsing animation */}
            {myLocation && (
              <Marker
                position={myLocation}
                onClick={selectMyLocation}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: scale,
                  fillColor: "#1A73E8",
                  fillOpacity: 1,
                  strokeColor: "#ffffff",
                  strokeWeight: 2,
                }}
              />
            )}
          </GoogleMap>
        )}
      </LoadingLayout>

      <div className="absolute bottom-3 right-3 flex gap-2">
        {/* Button to select my location */}
        {(!outclick) && (
          <Button className="rounded-full px-4 h-[40px] text-[14px]" onPress={selectMyLocation}>
            Use my location
          </Button>
        )}

        {/* Save / Done buttons */}
        {other ? (
          <Button className="rounded-full w-[80px] h-[40px] text-[14px]" onPress={handleSubmit}>
            Save
          </Button>
        ) : (
          !view &&
          setOpen && (
            <Button className="rounded-full w-[80px] h-[40px] text-[14px]" onPress={() => setOpen(false)}>
              Done
            </Button>
          )
        )}
      </div>
    </Card>
  );
};

export default MapView;
