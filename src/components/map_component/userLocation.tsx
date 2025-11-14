"use client";

import React from "react";
import { MdMyLocation } from "react-icons/md";
import { Button } from "@heroui/react";

interface Props {
    panTo: (location: google.maps.LatLngLiteral) => void;
}

const UserLocation: React.FC<Props> = ({ panTo }) => {
    const handleClick = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                panTo({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            () => null
        );
    };

    return (
        <Button
            isIconOnly
            variant="flat"
            onPress={handleClick}
            className="
        absolute z-20 w-10 h-10 flex items-center justify-center 
        rounded-md bg-white shadow-md text-gray-800 hover:bg-gray-100
        transition-all duration-200
      "
            style={{
                marginLeft: "46.4vw",
                marginTop: "22.5vh",
            }}
        >
            <MdMyLocation size={23} />
        </Button>
    );
};

export default UserLocation;
