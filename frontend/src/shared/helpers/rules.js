
export const YARA_LABEL = "yara";
export const SIGMA_LABEL = "sigma";
export const SURICATA_LABEL = "suricata";
export const OSINT_LABEL = "osint";

export const RULE_TYPES_LABEL = [YARA_LABEL,  SIGMA_LABEL,  SURICATA_LABEL, ]

export const RESULT_SOURCES_LABEL = RULE_TYPES_LABEL.concat(OSINT_LABEL)


export const get_title_from_rule = (rule_type, rule) => {
  if (rule_type === SURICATA_LABEL) {
    return rule.signature;
  } else if (rule_type === SIGMA_LABEL) {
    return rule.name;
  } else if (rule_type === YARA_LABEL) {
    return rule.name;
  }
}