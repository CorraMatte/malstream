import React from "react";
import {Card, CardBody} from "reactstrap";
import PropTypes from "prop-types";
import LoadingSpinner from "../../../../shared/components/LoadingSpinner";


const CardWithIcon = ({
  title,
  icon,
  content,
  isLoading = false
}) => {
  return (
    <Card style={{height: 'auto'}}>
      <CardBody className="card-body__custom_card__container">
        <div className="p__custom_card__container-title">
          <h5 className="bold-text text-uppercase">{title}</h5>
        </div>
        {(isLoading && <LoadingSpinner />) || content}
        <span className={'span__custom_card__svg'}>{icon}</span>
      </CardBody>
    </Card>
  )
}


CardWithIcon.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  content: PropTypes.string.isRequired,
  isLoading: PropTypes.bool
}

export default CardWithIcon;
