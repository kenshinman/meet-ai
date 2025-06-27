import {loadSearchParams} from "@/modules/agents/params";
import {ListHeader} from "@/modules/agents/ui/components/agents-list-header";
import {
  AgentsView,
  AgentsViewError,
  AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";
import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {SearchParams} from "nuqs";
import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

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
