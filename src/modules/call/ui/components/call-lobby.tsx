import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";
import {generateAvatar} from "@/lib/avatar";
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import {LogInIcon} from "lucide-react";
import Link from "next/link";

interface IProps {
  onJoin: () => void;
}

const DisabledVideoPreview = () => {
  const {data} = authClient.useSession();

  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name: data?.user.name ?? "",
          image:
            data?.user.image ??
            generateAvatar({seed: data?.user.name ?? "", variant: "initials"}),
        } as StreamVideoParticipant
      }
    />
  );
};

const AllowCameraPermissions = () => (
  <p className="text-sm">
    Please grant your browser permission to access your camera and microphone.
  </p>
);

export const CallLobby = ({onJoin}: IProps) => {
  const {useCameraState, useMicrophoneState} = useCallStateHooks();
  const {hasBrowserPermission: hasCameraPermission} = useCameraState();
  const {hasBrowserPermission: hasMicrophonePermission} = useMicrophoneState();

  const hasBrowserMediaPermission =
    hasCameraPermission && hasMicrophonePermission;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-radial from-sidebar-accent to-sidebar">
      <div className="py-4 px-8 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
          <div className="flex flex-col gap-y-2 text-center">
            <h6 className="text-lg font-medium">Ready to join?</h6>
            <p className="">Set up your call before joining.</p>
          </div>
          <VideoPreview
            DisabledVideoPreview={
              hasBrowserMediaPermission
                ? DisabledVideoPreview
                : AllowCameraPermissions
            }
          />
          <div className="flex gap-x-2">
            <ToggleAudioPreviewButton />
            <ToggleVideoPreviewButton />
          </div>
          <div className="flex flex-col-reverse gap-y-2 md:flex-row gap-x-2 justify-between w-full px-6 md:px-0">
            <Button asChild variant="outline">
              <Link href="/meeting" replace>
                Cancel
              </Link>
            </Button>
            <Button onClick={onJoin}>
              <LogInIcon />
              Join Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
