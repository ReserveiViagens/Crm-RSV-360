type AnalyticsEvent =
  | "tickets_page_view"
  | "ticket_filter_change"
  | "ticket_card_open"
  | "ticket_add_to_cart"
  | "ticket_remove_from_cart"
  | "ai_combo_accept"
  | "ai_combo_dismiss"
  | "related_hotel_click"
  | "tickets_checkout_start"
  | "pix_checkout_view"
  | "pix_code_copy"
  | "pix_qr_visible"
  | "pix_payment_confirmed"
  | "pix_payment_expired"
  | "pix_payment_failed"
  | "tickets_success_view"
  | "ticket_download_click"
  | "support_whatsapp_click"
  | "related_offer_click"
  | "wizard_confirm"
  | "date_selected"
  | "category_expand"
  | "checkout_view"
  | "checkout_step_email_done"
  | "checkout_step_dados_done"
  | "checkout_card_simulated"
  | "checkout_google_click"
  | "checkout_apple_click"
  | "apple_pay_click"
  | "cupom_apply_attempt";

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
  try {
    const entry = { event, properties, timestamp: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem("rsv_analytics") ?? "[]") as unknown[];
    existing.push(entry);
    if (existing.length > 200) existing.splice(0, existing.length - 200);
    localStorage.setItem("rsv_analytics", JSON.stringify(existing));
    if (import.meta.env.DEV) {
      console.log("[RSV Analytics]", event, properties);
    }
  } catch {
  }
}
