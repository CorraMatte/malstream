import React from "react";
import {useRuleByIdQuery} from "../../queries/RuleByID";
import ErrorHandler from "../../shared/components/ErrorHandler";
import {useParams} from "react-router-dom";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import {useEditRuleMutation} from "../../mutations/EditRule";
import RuleForm from "../../shared/components/form/RuleForm";


const EditRules = () => {
  const {RuleId: ruleId} = useParams();
  const {data, isIdle, isLoading, isError, error} = useRuleByIdQuery(ruleId);

  if (isError) {
    return <ErrorHandler error={error}/>
  }

  if (isLoading || isIdle) {
    return <LoadingSpinner/>
  }

  return <RuleForm
    mutationFn={useEditRuleMutation}
    ruleType={data.type}
    defaultValues={{
      title: data.title,
      body: data.body,
    }}
    isEdit
    ruleId={data.id}
  />
}


export default EditRules;