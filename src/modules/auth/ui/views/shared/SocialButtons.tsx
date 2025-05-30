import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";
import {FaGithub, FaGoogle} from "react-icons/fa";

export const SocialButtons = ({
  pending,
  setError,
}: {
  pending: boolean;
  setError: (error: string) => void;
}) => {
  const onSocialSubmit = (provider: "google" | "github") => {
    authClient.signIn.social(
      {
        provider,
        callbackURL: "/",
      },
      {
        onError: (ctx) => {
          setError(ctx.error.message);
        },
      }
    );
  };
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        disabled={pending}
        variant="outline"
        type="button"
        className="w-full"
        onClick={() => onSocialSubmit("google")}
      >
        <FaGoogle />
      </Button>
      <Button
        disabled={pending}
        variant="outline"
        type="button"
        className="w-full"
        onClick={() => onSocialSubmit("github")}
      >
        <FaGithub />
      </Button>
    </div>
  );
};
