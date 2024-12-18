import Sidebar from "@/components/layout/Sidebar";
import MainContent from "@/components/layout/MainContent";

export default function Home() {
  return (
    <main className="flex min-h-dvh h-dvh overflow-hidden">
      <Sidebar />
      <MainContent />
    </main>
  );
}
