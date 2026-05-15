export interface IAddress {
    email: string;
    phone: string;
    state: string;
    city: string;
    street: string;
    name: string;
    country: string;
}

export interface IParcel {
    mass_unit: "g" | "kg" | "lb" | "oz";
    distance: "cm" | "in" | "ft" | "m" | "mm" | "yd";
    weight: number | string;
    height: number | string;
    length: number | string;
    width: number | string;
}

export interface IShipmentForm {
    address_from: IAddress; 
    parcels: IParcel[];
}

export const MASS_UNITS = [
    { label: "Grams (g)", value: "g" },
    { label: "Kilograms (kg)", value: "kg" },
    { label: "Pounds (lb)", value: "lb" },
    { label: "Ounces (oz)", value: "oz" },
];

export const DISTANCE_UNITS = [
    { label: "Centimeters (cm)", value: "cm" },
    { label: "Inches (in)", value: "in" },
    { label: "Feet (ft)", value: "ft" },
    { label: "Meters (m)", value: "m" },
    { label: "Millimeters (mm)", value: "mm" },
    { label: "Yards (yd)", value: "yd" },
];
