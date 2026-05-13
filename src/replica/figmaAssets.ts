/**
 * Figma MCP asset URLs (~7d TTL). Refresh UUIDs via get_design_context if needed.
 * Left panel `2:7393` catalog uses cached MCP export for `2:7361` (see leftLibraryCatalog.ts).
 * Offline: run `npm run download:figma-assets`, then `.env.local` with `VITE_FIGMA_ASSETS_LOCAL=1`
 * so Vite serves copies from public/figma/{uuid}.png.
 */
const base = "https://www.figma.com/api/mcp/asset";

const useLocal = import.meta.env.VITE_FIGMA_ASSETS_LOCAL === "1";

function mcp(uuid: string): string {
  return useLocal ? `/figma/${uuid}.png` : `${base}/${uuid}`;
}

export const figmaAssets = {
  header: {
    v: mcp("b12f332e-e799-4e6f-961b-ab68b3ba6942"),
    group: mcp("4dae318b-f0ad-4cd7-a584-16bbd152ab6c"),
    v1: mcp("f5c9e0d0-fa42-41f6-9ba4-2c8c221529d6"),
    v2: mcp("203df6d3-567f-40cf-927a-3b337522639a"),
    v3: mcp("b4104387-9e06-4895-8d25-0f31dbf49090"),
    v4: mcp("27ffaed8-7b3a-4e78-b655-05b1e8bc4f75"),
    v5: mcp("e50f6d51-281b-484c-a9de-a4da07ad5193"),
    v6: mcp("ecbab4da-04ae-4388-bc26-23281616e856"),
    v7: mcp("088195b2-da4e-4649-8160-2dd19098ef36"),
    v8: mcp("c0d7774c-e52b-4f10-8ecc-21b08620ec3e"),
  },
  toolbar: {
    v: mcp("440c9b53-bac3-48c9-ab02-3d18e073ea0a"),
    v1: mcp("3e42bda7-a2ba-4982-a60d-a2e84782b680"),
    v2: mcp("48d6a383-d984-4d1b-9904-0c261263a040"),
    v3: mcp("afbff5d9-fada-4a92-b479-23fb4cccf60e"),
    v4: mcp("3148f21c-1060-4c19-88ad-e30d6808f41d"),
    v5: mcp("953c160d-6ce4-4235-a3ab-68ce39fbb405"),
    v6: mcp("0e88f048-6c2f-435f-a633-a231581fb914"),
    v7: mcp("d8f60d19-ec55-438c-a3b6-0a90e5abf0f0"),
    v8: mcp("ba01a7e5-820a-4c07-bbc3-c5652d975c8d"),
    v9: mcp("9c946f0e-3eff-47ed-b8d8-7d2bed68e5d9"),
    v10: mcp("cabf812d-0475-4c33-b29e-ec6e3217f279"),
  },
  leftSprite: mcp("f62da971-f34d-4770-a7a1-d5e6488a3b8b"),
  leftUi: {
    v: mcp("d2f511eb-9181-4ac1-900b-bed9394afd4b"),
    v1: mcp("87bf2fa0-e712-45d1-9f63-f7d423f74701"),
    v2: mcp("77afe347-5818-4bc3-b34d-bf0bb453765c"),
  },
  canvas: {
    bgLower: mcp("5ed299fb-3bac-4c7c-83b4-b616f8076498"),
    bgUpper: mcp("c0c13c83-4e2c-4d77-ae55-29856159fc0e"),
    watermark: mcp("8e25ee18-fdc0-4ce2-b70e-d450e920ce2f"),
    snapshot: mcp("35387b90-5209-4206-aa41-2927259ddb13"),
    v: mcp("c5215c9e-25ff-4462-8a67-1255a3aa84b1"),
    v1: mcp("b743a82f-c190-40e2-a42d-31267ce34d41"),
    v2: mcp("dac5de42-cfa0-4b2e-a8a6-b1290bf6f584"),
    v3: mcp("8d5d0ee5-8d47-4953-9a07-3bb7ad8ca2da"),
    v4: mcp("cf1dfc7f-0bd7-4d96-8765-2a2fe77c35e2"),
    v5: mcp("b30e2f08-c163-4c2e-9e28-c73683003ad4"),
  },
} as const;
