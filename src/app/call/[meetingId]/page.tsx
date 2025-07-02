import {auth} from "@/lib/auth";
import {CallView} from "@/modules/call/ui/views/call-view";
import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

interface IProps {
  params: Promise<{meetingId: string}>;
}
const CallPage = async ({params}: IProps) => {
  const {meetingId} = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({id: meetingId})
  );
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ErrorBoundary fallback={<p>Error</p>}>
          <Suspense fallback={<p>Loading</p>}>
            <CallView meetingId={meetingId} />
          </Suspense>
        </ErrorBoundary>
      </HydrationBoundary>
    </div>
  );
};

export default CallPage;
