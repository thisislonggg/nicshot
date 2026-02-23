import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

export const SEO = ({
  title,
  description = "Secure, premium marketplace for competitive Valorant gamers. Verified sellers, instant delivery.",
  // Ganti URL di bawah dengan URL gambar banner default website Anda jika ada
  image = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop", 
  url = typeof window !== 'undefined' ? window.location.href : "https://nicshot-vault.com",
}: SEOProps) => {
  // Format judul agar selalu ada nama brand di belakangnya
  const siteTitle = `${title} | Nicshot.vault`;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter / Discord */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};