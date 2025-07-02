import {generateAvatar} from "@/lib/avatar";
import {cn} from "@/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";

interface GeneratedAvatarProps {
  seed: string;
  className?: string;
  variant: "botttsNeutral" | "initials";
}

export const GeneratedAvatar = ({
  seed,
  className,
  variant,
}: GeneratedAvatarProps) => {
  const avatarUrl = generateAvatar({seed, variant});

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatarUrl} alt="avatar" />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
