import { Oxygen } from "next/font/google";
const oxygen = Oxygen({ subsets: ["latin"], weight: ["300"] });

/// page left content Wrapper
export default function MainLayout({
  children,
  padding,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}) {
  return (
    <main
      style={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        padding: `${!padding ? "1rem" : padding}`,
      }}
      className={className ? className : oxygen.className}
    >
      {children}
    </main>
  );
}
