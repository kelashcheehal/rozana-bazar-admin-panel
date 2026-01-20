"use client";

import { KanbanBoard } from "@/components/admin/kanban-board";

export default function KanbanPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-[#2C1810]">
                    Order Fulfillment
                </h1>
                <p className="text-gray-500">drag and drop orders to update their status.</p>

                {/* Kanban Board */}
                <KanbanBoard />
            </div>
        </div>
    );
}
