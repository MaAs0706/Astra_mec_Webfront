import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParallaxStars } from "@/components/common/ParallaxStars";

export function MainLayout() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-space-black">
      <div className="pointer-events-none fixed inset-0 z-0">
        <ParallaxStars />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
