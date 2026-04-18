/**
 * PublicFooter - Footer padronizado para paginas publicas
 * Design premium e comercial
 */
import { Link } from 'wouter';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';

const WA_URL = 'https://wa.me/5564993197555';

const FOOTER_LINKS = {
  produtos: [
    { label: 'Ingressos', href: '/ingressos' },
    { label: 'Hoteis', href: '/hoteis' },
    { label: 'Pacotes', href: '/pacotes' },
    { label: 'Promocoes', href: '/promocoes' },
  ],
  empresa: [
    { label: 'Sobre nos', href: '/sobre' },
    { label: 'Contato', href: '/contato' },
    { label: 'Blog', href: '/blog' },
    { label: 'Trabalhe Conosco', href: '/carreiras' },
  ],
  suporte: [
    { label: 'Central de Ajuda', href: '/ajuda' },
    { label: 'Politica de Privacidade', href: '/privacidade' },
    { label: 'Termos de Uso', href: '/termos' },
    { label: 'FAQ', href: '/faq' },
  ],
};

interface PublicFooterProps {
  className?: string;
}

export function PublicFooter({ className }: PublicFooterProps) {
  return (
    <footer className={cn('bg-slate-900 text-white', className)}>
      {/* CTA Banner */}
      <div className="border-b border-slate-800">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white">
                Pronto para sua proxima aventura?
              </h3>
              <p className="mt-1 text-slate-400">
                Encontre os melhores precos em ingressos e hoteis
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
              >
                <Phone size={18} />
                Falar no WhatsApp
              </a>
              <Link href="/ingressos">
                <button className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors">
                  Ver Ofertas
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold">
                RSV
              </div>
              <span className="font-bold text-xl text-white">
                Reservei<span className="text-orange-500">360</span>
              </span>
            </div>
            <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-xs">
              Sua plataforma completa para reservas de ingressos, hoteis e pacotes
              em Caldas Novas e Rio Quente.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-white mb-4">Produtos</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.produtos.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Empresa</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.empresa.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Suporte</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.suporte.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
              <a
                href="tel:+5564993197555"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone size={16} />
                (64) 99319-7555
              </a>
              <a
                href="mailto:contato@reservei360.com.br"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail size={16} />
                contato@reservei360.com.br
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                Caldas Novas, GO
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>2024 Reservei360. Todos os direitos reservados.</p>
            <p>CNPJ: 00.000.000/0001-00</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
