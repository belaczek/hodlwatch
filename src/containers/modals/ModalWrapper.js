import React from "react";
import { Modal, ModalBackground, ModalContent, ModalClose } from "bloomer";
import { compose, pure } from "recompose";

/**
 * Higher-order component providing default wrapper for modal components
 */
const ModalWrapper = Component => ({ isActive, closeModal, ...props }) => (
  <Modal isActive={isActive}>
    <ModalBackground onClick={() => closeModal(false)} />
    <ModalContent>
      <Component {...props} isActive={isActive} toggleModal={closeModal} />
    </ModalContent>
    <ModalClose onClick={() => closeModal(false)} />
  </Modal>
);

export default compose(pure, ModalWrapper);
