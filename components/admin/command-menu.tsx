"use client";

import { useClerk } from "@clerk/nextjs";
import {
  Box,
  FileText,
  LayoutDashboard,
  LogOut,
  Moon,
  ShoppingCart,
  Sun,
  Users
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { supabase } from "@/lib/supabaseClient";

type Product = {
  id: string;
  name: string;
};

type Order = {
  id: string;
  customer_name: string;
  amount: number;
};

type SearchResults = {
  products: Product[];
  orders: Order[];
};

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResults>({ products: [], orders: [] });
  const router = useRouter();
  const { setTheme } = useTheme();
  const { signOut } = useClerk();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    const openMenu = () => setOpen(true);
    document.addEventListener("keydown", down);
    document.addEventListener("open-command-menu", openMenu);
    
    return () => {
        document.removeEventListener("keydown", down);
        document.removeEventListener("open-command-menu", openMenu);
    }
  }, []);

  // Search Effect
  React.useEffect(() => {
    if (!query) {
        setResults({ products: [], orders: [] });
        return;
    }

    const timer = setTimeout(async () => {
        // Search Products
        const { data: products } = await supabase
            .from('products')
            .select('id, name')
            .ilike('name', `%${query}%`)
            .limit(3);

        // Search Orders
        const { data: orders } = await supabase
            .from('orders')
            .select('id, customer_name, amount')
            .or(`id.eq.${Number(query) || 0},customer_name.ilike.%${query}%`) // Handle numeric ID search carefully
            .limit(3);

        setResults({
            products: products || [],
            orders: orders || []
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Search products, orders, or type a command..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {/* Dynamic Search Results */}
        {results.products.length > 0 && (
            <CommandGroup heading="Products">
                {results.products.map((product) => (
                    <CommandItem key={product.id} onSelect={() => runCommand(() => router.push(`/dashboard/products/edit-product/${product.id}`))}>
                        <Box className="mr-2 h-4 w-4" />
                        <span>{product.name}</span>
                    </CommandItem>
                ))}
            </CommandGroup>
        )}
        
        {results.orders.length > 0 && (
            <CommandGroup heading="Orders">
                {results.orders.map((order) => (
                    <CommandItem key={order.id} onSelect={() => runCommand(() => router.push(`/dashboard/orders`))}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        <span>Order #{order.id} - {order.customer_name}</span>
                    </CommandItem>
                ))}
            </CommandGroup>
        )}

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/orders"))}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Orders</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/products"))}>
            <Box className="mr-2 h-4 w-4" />
            <span>Products</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/customers"))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Customers</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/analytics"))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Analytics</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="System">
          <CommandItem onSelect={() => runCommand(() => signOut())} className="text-red-500 aria-selected:text-red-500">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log Out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
