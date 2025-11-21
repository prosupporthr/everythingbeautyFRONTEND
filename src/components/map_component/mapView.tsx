"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { Button, Card } from "@heroui/react";
import MapSearch from "./mapSearch";
import LoadingLayout from "../shared/loadingLayout";

interface Props {
  hidesearch?: boolean;
  height?: string;
  view?: boolean;
  latlng?: string;
  zoom?: number;
  outclick?: boolean;
  setMyLocat?: (location: google.maps.LatLngLiteral) => void;
  marker?: google.maps.LatLngLiteral | null;
  setMarker?: (marker: google.maps.LatLngLiteral) => void;
  setAddress?: (address: string) => void;
  setState?: (state: string) => void;
  setOpen?: (state: boolean) => void;
}

const MapView: React.FC<Props> = ({
  hidesearch = false,
  height = "47vh",
  latlng,
  outclick,
  zoom = 14,
  view = false,
  setMyLocat,
  marker,
  setMarker,
  setAddress,
  setState,
  setOpen,
}) => {
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);

  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 9.082, // Default to Nigeria
    lng: 8.6753,
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: ["places"],
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }: google.maps.LatLngLiteral) => {
    mapRef.current?.panTo({ lat, lng });
    mapRef.current?.setZoom(14);
  }, []);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (hidesearch || !e.latLng) return;

      const geocoder = new google.maps.Geocoder();
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const address = results[0].formatted_address;
          const components = results[0].address_components;

          const countryIndex = components.length - 1;
          const newState =
            components[countryIndex]?.types[0] === "country"
              ? components[countryIndex - 1]?.long_name
              : components[countryIndex - 2]?.long_name;

          setState?.(newState || "");
          setAddress?.(address);
        } else {
          console.error("Error fetching address:", status);
        }
      });

      setMarker?.({ lat, lng });
    },
    [hidesearch, setAddress, setMarker, setState, marker]
  );

  // Handle latlng or geolocation
  useEffect(() => {
    if (latlng) {
      const [lat, lng] = latlng.split(" ").map(Number);
      const loc = { lat, lng };
      setCenter(loc);
      setMarker?.(loc);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(loc);
          if (hidesearch) setMyLocat?.(loc);
        },
        () => {
          setCenter({ lat: 9.082, lng: 8.6753 }); // fallback
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle external trigger click
  useEffect(() => {
    if (outclick && mapRef.current && marker) {
      panTo(marker);
    }
  }, [outclick, marker, panTo]);

  if (loadError) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load Google Maps.
      </div>
    );
  }

  return (
    <Card
      className="relative w-full rounded-3xl overflow-hidden bg-white"
      style={{ height }}
    >
      <LoadingLayout loading={!isLoaded}>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height,
              borderBottomLeftRadius: "16px",
              borderBottomRightRadius: "16px",
            }}
            center={center}
            zoom={zoom}
            options={{
              disableDefaultUI: true,
              zoomControl: !zoom,
            }}
            onLoad={onMapLoad}
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

            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}

            {marker && <Marker position={marker} />}
          </GoogleMap>
        )}
      </LoadingLayout>

      {!view && setOpen && (
        <div className="absolute bottom-3 right-3">
          <Button
            className="rounded-full w-[80px] h-[40px] text-[14px]"
            onPress={() => setOpen(false)}
          >
            Done
          </Button>
        </div>
      )}
    </Card>
  );
};

export default MapView;
