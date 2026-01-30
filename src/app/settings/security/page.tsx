"use client";
import { CustomButton } from "@/components/custom";
import { InputOtp } from "@heroui/react";
import { useState } from "react";

export default function Security() {
    const [value, setValue] = useState("");

    return (
        <div className=" w-full flex flex-col lg:py-20 justify-center items-center  ">
            <div className=" max-w-[350px] w-full flex flex-col gap-6 ">
                <p className=" text-lg font-semibold text-center ">
                    Your 4-digit PIN is personal please don't Share
                </p>
                <div className=" w-full flex flex-col gap-4 ">
                    {/* OTP Input */}
                    <div className="w-full flex flex-col  gap-0.5">
                        <p className="text-sm text-gray-700 font-medium">
                            Current Pin
                        </p>
                        <div className=" w-full flex justify-center ">
                            <InputOtp
                                length={4}
                                value={value}
                                size="lg"
                                allowedKeys="^[a-zA-Z0-9]*$" // restricts to letters
                                onValueChange={setValue}
                            />
                        </div>
                    </div>
                    <div className="w-full flex flex-col  gap-0.5">
                        <p className="text-sm text-gray-700 font-medium">
                            New Pin
                        </p>
                        <div className=" w-full flex justify-center ">
                            <InputOtp
                                length={4}
                                value={value}
                                size="lg"
                                allowedKeys="^[a-zA-Z0-9]*$" // restricts to letters
                                onValueChange={setValue}
                            />
                        </div>
                    </div>
                    <div className="w-full flex flex-col  gap-0.5">
                        <p className="text-sm text-gray-700 font-medium">
                            Confirm Pin
                        </p>
                        <div className=" w-full flex justify-center ">
                            <InputOtp
                                length={4}
                                value={value}
                                size="lg"
                                allowedKeys="^[a-zA-Z0-9]*$" // restricts to letters
                                onValueChange={setValue}
                            />
                        </div>
                    </div>
                </div>
                <div className=" w-full flex-col flex gap-2 ">
                    <CustomButton fullWidth>Update Pin</CustomButton>
                    <p className=" text-sm text-secondary text-center ">
                        Forget Transactions Pin ?{" "}
                        <span className=" font-semibold ">Reset Now</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
