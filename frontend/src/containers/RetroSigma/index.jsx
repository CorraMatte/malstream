import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {Button, ButtonToolbar} from 'reactstrap';
import {useForm} from "react-hook-form";
import toast from "react-hot-toast";
import classNames from "classnames";
import PropTypes from "prop-types";
import StepBackwardIcon from "mdi-react/StepBackwardIcon";
import ControlledMonacoYaraEditor from "../../shared/components/form/ControlledMonacoYaraEditor";
import {getErrorMessageFromResponse} from "../../shared/helpers";
import ThemeModal from "../../shared/components/ThemeModal";
import {useSubmitRetroSigmaTask} from "../../mutations/SubmitRetroSigmaTask";
import RetroSigmaTasksTable from "./components/RetroSigmaTasksTable";


const RetroSigmaTaskUploadModal = ({rule}) => {
  const [showModal, setShowModal] = useState(false);
  const {handleSubmit, formState: {errors}, control} = useForm(
    {defaultValues: {sigma: rule.body}}
  );
  const mutation = useSubmitRetroSigmaTask();
  const [results, setResults] = useState([]);
  const [isQueryDone, setIsQueryDone] = useState(false);
  const toggleModal = useCallback(() => setShowModal(!showModal), [setShowModal, showModal]);

  const onSubmit = (data) => {
    toast.loading('Validating and uploading Sigma rule');
    const p = {
      body: data.sigma
    };

    mutation.mutate(p)
  }

  useEffect(() => {
    if (!mutation.isIdle && !mutation.isLoading) {
      toast.dismiss();
      if (mutation.isSuccess) {
        toast.success(`Your task is finished`);
        setResults(mutation.data);
        setIsQueryDone(true);
      } else if (mutation.isError) {
        toast.error(getErrorMessageFromResponse(mutation));
      }
      mutation.reset();
    }
  }, [mutation.isIdle, mutation.isError, mutation.isLoading, mutation.error, mutation.isSuccess])

  return (
    <Fragment>
      <StepBackwardIcon
        size={24} style={{fill: '#ffffff'}}
        onClick={(e) => {
          e.stopPropagation();
          toggleModal();
        }}
        className={'border-hover-white mx-0 my-auto'}
      />

      <ThemeModal
        isOpen={showModal}
        toggle={toggleModal}
        className={'modal-dialog--header-xl modal-dialog--dark'}
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" type="button" onClick={toggleModal}/>
          <h4 className="text-modal modal__title">Submit task</h4>
        </div>

        {
          isQueryDone ?
            <div className="modal__body">
              <RetroSigmaTasksTable hashes={results.map(v => ({sha256: v}))}/>
            </div>
            :
            <Fragment>
              <div className="modal__body">
                <form className="form form--vertical">
                  <div className={classNames({'form__form-group': true, "form__form-group-error-validation": errors.sigma})}>
                    <span className="form__form-group-label">Sigma rule</span>
                    <div className="form__form-group-field">
                      <div className='form__form-group-input-wrap'>
                        <ControlledMonacoYaraEditor
                          name={'sigma'}
                          control={control}
                          rules={{required: 'The Sigma body is required'}}
                          readOnly
                          defaultValue={rule.body}
                        />
                        {
                          errors?.sigma && errors.sigma.message &&
                          <span className="form__form-group-error">{errors.sigma.message}</span>
                        }
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <ButtonToolbar className="modal__footer">
                <Button outline className="rounded" color={'success'} onClick={() => handleSubmit(onSubmit)()}>Submit</Button>
                <Button outline className="rounded" onClick={toggleModal}>Close</Button>
              </ButtonToolbar>
            </Fragment>
        }

      </ThemeModal>


    </Fragment>
  );
};


RetroSigmaTaskUploadModal.propTypes = {
  rule: PropTypes.object.isRequired
}

export default RetroSigmaTaskUploadModal;
