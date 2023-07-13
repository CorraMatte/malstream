import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {Button, ButtonToolbar} from 'reactstrap';
import ThemeModal from "../../../shared/components/ThemeModal";
import PropTypes from "prop-types";
import StepBackwardIcon from "mdi-react/StepBackwardIcon";
import RetroHuntTasksPaginatedTable from "../../../shared/components/retrohunt/RetroHuntTasksPaginatedTable";
import {useRetroHuntTasks} from "../../../queries/RetroHunt";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import ErrorHandler from "../../../shared/components/ErrorHandler";
import toast from "react-hot-toast";
import {getErrorMessageFromResponse} from "../../../shared/helpers";
import {useResubmitRetroHuntTask} from "../../../mutations/ResubmitRetroHuntTask";
import {useHistory} from "react-router-dom";
import paths from "../../../config/paths";


const RetroHuntTaskModal = ({task_id, ruleId}) => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = useCallback(() => setShowModal(!showModal), [setShowModal, showModal]);
  const mutation = useResubmitRetroHuntTask();
  const history= useHistory();
  const { data, isIdle, isLoading, isError, error } = useRetroHuntTasks(task_id);

  const onSubmit = () => {
    toast.loading('Validating and uploading Yara rule');
    const p = {
      ruleId: ruleId,
    };

    mutation.mutate(p)
  }

  useEffect(() => {
    if (!mutation.isIdle && !mutation.isLoading) {
      toast.dismiss();
      if (mutation.isSuccess) {
        toast.success(`Your task has been uploaded`);
        setTimeout(() => history.push(paths.retroHuntPath), 1000);
        toggleModal();
      } else if (mutation.isError) {
        toast.error(getErrorMessageFromResponse(mutation));
      }
      mutation.reset();
    }
  }, [mutation.isIdle, mutation.isError, mutation.isLoading, mutation.error, mutation.isSuccess])

  return (
    <Fragment>
      <StepBackwardIcon
        size={24} style={{fill: 'green'}}
        onClick={(e) => {
          e.stopPropagation();
          toggleModal();
        }}
        className={'border-hover-green mx-0 my-auto'}
      />

      <ThemeModal
        isOpen={showModal}
        toggle={toggleModal}
        className={'modal-dialog--header-xl modal-dialog--dark'}
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" type="button" onClick={toggleModal}/>
          <h4 className="text-modal modal__title">RetroHunt results
            {(data?.status === 'processing') && '(not completed)'}
          </h4>
        </div>

        {
          isLoading || isIdle ? <LoadingSpinner />:
            isError ? <ErrorHandler error={error} /> :
              <div className="modal__body">
                <RetroHuntTasksPaginatedTable task_id={task_id} task_files_matched={data.files_matched} />
              </div>
        }

        <ButtonToolbar className="modal__footer">
          <Button outline className="rounded" color={'success'} onClick={onSubmit}>Submit again</Button>
          <Button outline className="rounded" onClick={toggleModal}>Close</Button>
        </ButtonToolbar>
      </ThemeModal>
    </Fragment>
  );
};


RetroHuntTaskModal.propTypes = {
  task_id: PropTypes.string.isRequired
}

export default RetroHuntTaskModal;
