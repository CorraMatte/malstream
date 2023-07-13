import React, {useEffect} from "react";
import {Col, Progress, Row} from "reactstrap";
import {formatDateUTCtoYearMonthDayTime} from "../../../shared/helpers/date";
import PropTypes from "prop-types";
import ColorTagInlineBadge from "../../../shared/components/badge/ColorTagInlineBadge";
import {getColorBadgeByPriority} from "../../../shared/helpers/priority";
import ChevronDownIcon from "mdi-react/ChevronDownIcon";
import DeleteIconModal from "../../../shared/components/modal/DeleteIconModal";
import {useDeleteRetroHuntTask} from "../../../mutations/DeleteRetroHuntTask";
import toast from "react-hot-toast";


const RetroHuntTaskHeader = ({task, toggle}) => {
  const mutation = useDeleteRetroHuntTask();

  useEffect(() => {
    if (!mutation.isIdle) {
      if (mutation.isLoading) {
        toast.loading(`Deleting retrohunt task related to ${task.rule_name}`);
      } else {
        toast.dismiss();
        if (mutation.isSuccess) {
          setTimeout(() => {
            toast.success(`Retrohunt task related to ${task.rule_name} deleted`);
          }, 200 )
        } else if (mutation.isError) {
          toast.error('Error during deleting the task');
          mutation.reset();
        }
      }
    }
  }, [mutation.isIdle, mutation.isError, mutation.isLoading, mutation.isSuccess])

  return (
    <div className={'card-header__events'}>
      <Row>
        <Col md={8} lg={9} xl={9}>
          <Row>
            <Col md={12}>
              <div className={"card__title__events"}>
                <h4 className={'bold-text'}>{task.rule_name}</h4>
              </div>
              <p>Matched files</p>
              <h2>{task.files_matched}
              </h2>
            </Col>
          </Row>
        </Col>
        <Col md={4} lg={3} xl={3} className={'text-right'}>
          <h4><ColorTagInlineBadge color={getColorBadgeByPriority(task.priority)}
                                   tag={`PRIORITY:${task.priority.toUpperCase()}`}/></h4>
          {task.submitted && <p>Started on <b>{formatDateUTCtoYearMonthDayTime(task.submitted)}</b></p>}
          {task.finished && <p>Finished on <b>{formatDateUTCtoYearMonthDayTime(task.finished)}</b></p>}
        </Col>
      </Row>
      <Row className={'mt-2'}>
        <Col md={7}>
          <div className={"progress-wrap progress-wrap--middle"}>
            <Progress animated={!task.finished} value={100}>
              {!task.finished ? 'pending' : 'finished'}
            </Progress>
          </div>
        </Col>
        <Col md={5} className={'d-flex justify-content-end'}>
          <DeleteIconModal
            onDelete={() => mutation.mutate(task.id)}
            message={'Do you really want to delete the task?'}
          />
          <ChevronDownIcon
            ize={24}
            style={{fill: '#ffffff'}}
            className={'border-hover-white mx-0 my-auto'}
            onClick={toggle}
          />
        </Col>
      </Row>
    </div>
  )
}

RetroHuntTaskHeader.propTypes = {
  task: PropTypes.shape().isRequired,
  toggle: PropTypes.func.isRequired,
}

export default RetroHuntTaskHeader;
