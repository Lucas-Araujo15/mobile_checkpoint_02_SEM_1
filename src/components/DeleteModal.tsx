import { AlertDialog, Button, Center } from "native-base";
import { useRef } from "react";
import { useGlobalState } from "../hooks/GlobalState";

interface DeleteModalProps {
    isModalOpen: boolean
    handleModal: () => void;
    id: string;
}

export default function DeleteModal({handleModal, isModalOpen, id}: DeleteModalProps) {
    const { deleteTask } = useGlobalState()

    const cancelRef = useRef(null);
    return <Center>
        <AlertDialog leastDestructiveRef={cancelRef} isOpen={isModalOpen} onClose={handleModal}>
            <AlertDialog.Content color={'#000'}>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>Deletar tarefa</AlertDialog.Header>
                <AlertDialog.Body>
                    Essa ação irá deletar essa tarefa permanentemente! Tem certeza que deseja continuar?
                </AlertDialog.Body>
                <AlertDialog.Footer >
                    <Button.Group space={2}>
                        <Button variant="unstyled" colorScheme="coolGray" onPress={handleModal} ref={cancelRef}>
                            Cancelar
                        </Button>
                        <Button colorScheme="danger" onPress={() => deleteTask(id)}>
                            Deletar
                        </Button>
                    </Button.Group>
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog>
    </Center>;
}