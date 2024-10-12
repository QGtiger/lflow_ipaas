import { IPaasSchemaForm } from "@lightfish/ipaas-schemaform";
import { forwardRef, useMemo } from "react";
import Upload from "../Upload";
import { FormInstance } from "antd";

import "github-markdown-css";
import "@lightfish/ipaas-schemaform/styles.css";
import "@lightfish/ipaas-schemaform/tailwind.css";

type IProps = React.ComponentProps<typeof IPaasSchemaForm>;

const CustomIPaasSchemaForm = forwardRef<FormInstance, IProps>((props, ref) => {
  const _editorMap = useMemo(() => {
    return {
      ...props.editorMap,
      Upload,
    };
  }, [props.editorMap]);
  return <IPaasSchemaForm {...props} editorMap={_editorMap} ref={ref} />;
});

export default CustomIPaasSchemaForm;
