"use client";
import {GeneratedAvatar} from "@/components/generated-avatar";
import {Badge} from "@/components/ui/badge";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {formatDuration} from "@/lib/utils";
import {format} from "date-fns";
import {
  BookOpenTextIcon,
  ClockFadingIcon,
  FileTextIcon,
  FileVideoIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";
import {MeetingGetOne} from "../../types";
import {Transcript} from "./transcript";
import {ChatProvider} from "./chat-provider";

interface IProps {
  data: MeetingGetOne;
}

type TabButton = {
  value: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const tabButtons: TabButton[] = [
  {
    value: "summary",
    label: "Summary",
    Icon: BookOpenTextIcon,
  },
  {
    value: "transcript",
    label: "Transcript",
    Icon: FileTextIcon,
  },
  {
    value: "recording",
    label: "Recording",
    Icon: FileVideoIcon,
  },
  {
    value: "chat",
    label: "Ask AI",
    Icon: SparklesIcon,
  },
];

export const CompletedState = ({data}: IProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <Tabs defaultValue="summary">
        <div className="bg-white rounded-lg border px-3">
          <ScrollArea>
            <TabsList className="p-0 bg-background justify-start rounded-none h-13">
              {tabButtons.map(({value, label, Icon}) => (
                <TabsTrigger
                  value={value}
                  key={value}
                  className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                >
                  <Icon />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <TabsContent value="summary">
          <div className="bg-white rounded-lg border">
            <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
              <h2 className="text-2xl font-medium capitalize">{data.name}</h2>
              <div className="flex gap-x-2 items-center">
                <Link
                  href={`/agents/${data.agent.id}`}
                  className="flex items-center gap-x-2 underline underline-offset-4 capitalize"
                >
                  <GeneratedAvatar
                    variant="botttsNeutral"
                    seed={data.agent.name}
                    className="size-5"
                  />
                  {data.agent.name}
                </Link>{" "}
                <p>{data.startedAt ? format(data.startedAt, "PPP") : ""}</p>
              </div>
              <div className="flex gap-x-2 items-center">
                <SparklesIcon className="size-4" />
                <p>General summary</p>
                <Badge
                  variant="outline"
                  className="flex items-center gap-x-2 [&>svg]:size-4"
                >
                  <ClockFadingIcon className="text-blue-700" />
                  {data.duration ? formatDuration(data.duration) : ""}
                </Badge>
              </div>
              <Markdown
                components={{
                  h1: (props) => (
                    <h1 className="text-2xl font-medium mb-6" {...props} />
                  ),
                  h2: (props) => (
                    <h1 className="text-xl font-medium mb-6" {...props} />
                  ),
                  h3: (props) => (
                    <h1 className="text-lg font-medium mb-6" {...props} />
                  ),
                  h4: (props) => (
                    <h1 className="text-base font-medium mb-6" {...props} />
                  ),
                  p: (props) => <p className="mb-4" {...props} />,
                  ul: (props) => (
                    <ul className="list-disc pl-6 mb-4" {...props} />
                  ),
                  ol: (props) => (
                    <ol className="list-decimal pl-6 mb-4" {...props} />
                  ),
                  li: (props) => <li className="mb-2" {...props} />,
                  a: (props) => (
                    <a
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                  code: (props) => (
                    <code className="bg-gray-100 p-1 rounded" {...props} />
                  ),
                  pre: (props) => (
                    <pre className="bg-gray-100 p-4 rounded mb-4" {...props} />
                  ),
                }}
              >
                {data.summary}
              </Markdown>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="recording">
          <div className="bg-white rounded-lg border px-4 py-5">
            {data.recordingUrl && (
              <video
                src={data.recordingUrl}
                className="w-full rounded-lg"
                controls
              />
            )}
          </div>
        </TabsContent>
        <TabsContent value="transcript">
          <Transcript meetingId={data.id} />
        </TabsContent>
        <TabsContent value="chat">
          <ChatProvider meetingId={data.id} meetingName={data.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
