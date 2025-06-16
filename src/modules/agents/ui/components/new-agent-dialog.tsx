interface INewAgentDialog {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

import {ResponsiveDialog} from "@/components/responsive-dialog";
import React from "react";
import {AgentForm} from "./agent-form";

export const NewAgentDialog = ({open, onOpenChange}: INewAgentDialog) => {
  return (
    <ResponsiveDialog
      title="New Agent"
      description="Create a new agent"
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
