import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {Button, ButtonToolbar} from 'reactstrap';
import ThemeModal from "../../../shared/components/ThemeModal";
import {useForm} from "react-hook-form";
import ControlledSelectWithTitle from "../../../shared/components/form/ControlledSelectWithTitle";
import {useSubmitRetroHuntTask} from "../../../mutations/SubmitRetroHuntTask";
import {getErrorMessageFromResponse, upperCaseFirstLetter} from "../../../shared/helpers";
import toast from "react-hot-toast";
import classNames from "classnames";
import ControlledMonacoYaraEditor from "../../../shared/components/form/ControlledMonacoYaraEditor";
import PropTypes from "prop-types";
import StepBackwardIcon from "mdi-react/StepBackwardIcon";
import paths from "../../../config/paths";
import {useHistory} from "react-router-dom";


const RetroHuntTaskUploadModal = ({rule}) => {
  const [showModal, setShowModal] = useState(false);
  const {handleSubmit, formState: {errors}, control} = useForm(
    {defaultValues: {yara: rule.body}}
  );
  const mutation = useSubmitRetroHuntTask();
  const history= useHistory();
  const toggleModal = useCallback(() => setShowModal(!showModal), [setShowModal, showModal]);

  const priorityOptions = ['low', 'medium', 'high'].map((sev) => ({
    value: sev, label: upperCaseFirstLetter(sev)
  }));

  const onSubmit = (data) => {
    toast.loading('Validating and uploading Yara rule');
    const p = {
      ruleId: rule.id,
      data: {
        priority: data.priority.value,
        yara: data.yara
      }
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

        <div className="modal__body">
          <form className="form form--vertical">
            <ControlledSelectWithTitle
              name={'priority'} title={'Priority'} rules={{required: 'The priority is required'}}
              defaultValue={priorityOptions[0]} control={control} valueFn={(value) => value}
              options={priorityOptions}
            />

            <div className={classNames({'form__form-group': true, "form__form-group-error-validation": errors.yara})}>
              <span className="form__form-group-label">Yara rule</span>
              <div className="form__form-group-field">
                <div className='form__form-group-input-wrap'>
                  <ControlledMonacoYaraEditor
                    name={'yara'}
                    control={control}
                    rules={{required: 'The YARA body is required'}}
                    readOnly
                    defaultValue={rule.body}
                  />
                  {
                    errors?.yara && errors.yara.message &&
                    <span className="form__form-group-error">{errors.yara.message}</span>
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
      </ThemeModal>
    </Fragment>
  );
};


RetroHuntTaskUploadModal.propTypes = {
  rule: PropTypes.object.isRequired
}

export default RetroHuntTaskUploadModal;
