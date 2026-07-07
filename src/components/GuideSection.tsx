import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GuideSectionProps {
  id: string;
  title: string;
  number?: string;
  label?: string;
  children: ReactNode;
  className?: string;
  printBreak?: boolean;
}

export const GuideSection = ({
  id,
  title,
  number,
  label,
  children,
  className,
  printBreak,
}: GuideSectionProps) => {
  return (
    <section
      id={id}
      className={cn("rios-section scroll-mt-24", printBreak && "page-break", className)}
    >
      <div className="rios-section-inner">
        <header className="rios-section-head">
          {number && <span className="rios-section-num">{number}</span>}
          {label && <span className="rios-section-label">{label}</span>}
          <h2 className="rios-section-title">{title}</h2>
        </header>
        {children}
      </div>
      <hr className="rios-section-divider" />
    </section>
  );
};
