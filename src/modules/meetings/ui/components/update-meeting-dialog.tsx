interface IUpdateMeetingDialog {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: MeetingGetOne;
}

import {ResponsiveDialog} from "@/components/responsive-dialog";
import {MeetingGetOne} from "../../types";
import {MeetingForm} from "./meeting-form";

export const UpdateMeetingDialog = ({
  open,
  onOpenChange,
  initialValues,
}: IUpdateMeetingDialog) => {
  return (
    <ResponsiveDialog
      title="Update Meeting"
      description="Update your meeting"
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
};
