import {
  AgentsView,
  AgentsViewError,
  AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";
import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {ErrorBoundary} from "react-error-boundary";
import {Suspense} from "react";
import ListHeader from "@/modules/agents/ui/components/list-header";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {SearchParams} from "nuqs";
import {loadSearchParams} from "@/modules/agents/params";

interface IProps {
  searchParams: Promise<SearchParams>;
}

const Agents = async ({searchParams}: IProps) => {
  const filters = await loadSearchParams(searchParams);
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.agents.getMany.queryOptions({
      ...filters,
    })
  );
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  return (
    <>
      <ListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ErrorBoundary fallback={<AgentsViewError />}>
          <Suspense fallback={<AgentsViewLoading />}>
            <AgentsView />
          </Suspense>
        </ErrorBoundary>
      </HydrationBoundary>
    </>
  );
};

export default Agents;
