import React from "react";
import {useAddRuleMutation} from "../../mutations/AddRule";
import RuleForm from "../../shared/components/form/RuleForm";
import {useParams} from "react-router-dom";
import {Container} from "reactstrap";


const AddRules = () => {
  const {RuleType: ruleType} = useParams();

  return (
    <Container>
      <RuleForm mutationFn={useAddRuleMutation} ruleType={ruleType} />
    </Container>
  )
}


export default AddRules;