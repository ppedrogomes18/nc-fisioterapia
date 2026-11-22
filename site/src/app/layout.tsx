import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { clinica, textos } from "@/content/clinica";
import { confirmado } from "@/lib/pendente";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dominio = confirmado(clinica.site.dominio);
// Enquanto o domínio não é confirmado, usa o endereço que a Vercel/Netlify
// informam no build (só para as URLs absolutas da imagem OG; sem canonical).
const dominioProvisorio = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.URL;
const base = dominio ?? dominioProvisorio;

export const metadata: Metadata = {
  ...(base ? { metadataBase: new URL(base) } : {}),
  ...(dominio ? { alternates: { canonical: "/" } } : {}),
  title: textos.seo.titulo,
  description: textos.seo.descricao,
  applicationName: clinica.nome,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: clinica.nome,
    title: textos.seo.titulo,
    description: textos.seo.descricao,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: textos.seo.ogAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: textos.seo.titulo,
    description: textos.seo.descricao,
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#2E3623",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
