import { Badge } from "@/components/ui/badge";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

interface Props {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function StatusBadge({
  active,
  activeLabel = "Visible",
  inactiveLabel = "Hidden",
}: Props) {
  return active ? (
    <Badge variant="default" className="gap-1">
      <RiEyeLine className="h-3 w-3" />
      {activeLabel}
    </Badge>
  ) : (
    <Badge variant="secondary" className="gap-1">
      <RiEyeOffLine className="h-3 w-3" />
      {inactiveLabel}
    </Badge>
  );
}
