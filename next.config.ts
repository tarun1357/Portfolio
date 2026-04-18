import type { NextConfig } from "next";

/** Comma-separated hostnames, e.g. `192.168.1.16` when opening the site from another device on your LAN. */
const allowedDevOrigins = process.env.NEXT_ALLOWED_DEV_ORIGINS?.split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(allowedDevOrigins?.length
    ? { allowedDevOrigins }
    : {}),
};

export default nextConfig;
