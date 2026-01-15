"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  Breadcrumb as ShadBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function AdminBreadcrumb({ items = [] }) {
  return (
    <ShadBreadcrumb className="mb-6">
      <BreadcrumbList>
        {/* Home / Dashboard */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/admin/dashboard"
              className="hover:text-[#D4A574] transition-colors"
            >
              Dashboard
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink asChild>
                  <Link
                    href={item.href}
                    className="hover:text-[#D4A574] transition-colors"
                  >
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-[#2C1810] font-medium truncate">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </ShadBreadcrumb>
  );
}
