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
        "pt-12 md:pt-16 pb-6 md:pb-8 scroll-mt-20",
        printBreak && "page-break",
        className
      )}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 border-b-2 border-secondary pb-4">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
};
