import { createCustomModel } from "@/common/createModel";
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
  };
});
