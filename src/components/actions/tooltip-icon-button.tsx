import { Button, Tooltip } from "@heroui/react";
import { ReactNode } from "react";

export default function ToolTipIconButton(data: {
  currentState?: boolean;
  trueState?: ReactNode | null;
  falseState?: ReactNode | null;
  noState?: ReactNode | null;
  tooltip: String;
  onPress: () => void;
}) {
  return (
    <Tooltip delay={0}>
      <Button
        isIconOnly
        variant={data.currentState ? "danger" : "primary"}
        onPress={data.onPress}
      >
        {data.noState
          ? data.noState
          : data.currentState
            ? data.trueState
            : data.falseState}
      </Button>
      <Tooltip.Content className={"bg-black text-white"}>
        <p>{data.tooltip}</p>
      </Tooltip.Content>
    </Tooltip>
  );
}
