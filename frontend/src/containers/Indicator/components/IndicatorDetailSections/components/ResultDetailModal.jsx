import React, {Fragment, useCallback, useState} from "react";
import PropTypes from "prop-types";
import {Button, CardBody} from "reactstrap";
import ThemeModal from "../../../../../shared/components/ThemeModal";
import ReactJson from 'react-json-view'


const ResultDetailModal = ({raw_json, title}) => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = useCallback(() => setShowModal(!showModal), [setShowModal, showModal]);

  return (
    <Fragment>
      <Button outline className={'float-right p-1 mx-1'} onClick={toggleModal}>Show Event Details</Button>
      <ThemeModal
        isOpen={showModal}
        toggle={toggleModal}
        className={'modal-dialog--header-xl modal-dialog--dark'}
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" type="button" onClick={(e) => {
            toggleModal();
          }}/>
          <h4 className="text-modal modal__title">{title}</h4>
        </div>

        <CardBody className={'rules__card-body rules__col-rule-body'}>

          <ReactJson
            src={raw_json}
            theme={'bright'}
            displayDataTypes
            displayObjectSize
            style={{backgroundColor: "#333246 !important"}}
            collapsed={1}
          />
        </CardBody>

      </ThemeModal>
    </Fragment>
  )
}


ResultDetailModal.propTypes = {
  raw_json: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
}

export default ResultDetailModal;
