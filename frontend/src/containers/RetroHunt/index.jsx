import React from 'react';
import {Col, Container, Row} from 'reactstrap';
import {useRetroHuntTasks} from "../../queries/RetroHunt";
import ErrorHandler from "../../shared/components/ErrorHandler";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import RetroHuntTaskDetailCard from "./components/RetroHuntTaskDetailCard";


const RetroHuntTasks = () => {
  const {data, isIdle, isLoading, isError, error} = useRetroHuntTasks();

  if (isError) {
    return <ErrorHandler error={error}/>
  }

  if (isLoading || isIdle) {
    return <LoadingSpinner/>
  }

  return (
    <Container>
      <div className={'div__sticky-top'}>
        <Row>
          <Col md={12} className={'mx-auto'}>
            <h3 className="page-title">Retro Hunt Tasks</h3>
          </Col>
        </Row>
      </div>

      {
        data.map((task, index) => (
          <RetroHuntTaskDetailCard task={task} key={index}/>
        ))
      }

    </Container>
  );
}

export default RetroHuntTasks;
