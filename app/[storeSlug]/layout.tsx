import { Metadata } from "next";

interface StoreLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    storeSlug: string;
  }>;
}

// ✅ Use generateMetadata for dynamic values
export async function generateMetadata(
  { params }: { params: Promise<{ storeSlug: string }> }
): Promise<Metadata> {
  const { storeSlug } = await params;
  return {
    title: `${storeSlug} | Solstore`,
    description: `Store page for ${storeSlug}`
  };
}

const StoreLayout = ({ children }: StoreLayoutProps) => {
  return <div>{children}</div>;
};

export default StoreLayout;
