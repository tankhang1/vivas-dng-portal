import { useRoute } from "wouter";
import StaffDetailPage from "./StaffDetailPage";

export default function StaffDetail() {
  const [, params] = useRoute("/staff/:id");

  return <StaffDetailPage staffId={params?.id} />;
}
