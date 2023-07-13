import React, {Fragment, useCallback, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Button, ButtonToolbar} from "reactstrap";
import ThemeModal from "../../../../../shared/components/ThemeModal";
import {useDeleteResult} from "../../../../../mutations/DeleteResult";
import toast from "react-hot-toast";
import paths from "../../../../../config/paths";
import {getErrorMessageFromResponse} from "../../../../../shared/helpers";
import {useHistory} from "react-router-dom";


const DeleteResult = ({sha256}) => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = useCallback(() => setShowModal(!showModal), [setShowModal, showModal]);
  const mutation = useDeleteResult();
  const history = useHistory();

  useEffect(() => {
    if (!mutation.isIdle && !mutation.isLoading) {
      toast.dismiss();
      if (mutation.isSuccess) {
        toast.success(`${sha256} result deleted`);
        setTimeout(() => history.push(paths.resultPath), 1000);
      } else if (mutation.isError) {
        toast.error(getErrorMessageFromResponse(mutation));
      }
      mutation.reset();
    }
  }, [mutation.isIdle, mutation.isError, mutation.isLoading, mutation.error, mutation.isSuccess])

  return (
    <Fragment>
      <Button outline className={'mb-0 p-1 mr-1'} color={'danger'} onClick={toggleModal}>Delete
        result</Button>
      <ThemeModal
        isOpen={showModal}
        toggle={toggleModal}
        className={'modal-dialog modal-dialog--dark'}
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" type="button" onClick={(e) => {
            toggleModal();
          }}/>
          <h4 className="text-modal modal__title">Delete result related to</h4>
          <h4 className={'text-break'}>{sha256}</h4>

          <ButtonToolbar className="modal__footer">
            <Button outline className="rounded" color='danger' onClick={
              () => {
                mutation.mutate(sha256);
                toast.loading(`Deleting ${sha256}`);
                toggleModal();
              }}>Delete</Button>
            <Button outline className="rounded" onClick={toggleModal}>Cancel</Button>
          </ButtonToolbar>
        </div>
      </ThemeModal>
    </Fragment>
  )
}


DeleteResult.propTypes = {
  sha256: PropTypes.string.isRequired
}

export default DeleteResult;
