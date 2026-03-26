/**
 * PublicHeader - Header padronizado para paginas publicas
 * Usa tokens do design system
 */
import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const WA_URL = 'https://wa.me/5564993197555?text=Olá! Quero informações sobre ingressos para os parques.';

const NAV_LINKS = [
  { label: 'Ingressos', href: '/ingressos' },
  { label: 'Hoteis', href: '/hoteis' },
  { label: 'Promocoes', href: '/promocoes' },
  { label: 'Contato', href: '/contato' },
  { label: 'Sobre', href: '/sobre' },
];

interface PublicHeaderProps {
  variant?: 'light' | 'dark' | 'transparent';
  className?: string;
}

export function PublicHeader({ variant = 'light', className }: PublicHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const variantStyles = {
    light: {
      bg: 'bg-white',
      text: 'text-slate-700',
      textHover: 'hover:text-blue-600',
      logo: 'text-slate-900',
      border: 'border-b border-slate-100',
    },
    dark: {
      bg: 'bg-slate-900',
      text: 'text-slate-300',
      textHover: 'hover:text-white',
      logo: 'text-white',
      border: 'border-b border-slate-800',
    },
    transparent: {
      bg: 'bg-transparent',
      text: 'text-white/90',
      textHover: 'hover:text-white',
      logo: 'text-white',
      border: '',
    },
  };

  const styles = variantStyles[variant];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          styles.bg,
          styles.border,
          'shadow-sm',
          className
        )}
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-sm">
                  RSV
                </div>
                <span className={cn('font-bold text-lg', styles.logo)}>
                  Reservei<span className="text-orange-500">360</span>
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={cn(
                      'text-sm font-medium transition-colors cursor-pointer',
                      styles.text,
                      styles.textHover
                    )}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors"
              >
                <Phone size={16} />
                WhatsApp
              </a>
              <Link href="/ingressos">
                <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
                  Ver Ingressos
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={cn('md:hidden p-2 rounded-lg', styles.text)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100">
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-3 rounded-lg text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
              <div className="pt-4 space-y-3">
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-green-500 text-white font-semibold"
                >
                  <Phone size={18} />
                  Falar no WhatsApp
                </a>
                <Link href="/ingressos">
                  <button className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold">
                    Ver Ingressos
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
