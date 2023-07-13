import {Button, Card, CardBody, Col, Row} from "reactstrap";
import classNames from "classnames";
import ControlledMonacoYaraEditor from "./ControlledMonacoYaraEditor";
import React, {useEffect} from "react";
import toast from "react-hot-toast";
import {useForm} from "react-hook-form";
import paths from "../../../config/paths";
import {getErrorMessageFromResponse} from "../../helpers";
import {useHistory} from "react-router-dom";
import PropTypes from "prop-types";
import {SIGMA_LABEL} from "../../helpers/rules";
import ControlledMonacoSigmaEditor from "./ControlledMonacoSigmaEditor";


const RuleForm = ({
  mutationFn,
  ruleType,
  isEdit = false,
  defaultValues = {},
  ruleId = ''
}) => {
  const history = useHistory();
  const mutation = mutationFn();
  const {handleSubmit, formState: {errors}, control} = useForm({defaultValues: defaultValues});


  useEffect(() => {
    if (!mutation.isIdle && !mutation.isLoading) {
      toast.dismiss();
      if (mutation.isSuccess) {
        toast.success(`Rule has been ${isEdit ? 'updated' : 'created'}`);
        setTimeout(() => history.push(`${paths.rulesPath}?rule_type=${ruleType}`), 1500);
      } else if (mutation.isError) {
        toast.dismiss();
        toast.error(getErrorMessageFromResponse(mutation));
      }
      mutation.reset();
    }
  }, [mutation.isIdle, mutation.isError, mutation.isLoading, mutation.error, mutation.isSuccess])

  const onSubmit = (data) => {
    toast.loading('Validating rule');

    if (isEdit) {
      mutation.mutate({
        ruleId: ruleId,
        ruleType: ruleType,
        params: {
          body: data.body
        }
      });
    } else {
      mutation.mutate({
        ruleType: ruleType,
        params: {
          body: data.body
        }
      });
    }
  }

  return (
    <Card>
      <CardBody>
        <div className="card__title">
          <h4 className="bold-text">{isEdit ? 'Edit' : 'Add'} {ruleType} rule</h4>
        </div>
        <Row>
          <Col>
            <form className="form form--vertical">
              <div
                className={classNames({'form__form-group': true, "form__form-group-error-validation": errors.body})}>
                <div className="form__form-group-field">
                  <div className='form__form-group-input-wrap'>
                    {
                      ruleType === SIGMA_LABEL ?
                        <ControlledMonacoSigmaEditor
                          name={'body'}
                          control={control}
                          rules={{required: `The ${ruleType} body is required`}}
                          defaultValue={defaultValues?.body}
                        /> :
                        <ControlledMonacoYaraEditor
                          name={'body'}
                          control={control}
                          rules={{required: `The ${ruleType} body is required`}}
                          defaultValue={defaultValues?.body}
                        />
                    }
                    {
                      errors?.body && errors.body.message &&
                      <span className="form__form-group-error">{errors.body.message}</span>
                    }
                  </div>
                </div>
              </div>
            </form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              outline
              className={"rounded float-right"}
              color={'success'}
              onClick={handleSubmit(onSubmit)}
            >{isEdit ? 'Update' : 'Create'}</Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

RuleForm.propTypes = {
  mutationFn: PropTypes.func.isRequired,
  ruleType: PropTypes.string.isRequired,
  isEdit: PropTypes.bool,
  defaultValues: PropTypes.shape,
  ruleId: PropTypes.string
}

export default RuleForm;
