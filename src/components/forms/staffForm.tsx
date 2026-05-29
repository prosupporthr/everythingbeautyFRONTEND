import useBusiness from "@/hooks/useBusiness";
import { FormikProvider } from "formik";
import { ImagePicker } from "../shared";
import { CustomButton, CustomInput } from "../custom";
import { skill } from "@/helper/utils/databank";
import { useEffect } from "react";
import { URLS } from "@/helper/services/urls";
import { useFetchData } from "@/hooks/useFetchData";
import { IStaffDetail } from "@/helper/model/business";

interface IProps { 
    isOpen?: boolean;
    setIsOpen?: (by: boolean)=> void;
    id?: string; 
}

export default function StaffForm(
    { 
        id,
        setIsOpen, 
    } : IProps
) {
    const {
        formikStaff: formik,
        imageFile,
        isLoading,
        setImageFile, 
        staffMutation,
        staffEditMutation,
    } = useBusiness({
        staff: true,
        edit: id ? true : false,
        staffId: id
    }); 

    const { data } = useFetchData<IStaffDetail>({
        endpoint: URLS.STAFFBYID(id+""),
        name: ["staff", id+""],
        enable: id ? true : false
    });

    const handleSelect = (item: string) => { 
        if (formik.values.skills.includes(item)) {
            formik.setFieldValue(
                "skills",
                formik.values.skills.filter((skill: string) => skill !== item),
            );
            if(formik.values.primarySpeciality === item) {
                formik.setFieldValue("primarySpeciality", "");
            }
        } else {
            if(formik.values.skills.length === 0) {
                formik.setFieldValue("primarySpeciality", item);
            }
            formik.setFieldValue("skills", [...formik.values.skills, item]);
        }

        
    }; 

    useEffect(() => {
        if(staffMutation.isSuccess || staffEditMutation.isSuccess){
            setIsOpen?.(false)
        }
    }, [staffMutation.isSuccess, staffEditMutation.isSuccess]) 
    
    useEffect(()=> {
        if(!formik.values?.email && data?.name){
            formik.setValues(
                {
                    name: data?.name,
                    email: data?.email,
                    address: data?.address,
                    porfolioLink: data?.porfolioLink,
                    skills: data?.skills,
                    yearsOfExperience: data?.yearsOfExperience,
                    primarySpeciality: data?.primarySpeciality
                }
            )
        }
    }, [data])

    return (
        <FormikProvider value={formik}>
            <form
                onSubmit={formik.handleSubmit}
                className={` w-full flex h-full flex-col gap-6`}
            >
                <div className=" w-full flex flex-col ">
                    <p className=" text-2xl font-semibold ">Staff Details</p>
                    <p className=" text-sm ">
                        Please provide your professional background to help us
                        tailor your salon experience.
                    </p>
                </div>
                <div className=" w-full flex flex-col gap-4 items-start justify-start pb-6 ">
                    <div className=" w-fit ">
                        <ImagePicker
                            type="user" 
                            setImageFile={setImageFile}
                            imageFile={imageFile}
                        />
                    </div>
                    <div className=" w-full flex gap-4 ">
                        <CustomInput name="name" label="Full Name" />
                        <CustomInput name="email" label="Email Address" />
                    </div>
                    <div className=" w-full flex gap-4 ">
                        <CustomInput name="address" label="Home Address" />
                        <CustomInput
                            name="porfolioLink"
                            label="Portfolio Link (Optional)"
                        />
                    </div>
                    <div className=" w-full flex gap-4 ">
                        <CustomInput
                            name="primarySpeciality"
                            label="Primary Specialty"
                            disabled={true}
                        />
                        <CustomInput
                            name="yearsOfExperience"
                            label="Years of Experience"
                            type="number"
                        />
                    </div>
                    <div className=" w-full flex flex-col gap-1 ">
                        <p className=" text-sm font-semibold ">
                            Specialties & Skills
                        </p>
                        <div className=" w-full flex flex-wrap gap-3 ">
                            {skill.map((item, index) => {
                                return (
                                    <button
                                        type="button"
                                        key={index}
                                        onClick={() => handleSelect(item)}
                                        className={` ${formik.values.skills.includes(item) ? " bg-brand text-white " : " bg-transparent "} w-auto px-3 h-[34px] text-xs font-medium rounded-full border `}
                                    >
                                        {item}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className=" w-fit ml-auto mt-3 ">
                        <CustomButton isLoading={isLoading} type="submit" height="40px">
                            Submit
                        </CustomButton>
                    </div>
                </div>
            </form>
        </FormikProvider>
    );
}
