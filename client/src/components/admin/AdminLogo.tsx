/**
 * =============================================================================
 * AdminLogo - Logo do painel admin
 * =============================================================================
 */

import { Link } from 'wouter';
import { Plane } from 'lucide-react';

interface AdminLogoProps {
  collapsed?: boolean;
}

export function AdminLogo({ collapsed = false }: AdminLogoProps) {
  return (
    <Link href="/admin">
      <a className="flex items-center gap-2 text-slate-900 hover:text-blue-600 transition-colors">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
          <Plane className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight">RSV360</span>
            <span className="text-xs text-slate-500 leading-tight">Admin</span>
          </div>
        )}
      </a>
    </Link>
  );
}
