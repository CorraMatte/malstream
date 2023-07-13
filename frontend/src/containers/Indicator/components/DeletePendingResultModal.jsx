import React, {Fragment, useCallback, useEffect, useState} from "react";
import {Button, ButtonToolbar} from "reactstrap";
import toast from "react-hot-toast";
import {getErrorMessageFromResponse} from "../../../shared/helpers";
import {useDeletePendingResult} from "../../../mutations/DeletePendingResult";
import ThemeModal from "../../../shared/components/ThemeModal";


const DeletePendingResultModal = () => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = useCallback(() => setShowModal(!showModal), [setShowModal, showModal]);
  const mutation = useDeletePendingResult();

  useEffect(() => {
    if (!mutation.isIdle && !mutation.isLoading) {
      toast.dismiss();
      if (mutation.isSuccess) {
        toast.success(`Pending results`);
      } else if (mutation.isError) {
        toast.error(getErrorMessageFromResponse(mutation));
      }
      mutation.reset();
    }
  }, [mutation.isIdle, mutation.isError, mutation.isLoading, mutation.error, mutation.isSuccess])

  return (
    <Fragment>
      <Button
        outline
        color={'danger'}
        className={'result_menu-button'}
        onClick={toggleModal}
      >
        DELETE PENDING TASKS
      </Button>
      <ThemeModal
        isOpen={showModal}
        toggle={toggleModal}
        className={'modal-dialog modal-dialog--dark'}
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" type="button" onClick={(e) => {
            toggleModal();
          }}/>
          <h4 className="text-modal modal__title">Delete all pending tasks</h4>

          <ButtonToolbar className="modal__footer">
            <Button outline className="rounded" color='danger' onClick={
              () => {
                mutation.mutate();
                toast.loading(`Deleting all pending results`);
                toggleModal();
              }}>Delete</Button>
            <Button outline className="rounded" onClick={toggleModal}>Cancel</Button>
          </ButtonToolbar>
        </div>
      </ThemeModal>
    </Fragment>
  )
}


DeletePendingResultModal.propTypes = {
}

export default DeletePendingResultModal;
