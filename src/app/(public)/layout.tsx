import type { PropsWithChildren } from "react";
import Header from "@/components/layout/header";

const PublicLayout = ({ children }: PropsWithChildren) => (
  <main className="mx-auto max-w-3xl px-4">
    <Header />
    {children}
  </main>
);

export default PublicLayout;
