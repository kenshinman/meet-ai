"use client";

import {Button} from "@/components/ui/button";
import {PlusIcon, XCircleIcon} from "lucide-react";
import {useState} from "react";
import {useMeetingsFilters} from "../../hooks/use-meetings-filters";
import {AgentIdFilter} from "./agent-id-filter";
import {MeetingsSearchFilter} from "./meetings-search-filter";
import {NewMeetingDialog} from "./new-meeting-dialog";
import {StatusFilters} from "./status-filters";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";

export const MeetingsListHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useMeetingsFilters();

  const isFilterExist =
    !!filters.agentId || !!filters.search || !!filters.status;

  const onClearFilters = () => {
    setFilters({
      status: null,
      agentId: "",
      search: "",
      page: 1,
    });
  };

  return (
    <>
      <NewMeetingDialog open={isOpen} onOpenChange={setIsOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">My Meetings</h5>
          <Button onClick={() => setIsOpen(true)}>
            <PlusIcon /> Meeting
          </Button>
        </div>
        <ScrollArea>
          <div className="flex items-center gap-x-2 p-1">
            <MeetingsSearchFilter />
            <StatusFilters />
            <AgentIdFilter />
            {isFilterExist && (
              <Button variant="outline" onClick={onClearFilters}>
                <XCircleIcon className="size-4" />
                Clear
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};
