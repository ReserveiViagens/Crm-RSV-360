import { runCatalogSync } from "../server/services/catalog-sync.service.js";

runCatalogSync()
  .then((result) => {
    console.log(`[sync-catalog] Result:`, result);
    process.exit(0);
  })
  .catch((err) => {
    console.error("[sync-catalog] Error:", err);
    process.exit(1);
  });
