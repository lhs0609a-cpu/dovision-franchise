import { Badge } from "@/components/ui/badge";
import { INQUIRY_STATUS_LABELS, INQUIRY_STATUS_COLORS, type InquiryStatus } from "@/types";

export default function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <Badge variant="secondary" className={INQUIRY_STATUS_COLORS[status]}>
      {INQUIRY_STATUS_LABELS[status]}
    </Badge>
  );
}
