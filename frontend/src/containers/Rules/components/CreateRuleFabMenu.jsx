import ThemedFabMenu from "../../../shared/components/ThemedFabMenu";
import AlphaYIcon from "mdi-react/AlphaYIcon";
import SigmaLowerIcon from "mdi-react/SigmaLowerIcon";
import AlphaSIcon from "mdi-react/AlphaSIcon";
import React from "react";
import {useHistory} from "react-router-dom";
import {SIGMA_LABEL, SURICATA_LABEL, YARA_LABEL} from "../../../shared/helpers/rules";
import paths from "../../../config/paths";


const CreateRuleFabMenu = () => {
  const history = useHistory();

  return (
    <ThemedFabMenu
      actions={[
        {
          text: "Add Yara",
          icon: <AlphaYIcon/>,
          onClick: () => history.push(`${paths.addRulePath}/${YARA_LABEL}`)
        },
        {
          text: "Add Sigma",
          icon: <SigmaLowerIcon/>,
          onClick: () => history.push(`${paths.addRulePath}/${SIGMA_LABEL}`)
        },
        {
          text: "Add Suricata",
          icon: <AlphaSIcon/>,
          onClick: () => history.push(`${paths.addRulePath}/${SURICATA_LABEL}`)
        }
      ]}
    />
  )
}

export default CreateRuleFabMenu;
