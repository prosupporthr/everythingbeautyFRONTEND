"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  children: React.ReactNode;
  footer?: React.ReactNode;
  showCloseIcon?: boolean; // ✅ NEW
}

export default function CustomModal({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
  showCloseIcon = true, // ✅ default visible
}: CustomModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      size={size}
      backdrop="blur"
      onClose={onClose}
      hideCloseButton={!showCloseIcon} // ✅ toggle close icon
    >
      <ModalContent>
        {() => (
          <>
            {title && (
              <ModalHeader className="flex flex-col gap-1 text-center">
                {title}
              </ModalHeader>
            )}

            <ModalBody
              className={`${!title ? "pt-6" : "pt-0"} max-h-[80vh] overflow-y-auto`}
            >
              {children}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
