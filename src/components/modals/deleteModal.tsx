import { IoTrashBinOutline } from "react-icons/io5";
import { CustomButton } from "../custom";
import { ModalLayout } from "../shared";
import useBusiness from "@/hooks/useBusiness";
import useEditUser from "@/hooks/useEditUser";

export default function DeleteModal({
  isOpen,
  onClose,
  type,
  id,
  name,
}: {
  isOpen: boolean;
  onClose: (by: boolean) => void;
  type: "Store" | "Service" | "Address" | "Bookmark";
  id: string;
  name: string;
}) {

  const {
    productDeleteMutation,
    servicesDeleteMutation,
    bookmarkdeleteMutation
  } = useBusiness({});

  const {
    deleteAddressMutation
  } = useEditUser()

  const currentMutation =
    type === "Store" ? productDeleteMutation : type === "Address" ? deleteAddressMutation : type === "Bookmark" ? bookmarkdeleteMutation : servicesDeleteMutation;

  const clickHandler = () => {
    currentMutation.mutate(id, {
      onSuccess: () => onClose(false),
    });
  };

  const loading = currentMutation.isPending;

  return (
    <ModalLayout size="sm" isOpen={isOpen} onClose={() => onClose(false)}>
      <div className="flex flex-col gap-4 w-full">
        <div className="w-full flex flex-col gap-2 items-center">
          <div className="w-20 h-20 rounded-full border-8 bg-red-300 border-red-100 flex justify-center items-center">
            <IoTrashBinOutline size={30} className="text-red-600" />
          </div>

          <p className="text-2xl font-bold">Delete {type}</p>

          <p className="text-xs font-medium text-center text-secondary">
            Deleting this {type} named <span className=" font-bold text-brand " >{name}</span> will permanently delete it. This action cannot be undone, so make sure you're certain before proceeding.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <CustomButton
            onClick={clickHandler}
            isLoading={loading}
            variant="customDanger"
          >
            Delete {type}
          </CustomButton>

          <CustomButton onClick={() => onClose(false)} variant="outline">
            Cancel
          </CustomButton>
        </div>
      </div>
    </ModalLayout>
  );
}
