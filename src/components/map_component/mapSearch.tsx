"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@heroui/react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { IoSearchOutline } from "react-icons/io5";

interface Props {
  center: google.maps.LatLngLiteral;
  panTo: (coords: google.maps.LatLngLiteral) => void;
  setMarker: (coords: google.maps.LatLngLiteral) => void;
  setAddress: (address: string) => void;
  setState: (state: string) => void;
}

let defaultZoom = 8;
let location_address: string = "Location";

const MapSearch = ({ center, panTo, setMarker, setAddress, setState }: Props) => {
  const [map, setMap] = useState({ lat: 9.082, lng: 8.6753 });
  const [zoom, setZoom] = useState(8);
  const [show, setShow] = useState(false);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: new google.maps.LatLng(center),
      radius: 100 * 1000,
    },
  });

  /** 🔹 Handle text input */
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setShow(e.target.value.trim() !== "");
  };

  /** 🔹 Handle place selection */
  const handleSelect = async (address: string) => {
    setValue(address);
    setShow(false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });

      // Extract state name from address components
      const components = results[0]?.address_components || [];
      const countryType = components[components.length - 1]?.types[0];
      const newState =
        countryType === "country"
          ? components[components.length - 2]?.long_name
          : components[components.length - 3]?.long_name;

      setState(newState);
      setAddress(address);
      setMarker({ lat, lng });
      setMap({ lat, lng });
      setZoom(9);
    } catch (error) {
      console.error("😱 Error selecting location:", error);
    }
  };

  /** 🔹 Update default zoom and address reference */
  useEffect(() => {
    center = map;
    defaultZoom = zoom;
    location_address = value || "Location";
  }, [map, zoom, value, center]);

  return (
    <div className="w-full mt-4 flex justify-center">
      <div className="relative bg-white rounded-full w-[70%] z-20 h-[45px] shadow-md">
        {/* 🔹 Search Input */}
        <div className="relative w-full h-[45px]">
          <Input
            startContent={
              <IoSearchOutline size={22} className="ml-1 text-[#5D70F9]" />
            }
            placeholder="Search your location"
            size="sm"
            value={value}
            onChange={handleInput}
            isDisabled={!ready}
            radius="full"
            classNames={{
              inputWrapper: "h-[45px] bg-white border border-gray-200",
              input: "text-sm",
            }}
          />
        </div>

        {/* 🔹 Suggestions Dropdown */}
        {show && (
          <div className="absolute w-full bg-white max-h-[250px] overflow-y-auto z-20 px-4 flex flex-col items-start py-2 rounded-md mt-2 shadow-md">
            {status !== "OK" && (
              <button
                type="button"
                className="w-full text-center py-2 text-gray-500"
              >
                Loading...
              </button>
            )}
            {status === "OK" &&
              data.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(item.description)}
                  className="w-full text-left py-2 text-gray-800 hover:bg-gray-100 rounded-md"
                >
                  {item.description.length > 50
                    ? item.description.substring(0, 50) + "..."
                    : item.description}
                </button>
              ))}
          </div>
        )}

        {/* 🔹 Overlay (for closing dropdown when clicking outside) */}
        {show && (
          <div
            onClick={() => setValue("")}
            className="fixed inset-0 bg-black opacity-30 z-10"
          />
        )}
      </div>
    </div>
  );
};

export default MapSearch;
