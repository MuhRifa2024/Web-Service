import { useState } from "react";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import MahasiswaPage from "./pages/MahasiswaPages";
import DashboardPage from "./pages/DashboardPages";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pageTitle = activePage === "dashboard" ? "Dashboard" : "Data Mahasiswa";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Sidebar
        activePage={activePage}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectPage={(pageId) => {
          setActivePage(pageId);
          setIsSidebarOpen(false);
        }}
      />

      <div className="flex min-h-screen flex-col md:pl-72">
        <Header
          pageTitle={pageTitle}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 p-3 sm:p-4 md:p-6">
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            {activePage === "dashboard" ? <DashboardPage /> : <MahasiswaPage />}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}