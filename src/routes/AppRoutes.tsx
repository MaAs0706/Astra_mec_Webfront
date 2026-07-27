import { Route, Routes } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Home } from "@/pages/Home";
import { Team } from "@/pages/Team";
import { ComingSoon } from "@/pages/ComingSoon";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<ComingSoon title="Events" />} />
        <Route path="/team" element={<Team />} />
        <Route path="/gallery" element={<ComingSoon title="Gallery" />} />
        <Route path="/reports" element={<ComingSoon title="Reports" />} />
        <Route path="/contact" element={<ComingSoon title="Contact" />} />
        <Route path="*" element={<ComingSoon title="Page not found" />} />
      </Route>
    </Routes>
  );
}
