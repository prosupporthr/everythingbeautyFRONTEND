"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/toast"

interface Props {
    latLng: string;
    setResult: (result: any) => void;
    myLocation: google.maps.LatLngLiteral;
}

function EventDirection({ latLng, setResult, myLocation }: Props) {

    const [show, setShow] = useState(false);
    const [origin, setOrigin] = useState<google.maps.LatLngLiteral | null>(null);
    const [destination, setDestination] = useState<google.maps.LatLngLiteral | null>(null);

    /** 🔹 Set origin (user’s current position) and destination */
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setOrigin({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                addToast({
                    title: "Location Error",
                    description: error.message,
                    color: "danger",
                })
            }
        );

        const [lat, lng] = latLng.split(" ").map(Number);
        setDestination({ lat, lng });
    }, [latLng]);

    /** 🔹 Calculate driving route */
    async function calculateRoute(originData: any, destinationData: any) {
        if (!originData?.lat || !destinationData?.lat) { 
            addToast({
                title: "Missing Data",
                description: "Could not determine origin or destination.",
                color: "danger",
            })
            return;
        }

        const directionsService = new google.maps.DirectionsService();

        directionsService.route(
            {
                origin: originData,
                destination: destinationData,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    setResult(result);
                    setShow((prev) => !prev);
                } else { 
                    addToast({
                        title: "Route Error",
                        description: "Directions request returned no results.",
                        color: "danger",
                    })
                    console.error(result);
                }
            }
        );
    }

    return (
        <Button
            onPress={() => calculateRoute(myLocation, destination)}
            color={show ? "danger" : "primary"}
            variant="flat"
            radius="lg"
        >
            {show ? "Hide Direction" : "Show Direction"}
        </Button>
    );
}

export default EventDirection;
