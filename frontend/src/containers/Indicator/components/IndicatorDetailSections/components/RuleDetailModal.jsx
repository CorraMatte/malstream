import React, {Fragment, useCallback, useState} from "react";
import PropTypes from "prop-types";
import {Button, CardBody} from "reactstrap";
import ThemeModal from "../../../../../shared/components/ThemeModal";
import {formatDateUTCtoYearMonthDay} from "../../../../../shared/helpers/date";
import CopyIconToClipboard from "../../../../../shared/components/icons/CopyIconToClipboard";


const RuleDetailModal = ({rule}) => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = useCallback(() => setShowModal(!showModal), [setShowModal, showModal]);

  return (
    <Fragment>
      <Button outline className={'float-right p-1 mx-0'} onClick={toggleModal}>Show Rule</Button>
      <ThemeModal
        isOpen={showModal}
        toggle={toggleModal}
        className={'modal-dialog--header-xl modal-dialog--dark'}
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" type="button" onClick={(e) => {
            toggleModal();
          }}/>
          <h4 className="text-modal modal__title"><b>{rule.title}</b> - created
            on {formatDateUTCtoYearMonthDay(rule.timestamp)}</h4>
        </div>

        <CardBody className={'rules__card-body rules__col-rule-body'}>
          <CopyIconToClipboard
            value={rule.body}
            copiedMessage={rule.title}
            style={{fill: '#ffffff', float: 'right'}}
          />
          <pre className={'pre--rules'}>{rule.body}</pre>
        </CardBody>

      </ThemeModal>
    </Fragment>
  )
}


RuleDetailModal.propTypes = {
  rule: PropTypes.object.isRequired
}

export default RuleDetailModal;
