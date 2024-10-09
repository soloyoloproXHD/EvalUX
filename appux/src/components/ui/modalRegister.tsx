'use client';
import React, { useEffect } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";


interface ModalProps {
    show: boolean;
    onClose: () => void;
}

export default function AppModalR({show, onClose}: ModalProps) {
    const {isOpen,onOpen} = useDisclosure();

    useEffect(() => {
        if (!show) return;
        else if (show == true){
            onOpen();
        } else {
            onClose();
        }
    }, [show, onOpen, onClose]);

    const handleCloseModal = () => {
        onClose();
    };

    if (!show) return null;
    
    return (
      <>
        <Modal backdrop={"blur"} isOpen={isOpen} onClose={handleCloseModal}>
          <ModalContent>
              <>
                <ModalHeader className="flex flex-col gap-1">
                    <div className="grid grid-cols-2 grid-rows-2 gap-5">
                        <div >logo</div>
                        <div >
                            <p>Crear Cuenta</p>
                        </div>
                        <div >3</div>
                        <div >4</div>
                    </div>
                    
                </ModalHeader>
                <ModalBody>
                  
                </ModalBody>
                <ModalFooter>
                  <Button onClick={handleCloseModal} color="danger" variant="light" onPress={handleCloseModal}>
                    Close
                  </Button>
                  <Button onClick={handleCloseModal} color="primary" onPress={onClose}>
                    Action
                  </Button>
                </ModalFooter>
              </>
          </ModalContent>
        </Modal>
      </>
    );
  }