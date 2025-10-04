import { Metadata } from "next";
import { redirect } from "next/navigation";

interface StoreLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    storeSlug: string;
  }>;
}

// Server-side store validation
async function validateStore(storeSlug: string) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_PRODUCTION ;
    
    const response = await fetch(`${API_BASE_URL}/stores/${storeSlug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache control for better performance
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error validating store:', error);
    return null;
  }
}

// ✅ Use generateMetadata for dynamic values with store validation
export async function generateMetadata(
  { params }: { params: Promise<{ storeSlug: string }> }
): Promise<Metadata> {
  const { storeSlug } = await params;
  
  // Validate store exists
  const store = await validateStore(storeSlug);
  
  if (!store) {
    // Store doesn't exist, return basic metadata
    return {
      title: "Store Not Found | SolStore",
      description: "The requested store could not be found."
    };
  }

  return {
    title: `${store.name} | SolStore`,
    description: store.description || `Shop at ${store.name} - A Web3 store powered by SolStore`,
    openGraph: {
      title: store.name,
      description: store.description || `Shop at ${store.name}`,
      images: store.banner ? [store.banner] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: store.name,
      description: store.description || `Shop at ${store.name}`,
      images: store.banner ? [store.banner] : [],
    }
  };
}

const StoreLayout = async ({ children, params }: StoreLayoutProps) => {
  const { storeSlug } = await params;
  
  // Validate store exists on server side
  const store = await validateStore(storeSlug);
  
  if (!store) {
    // Store doesn't exist, redirect to home page
    redirect('/');
  }

  return <div>{children}</div>;
};

export default StoreLayout;
