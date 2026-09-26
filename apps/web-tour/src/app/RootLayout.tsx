import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLenis } from "@/hooks/useLenis";

export function RootLayout() {
  useLenis(); // Initialize smooth scroll globally

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="bottom-center"
        toastOptions={{
          classNames: {
            toast: "font-sans text-sm",
          },
        }}
      />
    </div>
  );
}