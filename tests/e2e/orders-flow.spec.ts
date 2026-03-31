import { test, expect, APIRequestContext, Page } from "@playwright/test";

type CreateOrderResponse = {
  transactionId: string;
  status: string;
  qrCodeBase64: string;
  copyPasteCode: string;
  expirationDate: string;
  totalAmount: number;
  originalTotal: number;
  totalSavings: number;
  isCombo: boolean;
  demo: boolean;
  voucherId?: string;
  voucherToken?: string;
};

type CustomerFixture = {
  name: string;
  email: string;
  phone: string;
  cpf: string;
};

function buildCustomerFixture(label: string): CustomerFixture {
  const suffix = `${label}-${Date.now()}`;
  return {
    name: `E2E ${label} ${Date.now()}`,
    email: `e2e+${suffix}@example.com`,
    phone: "62999999999",
    cpf: "12345678909",
  };
}

function webhookHeaders(): Record<string, string> {
  if (process.env.WEBHOOK_SECRET) {
    return { "x-api-key": process.env.WEBHOOK_SECRET };
  }
  return {};
}

async function createOrder(
  request: APIRequestContext,
  label: string,
): Promise<CreateOrderResponse & { customer: CustomerFixture }> {
  const customer = buildCustomerFixture(label);

  const response = await request.post("/api/payments/tickets/create", {
    data: {
      items: [
        {
          ticketId: "hot-park",
          quantity: 1,
        },
      ],
      customer,
    },
  });

  expect(response.ok()).toBeTruthy();

  const json = (await response.json()) as CreateOrderResponse;

  expect(json.transactionId).toBeTruthy();
  expect(json.status).toBeTruthy();

  return {
    ...json,
    customer,
  };
}

async function setOrderStatus(
  request: APIRequestContext,
  transactionId: string,
  status: "paid" | "failed" | "expired",
) {
  const response = await request.post("/api/webhooks/tickets", {
    headers: webhookHeaders(),
    data: {
      transactionId,
      status,
    },
  });

  expect(response.ok()).toBeTruthy();
}

async function openOrderPage(page: Page, orderId: string) {
  await page.goto(`/pedido/${encodeURIComponent(orderId)}`);
  await expect(page.getByTestId("card-order-status")).toBeVisible();
}

test.describe.configure({ mode: "serial" });

test.describe("Fluxo E2E de pedidos", () => {
  test("pedido PENDING evolui para APPROVED e exibe voucher", async ({
    page,
    request,
  }) => {
    const order = await createOrder(request, "approved");

    await openOrderPage(page, order.transactionId);

    await expect(page.getByTestId("card-order-status")).toContainText(
      "Aguardando pagamento",
    );
    await expect(page.getByTestId("card-pix-pending-status")).toBeVisible();
    await expect(page.getByTestId("button-copy-order-link")).toBeVisible();

    await setOrderStatus(request, order.transactionId, "paid");

    await page.reload();

    await expect(page.getByTestId("card-order-status")).toContainText(
      "Pagamento aprovado",
    );
    await expect(page.getByText("Voucher do pedido")).toBeVisible();
  });

  test("pedido FAILED permite retry, restaura carrinho e mantém buyer prefill", async ({
    page,
    request,
  }) => {
    const order = await createOrder(request, "failed");

    await setOrderStatus(request, order.transactionId, "failed");

    await openOrderPage(page, order.transactionId);

    await expect(page.getByTestId("card-order-status")).toContainText(
      "Falha no pagamento",
    );

    const retryLink = page.getByRole("link", { name: "Refazer pedido" });
    await expect(retryLink).toBeVisible();
    await expect(retryLink).toHaveAttribute(
      "href",
      new RegExp(
        `retry=1.*restore=1.*fromOrder=${order.transactionId}.*status=FAILED`,
      ),
    );

    await retryLink.click();

    await expect(page).toHaveURL(/\/ingressos/);
    await expect(page.getByText(/Carrinho restaurado/i)).toBeVisible();

    const continueCheckout = page.getByTestId("button-retry-continue-checkout");

    await expect(continueCheckout).toBeVisible();
    await continueCheckout.click();

    await expect(page).toHaveURL(/\/ingressos(\/checkout|\-checkout)/);

    // Verifica prefill no step de e-mail
    await expect(page.getByTestId("input-email")).toHaveValue(order.customer.email);
    await expect(page.getByTestId("button-next-email")).toBeVisible();
    await page.getByTestId("button-next-email").click();

    // Verifica prefill no step de dados
    const nameParts = order.customer.name.trim().split(" ").filter(Boolean);
    const prefillFirstName = nameParts.length > 0 ? nameParts[0] : "";
    const prefillLastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    await expect(page.getByTestId("input-firstName")).toHaveValue(prefillFirstName);
    await expect(page.getByTestId("input-lastName")).toHaveValue(prefillLastName);
    await expect(page.getByTestId("input-phone")).toHaveValue(order.customer.phone);
    await expect(page.getByTestId("input-cpf")).toHaveValue(order.customer.cpf);
  });

  test("pedido EXPIRED permite retry contextual e restaura carrinho", async ({
    page,
    request,
  }) => {
    const order = await createOrder(request, "expired");

    await setOrderStatus(request, order.transactionId, "expired");

    await openOrderPage(page, order.transactionId);

    await expect(page.getByTestId("card-order-status")).toContainText(
      "Pagamento expirado",
    );

    const retryLink = page.getByRole("link", { name: "Refazer pedido" });
    await expect(retryLink).toBeVisible();
    await expect(retryLink).toHaveAttribute(
      "href",
      new RegExp(
        `retry=1.*restore=1.*fromOrder=${order.transactionId}.*status=EXPIRED`,
      ),
    );

    await retryLink.click();

    await expect(page).toHaveURL(/\/ingressos/);
    await expect(page.getByText(/pedido expirado/i)).toBeVisible();
    await expect(page.getByText(/Carrinho restaurado/i)).toBeVisible();
  });
});