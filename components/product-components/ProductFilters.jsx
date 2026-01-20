"use client";

import { Search, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
const PAGE_SIZE = 25;

export default function ProductFilters() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    // Default search term from URL
    const defaultSearch = searchParams.get("search") || "";

    const handleSearch = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }
        // Reset page on search
        params.set("page", "1");
        replace(`${window.location.pathname}?${params.toString()}`);
    }, 300);

    const handleStatusChange = (status) => {
        const params = new URLSearchParams(searchParams);
        if (status && status !== "all") {
            params.set("status", status);
        } else {
            params.delete("status");
        }
        params.set("page", "1");
        replace(`${window.location.pathname}?${params.toString()}`);
    };

    const handleLimitChange = (limit) => {
        const params = new URLSearchParams(searchParams);
        params.set("limit", limit);
        replace(`${window.location.pathname}?${params.toString()}`);
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                    placeholder="Search products..."
                    className="pl-8 bg-white border-gray-200"
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={defaultSearch}
                />
            </div>
            <div className="flex gap-2">
                <Select
                    onValueChange={handleStatusChange}
                    defaultValue={searchParams.get("status") || "all"}
                >
                    <SelectTrigger className="w-[180px] bg-white border-gray-200">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
