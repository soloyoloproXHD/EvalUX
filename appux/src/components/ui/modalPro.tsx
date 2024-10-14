'use client';
import React, { useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { faCashRegister } from '@fortawesome/free-solid-svg-icons';
import { Divider } from "@nextui-org/divider";
import Image from "next/image";
import { useTheme } from 'next-themes';
import Logo from '../../../public/img/Logo.png';
import LogoW from '../../../public/img/Logo.png';
import AdaptButton from "../AdaptButton";

interface ModalProps {
  show: boolean;
  onClose: () => void;
}

export default function ModalPremium({ show, onClose }: ModalProps) {
  const { isOpen, onOpen, onClose: closeModal } = useDisclosure();
  const { theme } = useTheme();

  useEffect(() => {
    if (show) {
      onOpen();
    } else {
      closeModal();
    }
  }, [show, onOpen, closeModal]);

  const handleCloseModal = () => {
    closeModal();
    onClose();
  };

  return (
    <>
      <Modal size="xl" backdrop={"blur"} isOpen={isOpen} onClose={handleCloseModal}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="grid grid-cols-1 grid-rows-1 gap-5">
                <div>
                  <div className="flex place-content-center items-center gap-2 mt-4 text-white">
                    <Image src={theme === 'dark' ? LogoW : Logo} alt="Logo" className='h-12 w-auto' />
                    <p className='text-2xl font-semibold'>EvalUX</p>
                  </div>
                </div>
                <div>
                  <p className="text-2xl text-center p-5">Actualizar a Premium</p>
                </div>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="flex justify-center items-center h-full">
                <div className="grid grid-cols-1 grid-rows-1 gap-5 max-w-xs">
                 Para continuar Actualice a Premium
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex-1 items-center place-content-center">
                <div className="flex place-content-center items-center">
                  <Divider className="max-w-14" />
                  <Divider className="max-w-14" />
                </div>
                <div className="flex place-content-center items-center p-5">
                  <AdaptButton icon={faCashRegister} texto="Actualizar a Premium" className="bg-green-900" />
                </div>
              </div>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
