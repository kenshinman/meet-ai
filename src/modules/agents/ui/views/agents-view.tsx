"use client";

import {ErrorState} from "@/components/error-state";
import {LoadingState} from "@/components/loading-state";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {columns} from "../components/columns";
import {EmptyState} from "@/components/empty-state";
import {useAgentsFilters} from "../../hooks/use-agents-filters";
import {AgentGetOne} from "../../types";
import {useRouter} from "next/navigation";
import {DataTable} from "@/components/data-table";
import {DataPagination} from "@/components/data-pagination";

export const AgentsView = () => {
  const [filters, setFilters] = useAgentsFilters();
  const trpc = useTRPC();
  const {data} = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({
      ...filters,
    })
  );

  const router = useRouter();

  const handleRowClick = (row: AgentGetOne) => {
    router.push(`/agents/${row.id}`);
  };

  return (
    <div className="flex-1 pb-4 px-4 md:px-8">
      <DataTable
        onRowClick={handleRowClick}
        data={data.items}
        columns={columns}
      />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({page})}
      />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first agent"
          description="Create an agent to join your meetings. Each agent will join your meetings and can interact with participants during the call."
        />
      )}
    </div>
  );
};

export const AgentsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take a few seconds."
    />
  );
};
export const AgentsViewError = () => {
  return (
    <ErrorState
      title="Error loading Agents"
      description="Please try again later."
    />
  );
};
