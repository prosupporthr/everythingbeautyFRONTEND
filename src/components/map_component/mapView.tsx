"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Button, Card } from "@heroui/react";

import MapSearch from "./mapSearch";
import LoadingLayout from "../shared/loadingLayout";

// ─── Constants ────────────────────────────────────────────────────────────────

const LIBRARIES: ("places")[] = ["places"];

const DEFAULT_CENTER: google.maps.LatLngLiteral = {
    lat: 9.082,
    lng: 8.6753,
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
    hidesearch?: boolean;
    height?: string;
    view?: boolean;
    latlng?: google.maps.LatLngLiteral;
    other?: boolean;
    zoom?: number;
    outclick?: boolean;
    handleSubmit?: () => void;
    setOtherAddress?: (data: {
        country: string;
        state: string;
        city: string;
    }) => void;
    setMyLocat?: (location: google.maps.LatLngLiteral) => void;
    marker?: google.maps.LatLngLiteral | null;
    setMarker?: (marker: google.maps.LatLngLiteral) => void;
    setAddress?: (address: string) => void;
    setState?: (state: string) => void;
    setOpen?: (state: boolean) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MapView({
    hidesearch = false,
    height = "47vh",
    latlng,
    outclick = false,
    other = false,
    zoom = 14,
    view = false,
    marker,
    handleSubmit,
    setMarker,
    setAddress,
    setState,
    setOpen,
    setMyLocat,
    setOtherAddress,
}: Props) {
    const [center, setCenter] = useState<google.maps.LatLngLiteral>(DEFAULT_CENTER);
    const [myLocation, setMyLocation] = useState<google.maps.LatLngLiteral | null>(null);

    const mapRef = useRef<google.maps.Map | null>(null);

    // ── Stable ref copies of callbacks to avoid stale closures in geocoder ──
    const setAddressRef = useRef(setAddress);
    const setStateRef = useRef(setState);
    const setOtherAddressRef = useRef(setOtherAddress);

    useEffect(() => {
        setAddressRef.current = setAddress;
        setStateRef.current = setState;
        setOtherAddressRef.current = setOtherAddress;
    });

    const { isLoaded, loadError } = useLoadScript({
        // Never hardcode a fallback API key — fail visibly instead
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "",
        libraries: LIBRARIES,
    });

    const panTo = useCallback((location: google.maps.LatLngLiteral) => {
        mapRef.current?.panTo(location);
        mapRef.current?.setZoom(14);
    }, []);

    const extractAddressData = useCallback(
        (components: google.maps.GeocoderAddressComponent[]) => {
            const getValue = (type: string) =>
                components.find((c) => c.types.includes(type))?.long_name ?? "";

            return {
                country: getValue("country"),
                state: getValue("administrative_area_level_1"),
                city: getValue("locality") || getValue("administrative_area_level_2"),
            };
        },
        []
    );

    // Uses refs so it never needs to be recreated when callbacks change
    const reverseGeocode = useCallback(
        (location: google.maps.LatLngLiteral) => {
            if (!window.google) return;

            const geocoder = new window.google.maps.Geocoder();

            geocoder.geocode({ location }, (results, status) => {
                if (status !== "OK" || !results?.[0]) return;

                const result = results[0];
                const { country, state, city } = extractAddressData(result.address_components);

                setAddressRef.current?.(result.formatted_address);
                setStateRef.current?.(state);

                if (other) {
                    setOtherAddressRef.current?.({ country, state, city });
                }
            });
        },
        [extractAddressData, other]
    );

    const onMapClick = useCallback(
        (event: google.maps.MapMouseEvent) => {
            if (hidesearch || !event.latLng) return;

            const location = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            };

            setMarker?.(location);
            reverseGeocode(location);
        },
        [hidesearch, reverseGeocode, setMarker]
    );

    const selectMyLocation = useCallback(() => {
        if (!myLocation) return;

        setMarker?.(myLocation);
        panTo(myLocation);
        reverseGeocode(myLocation);
    }, [myLocation, panTo, reverseGeocode, setMarker]);

    // ── Initialise map center + geolocation ─────────────────────────────────
    useEffect(() => {
        if (latlng) {
            setCenter(latlng);
            setMarker?.(latlng);
        }

        if (!navigator.geolocation) return;

        const id = navigator.geolocation.watchPosition(
            ({ coords }) => {
                const location = { lat: coords.latitude, lng: coords.longitude };
                setMyLocation(location);

                if (!latlng) {
                    setCenter(location);
                    setMyLocat?.(location);
                }
            },
            () => setCenter(DEFAULT_CENTER),
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(id);

        // latlng intentionally excluded: we only want this to run on mount
        // to avoid resetting the map center on every render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Pan to external marker when outclick mode is on ──────────────────────
    useEffect(() => {
        if (outclick && marker) panTo(marker);
    }, [outclick, marker, panTo]);

    // ── Error state ───────────────────────────────────────────────────────────
    if (loadError) {
        return (
            <div className="p-4 text-center text-red-500">
                Failed to load Google Maps. Check your API key.
            </div>
        );
    }

    const showDoneButton = !view && !!setOpen;

    return (
        <Card
            className="relative w-full overflow-hidden rounded-3xl bg-white"
            style={{ height }}
        >
            <LoadingLayout loading={!isLoaded}>
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height }}
                    center={outclick ? latlng : center}
                    zoom={zoom}
                    options={{ disableDefaultUI: true }}
                    onLoad={(map) => { mapRef.current = map; }}
                    onUnmount={() => { mapRef.current = null; }}
                    onClick={onMapClick}
                >
                    {!hidesearch && (
                        <MapSearch
                            center={center}
                            panTo={panTo}
                            setMarker={setMarker!}
                            setAddress={setAddress!}
                            setState={setState!}
                        />
                    )}

                    {marker && <Marker position={marker} />}

                    {(isLoaded && myLocation) && (
                        <Marker
                            position={myLocation}
                            onClick={selectMyLocation}
                            icon={{
                                path: google?.maps?.SymbolPath?.CIRCLE,
                                scale: 8,
                                fillColor: "#1A73E8",
                                fillOpacity: 1,
                                strokeColor: "#FFFFFF",
                                strokeWeight: 2,
                            }}
                        />
                    )}
                </GoogleMap>
            </LoadingLayout>

            <div className="absolute right-3 bottom-3 flex gap-2">
                {!outclick && (
                    <Button
                        className="h-[40px] rounded-full px-4 text-[14px]"
                        onPress={selectMyLocation}
                    >
                        Use my location
                    </Button>
                )}

                {other ? (
                    <Button
                        className="h-[40px] w-[80px] rounded-full text-[14px]"
                        onPress={handleSubmit}
                    >
                        Save
                    </Button>
                ) : showDoneButton && (
                    <Button
                        className="h-[40px] w-[80px] rounded-full text-[14px]"
                        onPress={() => setOpen!(false)}
                    >
                        Done
                    </Button>
                )}
            </div>
        </Card>
    );
}