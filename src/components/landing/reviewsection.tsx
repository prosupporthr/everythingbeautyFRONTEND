import { ReviewCard } from "../cards";

export default function ReviewSection(){
    return(
        <div className=" w-full flex flex-col gap-6 " >
            <p className=" text-3xl font-bold " >Reviews</p>
            <div className=" w-full overflow-x-auto " >
                <div className=" w-auto flex gap-4 " >
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard />
                </div>
            </div>
        </div>
    )
}