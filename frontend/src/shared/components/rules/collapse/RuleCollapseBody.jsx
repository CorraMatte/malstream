import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {CardBody, Col, Row} from "reactstrap";
import LoadingSpinner from "../../LoadingSpinner";
import CopyIconToClipboard from "../../icons/CopyIconToClipboard";
import {useRuleByIdQuery} from "../../../../queries/RuleByID";
import ErrorHandler from "../../ErrorHandler";
import Highlighter from "react-highlight-words";
import PencilOutlineIcon from "mdi-react/PencilOutlineIcon";
import paths from "../../../../config/paths";
import DeleteIconModal from "../../modal/DeleteIconModal";
import {useDeleteRuleMutation} from "../../../../mutations/DeleteRule";
import {useQueryClient} from "react-query";
import {useHistory} from "react-router-dom";
import toast from "react-hot-toast";


const RuleCollapseBody = ({ruleId, isOpen, highLightText = ''}) => {
  const {data, isIdle, isLoading, isError, error} = useRuleByIdQuery(ruleId, isOpen);
  const mutation = useDeleteRuleMutation();
  const queryClient = useQueryClient();
  const history = useHistory();

  useEffect(() => {
    if (!mutation.isIdle) {
      if (mutation.isLoading) {
        toast.loading('Deleting rule');
      } else {
        toast.dismiss();
        if (mutation.isSuccess) {
          setTimeout(() => {
            toast.success(`Rule ${rule.title} deleted`);
            queryClient.invalidateQueries(['all-rules', rule.type, '']);
          }, 200 )
        } else if (mutation.isError) {
          toast.error('Error during rule');
          mutation.reset();
        }
      }
    }
  }, [mutation.isIdle, mutation.isError, mutation.isLoading, mutation.isSuccess, queryClient])

  if (isError) {
    return <ErrorHandler error={error}/>
  }

  const rule = data;

  return (
    <CardBody className={'rules__card-body rules__col-rule-body mx-0 my-1 h-auto'}>
      {
        isIdle || isLoading ? <LoadingSpinner/> :
          <Row>
            <Col md={12}>
              <pre className={'pre--rules'}>
                <span className={'float-right my-1'}>
                  <PencilOutlineIcon
                    size={24} style={{fill: '#ffffff'}}
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push(`${paths.editRulePath}/${rule.id}`);
                    }}
                    className={'border-hover-white mr-3'}
                  />

              <DeleteIconModal
                onDelete={() => mutation.mutate({ruleId: rule.id, ruleType: rule.type})}
                message={'Do you really want to delete the rule?'}
                iconClass={'mr-3'}
              />

              <CopyIconToClipboard
                value={rule.body}
                copiedMessage={rule.title}
                style={{fill: '#ffffff', marginRight: '7px'}}
              />
                </span>
                {highLightText ?
                  <Highlighter
                    searchWords={[highLightText]}
                    autoEscape={true}
                    textToHighlight={rule.body}
                  /> :
                  rule.body}
              </pre>
            </Col>
          </Row>
      }
    </CardBody>
  )
}


RuleCollapseBody.propTypes = {
  ruleId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  highLightText: PropTypes.string
}


export default RuleCollapseBody;
