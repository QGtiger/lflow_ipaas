import { message } from "antd";
import { ArgsProps, MessageInstance } from "antd/es/message/interface";

export const MessageRef = {
  current: message as unknown as MessageInstance,
};

export function createMessage(args: ArgsProps) {
  return MessageRef.current.open(args);
}
