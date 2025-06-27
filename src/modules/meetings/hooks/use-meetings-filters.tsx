import {DEFAULT_PAGE} from "@/lib/constants";
import {
  parseAsInteger,
  parseAsString,
  useQueryStates,
  parseAsStringEnum,
} from "nuqs";
import {MeetingsStatus} from "../types";

export const useMeetingsFilters = () => {
  return useQueryStates({
    search: parseAsString.withDefault("").withOptions({
      clearOnDefault: true,
      limitUrlUpdates: {method: "debounce", timeMs: 1000},
    }),
    page: parseAsInteger
      .withDefault(DEFAULT_PAGE)
      .withOptions({clearOnDefault: true}),
    status: parseAsStringEnum(Object.values(MeetingsStatus)),
    agentId: parseAsString.withDefault("").withOptions({clearOnDefault: true}),
  });
};
