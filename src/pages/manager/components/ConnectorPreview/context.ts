import { createCustomModel } from "@/common/createModel";
import { createSchemaFormModal } from "@/utils/customModal";
import { useReactive } from "ahooks";
import { useRef } from "react";

interface FlowNode {
  connectorCode: string;
  actionCode: string;

  next?: string;
  parent?: string;
}

export const ConnectorPreviewModel = createCustomModel(() => {
  const viewModel = useReactive({
    data: {} as IpaasConnectorVersion,
    flowNode: {} as FlowNode,
    authList: [] as {
      inputs: any;
      outputs: any;
    }[],
    authIndex: 0,
  });
  const finalData = useRef({} as IpaasConnectorVersion);

  const addAuthRecord = () => {
    return createSchemaFormModal({
      title: "添加授权",
      schema: viewModel.data.authprotocel.inputs,
      topDesc: viewModel.data.authprotocel.doc,
      onFinished: async function (values: Record<string, any>): Promise<any> {
        // TODO 记得加一个接口 添加授权
        viewModel.authList.push({
          inputs: values,
          outputs: {},
        });
        viewModel.authIndex = viewModel.authList.length - 1;
        return;
      },
    });
  };

  return {
    ...viewModel,
    ConnectorPreviewData: viewModel.data,
    flowNodeData: viewModel.flowNode,
    setConnectorDraftData: (data: Partial<IpaasConnectorVersion>) => {
      viewModel.data = {
        ...viewModel.data,
        ...data,
      };
    },
    setConnectorFinalData: (
      data: Partial<
        IpaasConnectorVersion & {
          code: string;
        }
      >
    ) => {
      viewModel.data = finalData.current = {
        ...viewModel.data,
        ...data,
      };
      viewModel.flowNode.connectorCode = data.code!;
    },
    disposePreview() {
      viewModel.data = finalData.current;
    },

    setFlowCode(node: Partial<FlowNode>) {
      viewModel.flowNode = {
        ...viewModel.flowNode,
        ...node,
      };
    },

    PreviewModel: viewModel,
    addAuthRecord,
  };
});
