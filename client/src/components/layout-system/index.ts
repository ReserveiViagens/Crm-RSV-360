/**
 * =============================================================================
 * RSV360 LAYOUT SYSTEM - EXPORTS
 * =============================================================================
 * FASE 1: Design Tokens & Layout System
 * 
 * Este arquivo exporta todos os shells e containers do sistema de padronizacao.
 * 
 * FAMILIAS:
 * - A: PublicPageShell (marketing, landing, home)
 * - B: CatalogPageShell (ingressos, hoteis, busca)
 * - C: AuthPageShell (login, cadastro)
 * - D: AppMobileShell (perfil, reservas, app cliente)
 * - E: AdminShell (dashboard, CRM, admin)
 * 
 * WRAPPERS:
 * - PageContainer: padding horizontal responsivo
 * - SectionContainer: spacing vertical entre secoes
 * =============================================================================
 */

// Wrappers Base
export { PageContainer } from './PageContainer';
export { SectionContainer } from './SectionContainer';

// Familia A: Public/Marketing
export { PublicPageShell, PublicSection } from './PublicPageShell';

// Familia B: Catalog/Commerce
export { CatalogPageShell, CatalogGrid } from './CatalogPageShell';

// Familia C: Auth
export { AuthPageShell } from './AuthPageShell';

// Familia D: App Mobile
export { AppMobileShell, AppMobileCard } from './AppMobileShell';

// Familia E: Admin/Dashboard
export { AdminShell, AdminPageHeader, AdminCard, useAdminShell } from './AdminShell';

// Types
export type { PageContainerProps } from './PageContainer';
export type { SectionContainerProps } from './SectionContainer';
export type { PublicPageShellProps, PublicSectionProps } from './PublicPageShell';
export type { CatalogPageShellProps, CatalogGridProps } from './CatalogPageShell';
export type { AuthPageShellProps } from './AuthPageShell';
export type { AppMobileShellProps, AppMobileCardProps } from './AppMobileShell';
export type { AdminShellProps, AdminPageHeaderProps, AdminCardProps } from './AdminShell';
