import { SuccessIcon, toast } from "@heroui/react";
import { Info } from "lucide-react";
import { decodeFromAxios } from "./error-decoder";

export class Toaster {
  static error(message: string) {
    toast("Error", {
      actionProps: {
        children: "Dismiss",
        onPress: () => toast.clear(),
        variant: "danger-soft",
      },
      description: message,
      indicator: <Info />,
      variant: "danger",
    });
  }
  static success(message: string) {
    toast("Success", {
      actionProps: {
        children: "Dismiss",
        onPress: () => toast.clear(),
        variant: "secondary",
      },
      description: message,
      indicator: <SuccessIcon />,
      variant: "success",
    });
  }
  static errorHttp(err: any) {
    return this.error(decodeFromAxios(err).message);
  }
}
