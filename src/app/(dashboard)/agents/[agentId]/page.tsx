import {
  AgentIdView,
  AgentIdViewError,
  AgentIdViewLoading,
} from "@/modules/agents/ui/views/agent-id-view";
import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

interface IProps {
  params: Promise<{agentId: string}>;
}

export default async function AgentPage({params}: IProps) {
  const {agentId} = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.agents.getOne.queryOptions({id: agentId})
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<AgentIdViewError />}>
        <Suspense fallback={<AgentIdViewLoading />}>
          <AgentIdView agentId={agentId} />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
