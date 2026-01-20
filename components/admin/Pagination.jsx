"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
    Pagination as ShadPagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function Pagination({ totalPages }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    const createPageURL = (pageNumber) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <ShadPagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={createPageURL(currentPage - 1)}
                        aria-disabled={currentPage <= 1}
                        tabIndex={currentPage <= 1 ? -1 : undefined}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            href={createPageURL(page)}
                            isActive={page === currentPage}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationNext
                        href={createPageURL(currentPage + 1)}
                        aria-disabled={currentPage >= totalPages}
                        tabIndex={currentPage >= totalPages ? -1 : undefined}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </ShadPagination>
    );
}
