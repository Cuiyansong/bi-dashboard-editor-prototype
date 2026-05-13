/**
 * Downloads Figma MCP asset URLs into public/figma/{uuid}.png.
 * Run from project root: npm run download:figma-assets
 * Then add to `.env.local`: VITE_FIGMA_ASSETS_LOCAL=1
 */
import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { get } from "node:https";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "figma");

const uuids = [
  "b12f332e-e799-4e6f-961b-ab68b3ba6942",
  "4dae318b-f0ad-4cd7-a584-16bbd152ab6c",
  "f5c9e0d0-fa42-41f6-9ba4-2c8c221529d6",
  "203df6d3-567f-40cf-927a-3b337522639a",
  "b4104387-9e06-4895-8d25-0f31dbf49090",
  "27ffaed8-7b3a-4e78-b655-05b1e8bc4f75",
  "e50f6d51-281b-484c-a9de-a4da07ad5193",
  "ecbab4da-04ae-4388-bc26-23281616e856",
  "088195b2-da4e-4649-8160-2dd19098ef36",
  "c0d7774c-e52b-4f10-8ecc-21b08620ec3e",
  "440c9b53-bac3-48c9-ab02-3d18e073ea0a",
  "3e42bda7-a2ba-4982-a60d-a2e84782b680",
  "48d6a383-d984-4d1b-9904-0c261263a040",
  "afbff5d9-fada-4a92-b479-23fb4cccf60e",
  "3148f21c-1060-4c19-88ad-e30d6808f41d",
  "953c160d-6ce4-4235-a3ab-68ce39fbb405",
  "0e88f048-6c2f-435f-a633-a231581fb914",
  "d8f60d19-ec55-438c-a3b6-0a90e5abf0f0",
  "ba01a7e5-820a-4c07-bbc3-c5652d975c8d",
  "9c946f0e-3eff-47ed-b8d8-7d2bed68e5d9",
  "cabf812d-0475-4c33-b29e-ec6e3217f279",
  "f62da971-f34d-4770-a7a1-d5e6488a3b8b",
  "d2f511eb-9181-4ac1-900b-bed9394afd4b",
  "87bf2fa0-e712-45d1-9f63-f7d423f74701",
  "77afe347-5818-4bc3-b34d-bf0bb453765c",
  "5ed299fb-3bac-4c7c-83b4-b616f8076498",
  "c0c13c83-4e2c-4d77-ae55-29856159fc0e",
  "8e25ee18-fdc0-4ce2-b70e-d450e920ce2f",
  "35387b90-5209-4206-aa41-2927259ddb13",
  "c5215c9e-25ff-4462-8a67-1255a3aa84b1",
  "b743a82f-c190-40e2-a42d-31267ce34d41",
  "dac5de42-cfa0-4b2e-a8a6-b1290bf6f584",
  "8d5d0ee5-8d47-4953-9a07-3bb7ad8ca2da",
  "cf1dfc7f-0bd7-4d96-8765-2a2fe77c35e2",
  "b30e2f08-c163-4c2e-9e28-c73683003ad4",
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    get(url, (res) => {
      if (res.statusCode && res.statusCode >= 400) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", reject);
  });
}

await mkdir(outDir, { recursive: true });
for (const id of uuids) {
  const url = `https://www.figma.com/api/mcp/asset/${id}`;
  const dest = join(outDir, `${id}.png`);
  process.stdout.write(`${id} … `);
  try {
    await download(url, dest);
    process.stdout.write("ok\n");
  } catch (e) {
    process.stderr.write(`fail (${e})\n`);
    process.exitCode = 1;
  }
}
