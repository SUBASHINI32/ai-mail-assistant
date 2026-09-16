import { EmailView } from "@/components/EmailView";

export default function EmailDetailPage({ params }: { params: { id: string } }) {
  return <EmailView id={params.id} />;
}
