"use client";

import {ErrorState} from "@/components/error-state";
import {LoadingState} from "@/components/loading-state";
import {useTRPC} from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {MeetingIdViewHeader} from "../components/meeting-id-view-header";
import {useMemo, useState} from "react";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useConfirm} from "@/hooks/use-confirm";
import {UpdateMeetingDialog} from "../components/update-meeting-dialog";
import {UpcomingState} from "../components/upcoming-state";
import {ActiveState} from "../components/active-state";
import {CancelledState} from "../components/cancelled-state";
import {ProcessingState} from "../components/processing-state";

interface IProps {
  meetingId: string;
}

export const MeetingIdView = ({meetingId}: IProps) => {
  const trpc = useTRPC();
  const {data} = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({id: meetingId})
  );
  const [isUpdateMeetingDialogOpen, setIsUpdateMeetingDialogOpen] =
    useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "Deleting this meeting will mean losing all transcripts"
  );

  const {mutate: removeMeeting} = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );
        toast.success("Meeting deleted successfully!");
        router.replace("/meetings");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const handleRemoveMeeting = async () => {
    const ok = await confirm();
    if (ok) removeMeeting({id: meetingId});
  };

  const {isActive, isUpcoming, isCompleted, isCancelled, isProcessing} =
    useMemo(
      () => ({
        isActive: data.status === "active",
        isUpcoming: data.status === "upcoming",
        isCompleted: data.status === "completed",
        isCancelled: data.status === "cancelled",
        isProcessing: data.status === "processing",
      }),
      [data.status]
    );

  return (
    <>
      <UpdateMeetingDialog
        initialValues={data}
        open={isUpdateMeetingDialogOpen}
        onOpenChange={setIsUpdateMeetingDialogOpen}
      />
      <ConfirmationDialog />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data.name}
          onEdit={() => setIsUpdateMeetingDialogOpen(true)}
          onRemove={handleRemoveMeeting}
        />
        {isCancelled && <CancelledState />}
        {isCompleted && <div>Completed</div>}
        {isUpcoming && (
          <UpcomingState
            meetingId={meetingId}
            onCancelMeeting={() => {}}
            isCancelling={false}
          />
        )}
        {isActive && <ActiveState meetingId={meetingId} />}
        {isProcessing && <ProcessingState />}
      </div>
    </>
  );
};

export const MeetingIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meeting"
      description="This may take a few seconds."
    />
  );
};
export const MeetingIdViewError = () => {
  return (
    <ErrorState
      title="Error loading Meeting"
      description="Please try again later."
    />
  );
};
