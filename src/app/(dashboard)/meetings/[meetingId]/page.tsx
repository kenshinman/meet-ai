import {
  MeetingIdView,
  MeetingIdViewError,
  MeetingIdViewLoading,
} from "@/modules/meetings/ui/views/meeting-id-view";
import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

interface IProps {
  params: Promise<{meetingId: string}>;
}

const MeetingPage = async ({params}: IProps) => {
  const {meetingId} = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({id: meetingId})
  );
  // TODO: Prefetch meeting.getTranscript

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<MeetingIdViewError />}>
        <Suspense fallback={<MeetingIdViewLoading />}>
          <MeetingIdView meetingId={meetingId} />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
};

export default MeetingPage;
