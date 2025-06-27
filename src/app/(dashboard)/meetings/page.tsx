import {auth} from "@/lib/auth";
import {loadSearchParams} from "@/modules/meetings/params";
import {MeetingsListHeader} from "@/modules/meetings/ui/components/meetings-list-header";
import {
  MeetingsView,
  MeetingsViewError,
  MeetingsViewLoading,
} from "@/modules/meetings/ui/views/meetings-view";
import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {SearchParams} from "nuqs/server";
import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

interface IProps {
  searchParams: Promise<SearchParams>;
}

const MeetingsPage = async ({searchParams}: IProps) => {
  const params = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meetings.getMany.queryOptions({...params})
  );

  // TODO: Move to an auth provider so code is not repeated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");
  return (
    <>
      <MeetingsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ErrorBoundary fallback={<MeetingsViewError />}>
          <Suspense fallback={<MeetingsViewLoading />}>
            <MeetingsView />
          </Suspense>
        </ErrorBoundary>
      </HydrationBoundary>
    </>
  );
};

export default MeetingsPage;
