import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {Button, ButtonToolbar, Col, Row} from 'reactstrap';
import ThemeModal from "../../../shared/components/ThemeModal";
import {useForm} from "react-hook-form";
import {useUploadFileMutation} from "../../../mutations/UploadFile";
import {useHistory} from "react-router-dom";
import toast from "react-hot-toast";
import _ from "lodash";
import paths from "../../../config/paths";
import {getErrorMessageFromResponse} from "../../../shared/helpers";
import ControlledFilepond from "../../../shared/components/form/ControlledFilepond";


const UploadFileModal = () => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = useCallback(() => setShowModal(!showModal), [setShowModal, showModal]);
  const {handleSubmit, control} = useForm();
  const mutation = useUploadFileMutation();
  const history = useHistory();


  const onSubmit = (data) => {
    const files = data.file;

    if (files && files.length > 0 && files[0] && files[0].fileSize > 0) {
      const formData = new FormData();
      formData.append('file', files[0].file, files[0].filename);
      mutation.mutate(formData);
    }
  }

  useEffect(() => {
    if (!mutation.isIdle) {
      if (mutation.isLoading) {
        toast.loading('Uploading file');
      } else {
        toast.dismiss();
        const sha256 = mutation.data?.file?.hash?.sha256

        if (mutation.isSuccess && !_.isUndefined(sha256 && !_.isNull(sha256))) {
          setTimeout(() => history.replace(`${paths.resultPath}?value=${sha256}`), 200);
          toggleModal();
        } else if (mutation.isError || mutation.data.status_code !== 200) {
          toast.error(getErrorMessageFromResponse(mutation));
          mutation.reset();
        }
      }
    }
  }, [mutation.isIdle, mutation.isError, mutation.isLoading, mutation.isSuccess])

  return (
    <Fragment>
      <Button outline color={'success'} className={'float-left search_bar-button'} onClick={toggleModal}>Upload file</Button>

      <ThemeModal
        isOpen={showModal}
        toggle={toggleModal}
        className={'modal-dialog--header-xl modal-dialog--dark'}
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" type="button" onClick={toggleModal}/>
          <h4 className="text-modal modal__title">Upload new file</h4>
        </div>
        <Row className={"px-5 mt-3"}>
          <Col>
            <ControlledFilepond
              control={control}
              name={'file'}
              allowMultiple={false}
              allowRevert={false}
              maxFiles={1}
              instantUpload={false}
              labelIdle={'Drag & Drop your sample or <span class="filepond--label-action">Browse</span>'}
            />
          </Col>
        </Row>

        <ButtonToolbar className="modal__footer">
          <Button outline className={"rounded float-right"} color={'success'} onClick={() => handleSubmit(onSubmit)()}>Upload</Button>
          <Button outline className="rounded" onClick={toggleModal}>Close</Button>
        </ButtonToolbar>
      </ThemeModal>
    </Fragment>
  );
};


UploadFileModal.propTypes = {
}

export default UploadFileModal;
