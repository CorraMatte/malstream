import React, {Fragment, useCallback, useState} from "react";
import PropTypes from "prop-types";
import {Button, ButtonToolbar} from "reactstrap";
import ThemeModal from "../../../shared/components/ThemeModal";
import DeleteOutlineIcon from "mdi-react/DeleteOutlineIcon";


const DeleteIconModal = ({onDelete, message, iconClass = ''}) => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = useCallback(() => setShowModal(!showModal), [setShowModal, showModal]);

  return (
    <Fragment>
      <DeleteOutlineIcon
        size={24}
        style={{fill: '#ffffff'}}
        id={`icon-delete`} onClick={(e) => {
        e.stopPropagation();
        toggleModal();
      }} className={`border-hover-white ${iconClass}`}/>
      <ThemeModal
        isOpen={showModal}
        toggle={toggleModal}
        className={'modal-dialog modal-dialog--dark'}
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" type="button" onClick={(e) => {
            toggleModal();
          }}/>
          <h4 className="text-modal modal__title">{message}</h4>
        </div>

        <ButtonToolbar className="modal__footer">
          <Button outline className="rounded" color='danger' onClick={() => {
            onDelete();
            toggleModal();
          }}>Delete</Button>
          <Button outline className="rounded" onClick={toggleModal}>Cancel</Button>
        </ButtonToolbar>
      </ThemeModal>
    </Fragment>
  )
}


DeleteIconModal.propTypes = {
  onDelete: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired
}

export default DeleteIconModal;
