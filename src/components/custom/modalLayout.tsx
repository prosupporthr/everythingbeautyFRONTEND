"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter, 
} from "@heroui/react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function CustomModal({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
  footer,
}: CustomModalProps) {
  return (
    <Modal isOpen={isOpen} placement="center" size={size} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            {title && (
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            )}
            <ModalBody className={` ${!title ? "pt-6" : "pt-0"} max-h-[80vh] overflow-y-auto `} >{children}</ModalBody>
            <ModalFooter>
              {footer && (
                footer
              )
                //   : (
                //     <>
                //       <Button color="danger" variant="light" onPress={onClose}>
                //         Close
                //       </Button>
                //       <Button color="primary" onPress={onClose}>
                //         Action
                //       </Button>
                //     </>
                //   )
              }
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
