import {EmptyState} from "@/components/empty-state";
import {Button} from "@/components/ui/button";
import {BanIcon, VideoIcon} from "lucide-react";
import Link from "next/link";

interface IProps {
  meetingId: string;
  onCancelMeeting: () => void;
  isCancelling: boolean;
}

export const UpcomingState = ({
  isCancelling,
  meetingId,
  onCancelMeeting,
}: IProps) => {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        image="/upcoming.svg"
        title="No Upcoming Meetings"
        description="You have no upcoming meetings scheduled. Schedule a new meeting to get started."
      />
      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
        <Button
          onClick={onCancelMeeting}
          disabled={isCancelling}
          variant="secondary"
          className="w-full lg:w-auto"
        >
          <BanIcon />
          Cancel meeting
        </Button>
        <Button disabled={isCancelling} asChild className="w-full lg:w-auto">
          <Link href={`/call/${meetingId}`}>
            <VideoIcon />
            Start meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};
