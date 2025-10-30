import { ProductCard } from "../cards"

export default function ProductList(
    { title } : { title: string }
) {

    return(
        <div className=" w-full flex flex-col gap-3 " >
            <div className=" w-full flex justify-between items-center " >
                <p className=" text-2xl font-semibold " >{title}</p>
                <p className=" text-brand font-bold " >See all</p>
            </div>
            <div className=" w-full grid grid-cols-4 gap-4 " >
                {[1, 2, 3, 4].map((item) => {
                    return(
                        <ProductCard key={item} />
                    )
                })}
            </div>
        </div>
    )
}