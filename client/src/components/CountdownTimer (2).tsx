import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  targetDate?: Date | string;
  endDate?: Date | string;
  onExpire?: () => void;
  label?: string;
  className?: string;
}

export function CountdownTimer({ targetDate, endDate, onExpire, label = "Expira em", className = "" }: CountdownTimerProps) {
  const resolvedDate = targetDate ?? endDate;
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    if (!resolvedDate) {
      setTimeLeft({ minutes: 0, seconds: 0, expired: true });
      return;
    }
    const target = new Date(resolvedDate).getTime();

    const update = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ minutes: 0, seconds: 0, expired: true });
        onExpire?.();
        return;
      }
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ minutes, seconds, expired: false });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [resolvedDate, onExpire]);

  if (timeLeft.expired) {
    return (
      <div data-testid="countdown-expired" className={`flex items-center gap-1 text-destructive text-xs ${className}`}>
        <Clock className="w-3 h-3" />
        <span>Expirado</span>
      </div>
    );
  }

  const isUrgent = timeLeft.minutes < 5;

  return (
    <div
      data-testid="countdown-timer"
      className={`flex items-center gap-1 text-xs ${isUrgent ? "text-destructive font-semibold" : "text-muted-foreground"} ${className}`}
    >
      <Clock className="w-3 h-3" />
      <span>
        {label}: {String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
