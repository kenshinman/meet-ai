interface IUpdateAgentDialog {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: AgentGetOne;
}

import {ResponsiveDialog} from "@/components/responsive-dialog";
import React from "react";
import {AgentForm} from "./agent-form";
import {AgentGetOne} from "../../types";

export const UpdateAgentDialog = ({
  open,
  onOpenChange,
  initialValues,
}: IUpdateAgentDialog) => {
  return (
    <ResponsiveDialog
      title="Edit Agent"
      description="Edit the agent details."
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
};
