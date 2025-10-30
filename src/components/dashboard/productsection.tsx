import { ProductList } from "../product";

export default function ProductSection() {
    return (
        <div className=" w-full flex flex-col py-6 gap-10  " >
            <p className=" text-4xl font-bold " >Find services and Product in your location that suits your needs</p>
            <ProductList title="Product Available " />
            <ProductList title="Recommended " />
            <ProductList title="Recommended " />
        </div>
    )
}