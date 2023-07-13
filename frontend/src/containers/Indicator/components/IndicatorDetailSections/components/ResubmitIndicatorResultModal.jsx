import PropTypes from "prop-types";
import React, {Fragment, useCallback, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import toast from "react-hot-toast";
import paths from "../../../../../config/paths";
import {getErrorMessageFromResponse} from "../../../../../shared/helpers";
import {Button, ButtonToolbar} from "reactstrap";
import ThemeModal from "../../../../../shared/components/ThemeModal";
import {useResubmitResult} from "../../../../../mutations/ResubmitResult";


const ResubmitIndicatorResultModal = ({sha256}) => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = useCallback(() => setShowModal(!showModal), [setShowModal, showModal]);
  const mutation = useResubmitResult();
  const history = useHistory();

  useEffect(() => {
    if (!mutation.isIdle && !mutation.isLoading) {
      toast.dismiss();
      if (mutation.isSuccess) {
        toast.success(`${sha256} resubmitted`);
        history.push(paths.resultPath);
      } else if (mutation.isError) {
        toast.error(getErrorMessageFromResponse(mutation));
      }
      mutation.reset();
    }
  }, [mutation.isIdle, mutation.isError, mutation.isLoading, mutation.error, mutation.isSuccess])

  return (
    <Fragment>
      <Button outline className={'mb-0 p-1 mx-1'} color={'warning'} onClick={toggleModal}>
        Resubmit file
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
          <h4 className="text-modal modal__title">Resubmit file</h4>

          <h4 className={'text-break'}>{sha256}</h4><br />

          <h4>The current result will be lost</h4>
          <ButtonToolbar className="modal__footer">
            <Button outline className="rounded" color='warning' onClick={
              () => {
                mutation.mutate(sha256);
                toast.loading(`Resubmitting ${sha256}`);
                toggleModal();
              }}>Resubmit</Button>
            <Button outline className="rounded" onClick={toggleModal}>Cancel</Button>
          </ButtonToolbar>
        </div>
      </ThemeModal>
    </Fragment>
  )


}


ResubmitIndicatorResultModal.propTypes = {
  sha256: PropTypes.string.isRequired
}


export default ResubmitIndicatorResultModal;
