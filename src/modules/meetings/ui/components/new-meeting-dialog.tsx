interface INewMeetingDialog {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

import {ResponsiveDialog} from "@/components/responsive-dialog";
import React from "react";
import {MeetingForm} from "./meeting-form";
import {useRouter} from "next/navigation";

export const NewMeetingDialog = ({open, onOpenChange}: INewMeetingDialog) => {
  const router = useRouter();
  return (
    <ResponsiveDialog
      title="New Meeting"
      description="Create a new agent"
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingForm
        onSuccess={(id) => {
          onOpenChange(false);
          router.push(`/meetings/${id}`);
        }}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
