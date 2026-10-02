import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Poultry BAZAR",
    short_name: "Poultry BAZAR",
    description: "খামার থেকে সরাসরি মুরগী কেনাবেচা ও আজকের দর",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F5EF",
    theme_color: "#0F3D24",
    lang: "bn",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
