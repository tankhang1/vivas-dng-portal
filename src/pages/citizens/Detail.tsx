import { useRoute } from "wouter";
import CitizenDetailPage from "./CitizenDetailPage";

export default function CitizenDetail() {
  const [, params] = useRoute("/citizens/:id");

  return <CitizenDetailPage citizenId={params?.id} />;
}
