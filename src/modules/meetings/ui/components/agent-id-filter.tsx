"use client";

import {CommandSelect} from "@/components/command-select";
import {GeneratedAvatar} from "@/components/generated-avatar";
import {MAX_PAGE_SIZE} from "@/lib/constants";
import {useTRPC} from "@/trpc/client";
import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {useMeetingsFilters} from "../../hooks/use-meetings-filters";

export const AgentIdFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();
  const trpc = useTRPC();

  const [agentSearchStr, setAgentSearchStr] = useState("");

  const {data} = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: MAX_PAGE_SIZE,
      search: agentSearchStr,
    })
  );
  return (
    <CommandSelect
      className="h-9"
      placeholder="Agent"
      options={(data?.items ?? []).map(({id, name}) => ({
        id,
        value: id,
        children: (
          <div className="flex items-center gap-x-2">
            <GeneratedAvatar
              seed={name}
              variant="botttsNeutral"
              className="size-4"
            />
            {name}
          </div>
        ),
      }))}
      onSelect={(agentId) => setFilters({agentId})}
      value={filters.agentId}
      onSearch={setAgentSearchStr}
    />
  );
};
