import {CommandSelect} from "@/components/command-select";
import {GeneratedAvatar} from "@/components/generated-avatar";
import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {MAX_PAGE_SIZE} from "@/lib/constants";
import {useTRPC} from "@/trpc/client";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {z} from "zod";
import {meetingsInsertSchema} from "../../schema";
import {MeetingGetOne} from "../../types";
import {NewAgentDialog} from "@/modules/agents/ui/components/new-agent-dialog";

interface IProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

export const MeetingForm = ({onSuccess, onCancel, initialValues}: IProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
        if (initialValues) {
          queryClient.invalidateQueries(
            // refetches the agent
            trpc.meetings.getOne.queryOptions({id: initialValues.id})
          );
        }
        toast.success("Meeting created successfully!");
        onSuccess?.(data.id);
      },
      onError: (error) => {
        toast.error(error.message);

        // TODO: Check if error code is forbidden so user is redirected to "/upgrade"
      },
    })
  );
  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: (data) => {
        // this invalidates cached data so that a fresh list of agents is fetched
        queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
        toast.success("Meeting created successfully!");
        onSuccess?.(data.id);
      },
      onError: (error) => {
        toast.error(error.message);

        // TODO: Check if error code is forbidden so user is redirected to "/upgrade"
      },
    })
  );

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
    resolver: zodResolver(meetingsInsertSchema),
  });

  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = form.handleSubmit((values) => {
    if (isEdit) {
      updateMeeting.mutate({...values, id: initialValues.id});
    } else {
      createMeeting.mutate(values);
    }
  });
  const [isNewAgentDialogOpen, setIsNewAgentDialogOpen] = useState(false);
  const [search, setSearch] = useState("");

  const agents = useQuery(
    // TODO: debounce search value
    trpc.agents.getMany.queryOptions({pageSize: MAX_PAGE_SIZE, search})
  );
  return (
    <>
      <NewAgentDialog
        open={isNewAgentDialogOpen}
        onOpenChange={setIsNewAgentDialogOpen}
      />
      <Form {...form}>
        <form className="space-y-4" onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Math consultant" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agentId"
            render={({field}) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={(agents.data?.items || []).map(({id, name}) => ({
                      id,
                      value: id,
                      children: (
                        <div className="flex items-center gap-x-2">
                          <GeneratedAvatar
                            seed={name}
                            variant="botttsNeutral"
                            className="border size-6"
                          />
                          <span>{name}</span>
                        </div>
                      ),
                    }))}
                    onSelect={field.onChange}
                    onSearch={setSearch}
                    value={field.value}
                    placeholder="Select an agent"
                  />
                </FormControl>
                <FormDescription>
                  Can&apos;t find an agent?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setIsNewAgentDialogOpen(true)}
                  >
                    Create a new Agent
                  </button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between space-x-2">
            {onCancel && (
              <Button
                variant="ghost"
                disabled={isPending}
                type="button"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <Button disabled={isPending} type="submit">
              {isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
