import { SelectProps, Tooltip } from "antd";
import CustomSelect from "../CustomSelect";
import { IPaasCommonFormFieldProps } from "../../type";

export default function MultiSelect(
  props: Omit<SelectProps, "mode"> &
    IPaasCommonFormFieldProps &
    EditotKindConfigMapping["Select"]
) {
  return (
    <CustomSelect
      mode="multiple"
      maxTagPlaceholder={(omittedValues) => (
        <Tooltip
          overlayStyle={{ pointerEvents: "none" }}
          title={omittedValues.map(({ label }) => label).join(", ")}
        >
          <span>+{omittedValues.length}...</span>
        </Tooltip>
      )}
      maxTagCount="responsive"
      {...props}
    ></CustomSelect>
  );
}
