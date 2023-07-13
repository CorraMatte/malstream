import React, {Fragment, useCallback, useEffect, useState} from "react";
import SyncIcon from "mdi-react/SyncIcon";
import {Button, ButtonToolbar} from "reactstrap";
import ThemeModal from "../../../shared/components/ThemeModal";
import PropTypes from "prop-types";
import {useSyncRuleTypesMutation} from "../../../mutations/SyncRules";
import toast from "react-hot-toast";
import {getErrorMessageFromResponse} from "../../../shared/helpers";


const SyncRuleModal = ({ruleType}) => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = useCallback(() => setShowModal(!showModal), [setShowModal, showModal]);
  const mutation = useSyncRuleTypesMutation();

  useEffect(() => {
    if (!mutation.isIdle && !mutation.isLoading) {
      toast.dismiss();
      if (mutation.isSuccess) {
        toast.success(`Rules have been sync`);
      } else if (mutation.isError) {
        toast.error(getErrorMessageFromResponse(mutation));
      }
      mutation.reset();
    }
  }, [mutation.isIdle, mutation.isError, mutation.isLoading, mutation.error, mutation.isSuccess])

  return(
    <Fragment>
      <Button size="sm" outline color={'success'} onClick={toggleModal} className={'mr-3 float-right icon'}>
        <p className={'justify-content-center'}>
          <SyncIcon />
        </p>
      </Button>
      <ThemeModal
        isOpen={showModal}
        toggle={toggleModal}
        className={'modal-dialog modal-dialog--dark'}
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" type="button" onClick={(e) => {
            toggleModal();
          }} />
          <h4 className="text-modal modal__title">Do you want to sync the {ruleType} rules between the backend and the service?</h4>
        </div>

        <ButtonToolbar className="modal__footer">
          <Button outline className="rounded" color='success' onClick={() => {
            mutation.mutate(ruleType);
            toast.loading(`Syncing ${ruleType} rules. This operation can take a while.`)
            toggleModal();
          }}>Confirm</Button>
          <Button outline className="rounded" onClick={toggleModal}>Cancel</Button>
        </ButtonToolbar>
      </ThemeModal>
    </Fragment>
  )
}


SyncRuleModal.propType = {
  ruleType: PropTypes.string.isRequired
}


export default SyncRuleModal;
