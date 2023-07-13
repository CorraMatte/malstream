import React, {Fragment, useCallback, useState} from 'react';
import {Button, ButtonToolbar, CardBody} from 'reactstrap';
import ThemeModal from "../../../shared/components/ThemeModal";
import PropTypes from "prop-types";
import CopyIconToClipboard from "../../../shared/components/icons/CopyIconToClipboard";


const RetroHuntTaskYaraModal = ({yara, ruleName}) => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = useCallback(() => setShowModal(!showModal), [setShowModal, showModal]);

  return (
    <Fragment>
      <Button className="float-right" outline size="sm" onClick={(e) => {
        e.stopPropagation();
        toggleModal();
      }}>Show Rule</Button>
      <ThemeModal
        isOpen={showModal}
        toggle={toggleModal}
        className={'modal-dialog--header-xl modal-dialog--dark'}
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" type="button" onClick={toggleModal}/>
          <h4 className="text-modal modal__title">Yara rule</h4>
        </div>

        <div className="modal__body">
          <CardBody className={'rules__card-body rules__col-rule-body'}>
            <CopyIconToClipboard
              value={yara}
              copiedMessage={ruleName}
              style={{float: 'right'}}
            />
            <pre className={'pre--rules'}>{yara}</pre>
          </CardBody>
        </div>

        <ButtonToolbar className="modal__footer">
          <Button outline className="rounded" onClick={toggleModal}>Close</Button>
        </ButtonToolbar>
      </ThemeModal>
    </Fragment>
  );
};

RetroHuntTaskYaraModal.propTypes = {
  yara: PropTypes.string.isRequired,
  ruleName: PropTypes.string.isRequired,
}


export default RetroHuntTaskYaraModal;
