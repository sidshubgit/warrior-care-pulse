import { cn } from "@/lib/utils";

export type RiskLevel = "green" | "amber" | "red";

interface RiskBadgeProps {
  risk: RiskLevel;
  className?: string;
}

const riskLabels = {
  green: "Low Risk",
  amber: "Moderate Risk", 
  red: "High Risk"
};

export const RiskBadge = ({ risk, className }: RiskBadgeProps) => {
  return (
    <span 
      className={cn(
        "risk-badge",
        risk === "green" && "risk-green",
        risk === "amber" && "risk-amber", 
        risk === "red" && "risk-red",
        className
      )}
    >
      {riskLabels[risk]}
    </span>
  );
};