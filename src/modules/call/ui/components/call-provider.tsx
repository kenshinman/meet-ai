"use-client";

import {authClient} from "@/lib/auth-client";
import {generateAvatar} from "@/lib/avatar";
import {Loader2Icon} from "lucide-react";
import {CallConnect} from "./call-connect";

interface IProps {
  meetingId: string;
  meetingName: string;
}

export const CallProvider = ({meetingId, meetingName}: IProps) => {
  const {data, isPending} = authClient.useSession();

  if (!data || isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <Loader2Icon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  const {name, image, id} = data.user;

  return (
    <div>
      <CallConnect
        meetingId={meetingId}
        meetingName={meetingName}
        userId={id}
        userName={name}
        userImage={image ?? generateAvatar({seed: name, variant: "initials"})}
      />
    </div>
  );
};
