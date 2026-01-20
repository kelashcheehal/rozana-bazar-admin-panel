"use client";

import { cn } from "@/lib/utils";
import { Calendar, MoreHorizontal, Package } from "lucide-react";
import { useState } from "react";

const MOCK_TASKS = [
    { id: "1", title: "Order #1234", customer: "Alice Johnson", amount: "$120.00", status: "pending", date: "Oct 24" },
    { id: "2", title: "Order #1235", customer: "Bob Smith", amount: "$85.50", status: "pending", date: "Oct 24" },
    { id: "3", title: "Order #1230", customer: "Charlie Davis", amount: "$299.00", status: "processing", date: "Oct 23" },
    { id: "4", title: "Order #1228", customer: "Diana Prince", amount: "$45.00", status: "processing", date: "Oct 22" },
    { id: "5", title: "Order #1201", customer: "Ethan Hunt", amount: "$550.00", status: "completed", date: "Oct 20" },
    { id: "6", title: "Order #1199", customer: "Fiona Gallagher", amount: "$12.00", status: "completed", date: "Oct 19" },
];

const COLUMNS = [
    { id: "pending", title: "New Orders", color: "bg-yellow-100 text-yellow-800" },
    { id: "processing", title: "Processing", color: "bg-blue-100 text-blue-800" },
    { id: "completed", title: "Completed", color: "bg-green-100 text-green-800" },
];

export function KanbanBoard() {
    const [tasks, setTasks] = useState(MOCK_TASKS);
    const [draggedTask, setDraggedTask] = useState(null);

    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        // e.dataTransfer.setData("taskId", task.id);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, status) => {
        e.preventDefault();
        if (draggedTask) {
            setTasks(prev => prev.map(t =>
                t.id === draggedTask.id ? { ...t, status } : t
            ));
            setDraggedTask(null);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] overflow-x-auto pb-4">
            {COLUMNS.map((col) => (
                <div
                    key={col.id}
                    className="flex-1 min-w-[300px] bg-gray-50 dark:bg-zinc-900 rounded-lg p-4 border border-gray-200 dark:border-zinc-800 flex flex-col"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.id)}
                >
                    {/* Column Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className={cn("px-2 py-1 rounded-lg text-xs font-semibold", col.color)}>
                                {col.title}
                            </span>
                            <span className="text-gray-400 text-sm">
                                {tasks.filter(t => t.status === col.id).length}
                            </span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Tasks Container */}
                    <div className="flex-1 overflow-y-auto space-y-3">
                        {tasks.filter(t => t.status === col.id).map(task => (
                            <div
                                key={task.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, task)}
                                className="group bg-white dark:bg-zinc-800 p-4 rounded-lg border border-gray-100 dark:border-zinc-700 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all hover:border-[#D4A574]/50"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <span className="text-xs font-mono text-gray-500">{task.title}</span>
                                    <span className="text-sm font-semibold text-[#2C1810] dark:text-[#D4A574]">{task.amount}</span>
                                </div>
                                <div className="mb-3">
                                    <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">{task.customer}</h4>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 dark:border-zinc-700 pt-3 mt-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {task.date}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Package className="w-3 h-3" />
                                        Standard
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="mt-3 w-full py-2 flex items-center justify-center text-sm text-gray-400 hover:bg-gray-100 rounded-lg border border-dashed border-gray-200">
                        + Add Order
                    </button>
                </div>
            ))}
        </div>
    );
}
