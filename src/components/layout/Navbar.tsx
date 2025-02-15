import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Navbar() {
  return (
    <nav className="w-full bg-inherit transition-colors duration-200 ease-in-out">
      <div className="container p-4">
        <SidebarTrigger />
      </div>
    </nav>
  );
}
