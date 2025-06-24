import {
  MeetingsView,
  MeetingsViewError,
  MeetingsViewLoading,
} from "@/modules/meetings/ui/views/meetings-view";
import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

const MeetingsPage = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({}));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<MeetingsViewError />}>
        <Suspense fallback={<MeetingsViewLoading />}>
          <MeetingsView />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
};

export default MeetingsPage;
