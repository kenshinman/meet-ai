import {ComponentProps, ReactNode} from "react";
import {MeetingsStatus} from "../../types";
import {CommandSelect} from "@/components/command-select";
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  LoaderIcon,
  VideoIcon,
} from "lucide-react";
import {useMeetingsFilters} from "../../hooks/use-meetings-filters";

const iconsMap: Record<MeetingsStatus, ReactNode> = {
  upcoming: <ClockArrowUpIcon />,
  active: <VideoIcon />,
  completed: <CircleCheckIcon />,
  processing: <LoaderIcon />,
  cancelled: <CircleXIcon />,
};

const options: ComponentProps<typeof CommandSelect>["options"] = Object.values(
  MeetingsStatus
).map((option) => ({
  id: option,
  value: option,
  children: (
    <div className="flex items-center gap-x-2 capitalize">
      {iconsMap[option]}
      {option}
    </div>
  ),
}));

export const StatusFilters = () => {
  const [filters, setFilters] = useMeetingsFilters();
  return (
    <CommandSelect
      options={options}
      className="h-9"
      placeholder="Meetings status"
      onSelect={(value) => setFilters({status: value as MeetingsStatus})}
      value={filters.status ?? ""}
    />
  );
};
