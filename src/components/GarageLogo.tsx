
import { Settings, Wrench } from "lucide-react";

interface GarageLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const GarageLogo = ({ size = "md", className = "" }: GarageLogoProps) => {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      <Settings className="text-garage-primary absolute top-0 left-0" size={size === "sm" ? 20 : size === "md" ? 32 : 52} />
      <Wrench 
        className="text-garage-secondary absolute bottom-0 right-0" 
        size={size === "sm" ? 18 : size === "md" ? 28 : 46} 
        strokeWidth={2.5} 
        style={{ transform: "rotate(45deg)" }}
      />
    </div>
  );
};

export default GarageLogo;
