"use client";

import {ErrorState} from "@/components/error-state";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {CallProvider} from "../components/call-provider";

interface IProps {
  meetingId: string;
}

export const CallView = ({meetingId}: IProps) => {
  const trpc = useTRPC();
  const {data: meeting} = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({id: meetingId})
  );

  if (meeting.status === "completed") {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorState
          title="This meeting has ended"
          description="You can no longer join this meeting"
        />
      </div>
    );
  }

  return (
    <div>
      <CallProvider meetingId={meetingId} meetingName={meeting.name} />
    </div>
  );
};
