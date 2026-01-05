import {getQueryClient, trpc} from "@/trpc/server";
import {HydrationBoundary} from "@tanstack/react-query";

export default async function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.premium.getCurrentSubscription.queryOptions()
  );

  return <HydrationBoundary></HydrationBoundary>;
}
