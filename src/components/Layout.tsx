import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import FloatingMenu from "./FloatingMenu";
import ParticleBackground from "./ParticleBackground";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ParticleBackground />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingMenu />
    </div>
  );
};

export default Layout;
