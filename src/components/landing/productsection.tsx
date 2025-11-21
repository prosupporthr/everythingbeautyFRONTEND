import { BusinessList, ProductList } from "../product";

export default function ProductSection() {
    return (
        <div className=" w-full flex flex-col py-6 gap-10  " >
            <p className=" text-xl lg:text-4xl font-bold " >Find services and Product in your location that suits your needs</p>
            <BusinessList title="Services Available" />
            <ProductList title="Products Available" /> 
        </div>
    )
}