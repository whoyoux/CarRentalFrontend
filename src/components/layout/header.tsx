"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { i18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useAuthStore } from "@/stores/auth-store";
import { ThemeDropdown } from "../misc/theme-dropdown";
import { Button, buttonVariants } from "../ui/button";

const Header = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.accessToken);

  return (
    <header className="mb-6 flex w-full items-center justify-between border-b py-6">
      <Link href="/">
        <h1 className="font-medium">{i18n.app.name}</h1>
      </Link>
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <>
            <Button
              onClick={() =>
                logout(() => {
                  router.push("/");
                })
              }
              variant="outline"
            >
              {i18n.auth.logout}
            </Button>
            <Link
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" })
              )}
              href="/dashboard"
            >
              <User />
            </Link>
          </>
        ) : (
          <Link
            className={cn(buttonVariants({ variant: "outline" }))}
            href="/login"
          >
            {i18n.auth.login.submitButton}
          </Link>
        )}
        <ThemeDropdown />
      </div>
    </header>
  );
};

export default Header;
