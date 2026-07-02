"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Button, Card } from "@heroui/react";

import MapSearch from "./mapSearch";
import LoadingLayout from "../shared/loadingLayout";

const LIBRARIES: ("places")[] = ["places"];

const DEFAULT_CENTER: google.maps.LatLngLiteral = {
    lat: 9.082,
    lng: 8.6753,
};

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
    const [center, setCenter] =
        useState<google.maps.LatLngLiteral>(DEFAULT_CENTER);

    const [myLocation, setMyLocation] =
        useState<google.maps.LatLngLiteral | null>(null);

    const mapRef = useRef<google.maps.Map | null>(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey:
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ??
            "AIzaSyCk55j_rxvh2Xwau4ifeyzl2uSv4W6nbw0",
        libraries: LIBRARIES,
    });

    const panTo = useCallback(
        (location: google.maps.LatLngLiteral) => {
            mapRef.current?.panTo(location);
            mapRef.current?.setZoom(14);
        },
        []
    );

    const extractAddressData = useCallback(
        (components: google.maps.GeocoderAddressComponent[]) => {
            const getValue = (type: string) =>
                components.find((item) => item.types.includes(type))
                    ?.long_name ?? "";

            return {
                country: getValue("country"),
                state: getValue("administrative_area_level_1"),
                city:
                    getValue("locality") ||
                    getValue("administrative_area_level_2"),
            };
        },
        []
    );

    const reverseGeocode = useCallback(
        (location: google.maps.LatLngLiteral) => {
            if (!window.google) return;

            const geocoder = new window.google.maps.Geocoder();

            geocoder.geocode({ location }, (results, status) => {
                if (status !== "OK" || !results?.[0]) return;

                const result = results[0];

                const { country, state, city } = extractAddressData(
                    result.address_components
                );

                setAddress?.(result.formatted_address);
                setState?.(state);

                if (other) {
                    setOtherAddress?.({
                        country,
                        state,
                        city,
                    });
                }
            });
        },
        [
            extractAddressData,
            other,
            setAddress,
            setState,
            setOtherAddress,
        ]
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

    useEffect(() => {
        if (latlng) {
            setCenter(latlng);
            setMarker?.(latlng);
        }

        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const location = {
                    lat: coords.latitude,
                    lng: coords.longitude,
                };

                setMyLocation(location);

                if (!latlng) {
                    setCenter(location);
                    setMyLocat?.(location);
                }
            },
            () => setCenter(DEFAULT_CENTER),
            {
                enableHighAccuracy: true,
            }
        );
    }, [latlng, setMarker, setMyLocat]);

    useEffect(() => {
        if (outclick && marker) {
            panTo(marker);
        }
    }, [outclick, marker, panTo]);

    if (loadError) {
        return (
            <div className="p-4 text-center text-red-500">
                Failed to load Google Maps
            </div>
        );
    }

    return (
        <Card
            className="relative w-full overflow-hidden rounded-3xl bg-white"
            style={{ height }}
        >
            <LoadingLayout loading={!isLoaded}>
                {isLoaded && (
                    <GoogleMap
                        mapContainerStyle={{
                            width: "100%",
                            height,
                        }}
                        center={outclick ? latlng : center}
                        zoom={zoom}
                        options={{
                            disableDefaultUI: true,
                        }}
                        onLoad={(map) => {
                            mapRef.current = map;
                        }}
                        onUnmount={() => {
                            mapRef.current = null;
                        }}
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

                        {myLocation && (
                            <Marker
                                position={myLocation}
                                onClick={selectMyLocation}
                                icon={{
                                    path: google.maps.SymbolPath.CIRCLE,
                                    scale: 8,
                                    fillColor: "#1A73E8",
                                    fillOpacity: 1,
                                    strokeColor: "#FFFFFF",
                                    strokeWeight: 2,
                                }}
                            />
                        )}
                    </GoogleMap>
                )}
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
                ) : (
                    !view &&
                    setOpen && (
                        <Button
                            className="h-[40px] w-[80px] rounded-full text-[14px]"
                            onPress={() => setOpen(false)}
                        >
                            Done
                        </Button>
                    )
                )}
            </div>
        </Card>
    );
}