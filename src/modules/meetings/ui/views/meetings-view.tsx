"use client";

import {DataTable} from "@/components/data-table";
import {ErrorState} from "@/components/error-state";
import {LoadingState} from "@/components/loading-state";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {columns} from "../components/columns";
import {EmptyState} from "@/components/empty-state";
import {useMeetingsFilters} from "../../hooks/use-meetings-filters";
import {DataPagination} from "@/components/data-pagination";
import {MeetingGetOne} from "../../types";
import {useRouter} from "next/navigation";

export const MeetingsView = () => {
  const [filters, setFilters] = useMeetingsFilters();

  const trpc = useTRPC();
  const {data} = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({...filters})
  );
  const router = useRouter();
  const handleRowClick = (meeting: MeetingGetOne) => {
    router.push(`/meetings/${meeting.id}`);
  };
  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable
        onRowClick={handleRowClick}
        data={data?.items}
        columns={columns}
      />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({page})}
      />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first meeting"
          description="Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with participants in real time."
        />
      )}
    </div>
  );
};

export const MeetingsViewLoading = () => {
  return (
    <LoadingState
      title="Loading meetings"
      description="This may take a few seconds."
    />
  );
};
export const MeetingsViewError = () => {
  return (
    <ErrorState
      title="Error loading meetings"
      description="Please try again later."
    />
  );
};
