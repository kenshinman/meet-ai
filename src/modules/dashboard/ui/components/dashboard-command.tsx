import {
  CommandDialogResponsive,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {Dispatch, SetStateAction} from "react";

interface IProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({open, setOpen}: IProps) => {
  return (
    <CommandDialogResponsive open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Find a meeting or agent" />
      <CommandList>
        <CommandItem>Test</CommandItem>
      </CommandList>
    </CommandDialogResponsive>
  );
};
