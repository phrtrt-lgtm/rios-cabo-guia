import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GuideSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
  printBreak?: boolean;
}

export const GuideSection = ({ id, title, children, className, printBreak }: GuideSectionProps) => {
  return (
    <section
      id={id}
      className={cn(
        "pt-10 md:pt-16 pb-8 md:pb-12 scroll-mt-20",
        printBreak && "page-break",
        className
      )}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8 md:mb-10">
          <h2 className="font-display text-3xl md:text-5xl font-light text-foreground tracking-tight leading-[1.05]">
            {title}
          </h2>
          <div className="mt-4 h-px w-16 bg-secondary" />
        </div>
        {children}
      </div>
    </section>
  );
};
