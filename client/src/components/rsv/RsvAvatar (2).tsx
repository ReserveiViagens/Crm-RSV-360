import * as React from "react";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export type RsvAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface RsvAvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: RsvAvatarSize;
  badge?: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

const sizeMap: Record<RsvAvatarSize, { outer: string; text: string; icon: string }> = {
  xs: { outer: "w-6 h-6", text: "text-[10px]", icon: "w-3 h-3" },
  sm: { outer: "w-8 h-8", text: "text-xs", icon: "w-4 h-4" },
  md: { outer: "w-10 h-10", text: "text-sm", icon: "w-5 h-5" },
  lg: { outer: "w-12 h-12", text: "text-base", icon: "w-6 h-6" },
  xl: { outer: "w-16 h-16", text: "text-xl", icon: "w-8 h-8" },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function RsvAvatar({
  src,
  alt,
  name,
  size = "md",
  badge,
  className,
  "data-testid": testId = "rsv-avatar",
}: RsvAvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  const s = sizeMap[size];
  const initials = name ? getInitials(name) : null;

  return (
    <span
      data-testid={testId}
      className={cn("relative inline-flex shrink-0", s.outer, className)}
    >
      <span
        className={cn(
          "flex items-center justify-center w-full h-full rounded-full overflow-hidden",
          "bg-gradient-to-br from-blue-700 to-blue-500 text-white font-semibold select-none",
          s.text
        )}
      >
        {src && !imgError ? (
          <img
            data-testid={`${testId}-img`}
            src={src}
            alt={alt ?? name ?? "Avatar"}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : initials ? (
          <span data-testid={`${testId}-initials`}>{initials}</span>
        ) : (
          <User
            data-testid={`${testId}-fallback`}
            className={cn(s.icon, "text-white/80")}
          />
        )}
      </span>
      {badge && (
        <span
          data-testid={`${testId}-badge`}
          className="absolute -bottom-0.5 -right-0.5"
        >
          {badge}
        </span>
      )}
    </span>
  );
}

export interface RsvAvatarGroupProps {
  avatars: Pick<RsvAvatarProps, "src" | "alt" | "name">[];
  max?: number;
  size?: RsvAvatarSize;
  className?: string;
  "data-testid"?: string;
}

export function RsvAvatarGroup({
  avatars,
  max = 4,
  size = "sm",
  className,
  "data-testid": testId = "rsv-avatar-group",
}: RsvAvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - max;
  const s = sizeMap[size];

  return (
    <div
      data-testid={testId}
      className={cn("flex items-center", className)}
    >
      {visible.map((a, i) => (
        <span
          key={i}
          style={{ zIndex: visible.length - i, marginLeft: i === 0 ? 0 : "-8px" }}
        >
          <RsvAvatar
            {...a}
            size={size}
            data-testid={`${testId}-avatar-${i}`}
            className="ring-2 ring-[var(--surface-card)]"
          />
        </span>
      ))}
      {overflow > 0 && (
        <span
          data-testid={`${testId}-overflow`}
          style={{ marginLeft: "-8px" }}
          className={cn(
            "flex items-center justify-center rounded-full ring-2 ring-[var(--surface-card)]",
            "bg-muted text-muted-foreground font-semibold border border-border",
            s.outer,
            s.text
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
