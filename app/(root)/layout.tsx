// src/components/Layout.tsx or similar
import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

// Import your new signOut action
import { isAuthenticated, signOut } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  // Redirect unauthenticated users
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout">
      {/* Added 'relative' to the nav for positioning the button */}
      <nav className="relative">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepWise</h2>
        </Link>
        
        {/* ADDED: Sign Out Button/Form in the top right */}
        <div className="absolute top-0 right-0 h-full flex items-center">
          <form action={signOut}>
            <button 
              type="submit" 
              className="px-2 py-1 text-white bg-grey-600 rounded-lg border hover:bg-blue-900 transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
        {/* END ADDED CODE */}
      </nav>

      {children}
    </div>
  );
};

export default Layout;