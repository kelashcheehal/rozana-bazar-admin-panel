"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { cn } from "@/lib/utils";
import { Bot, Loader2, Send, Sparkles, Trash2, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SUGGESTIONS = [
    "💰 Total Revenue?",
    "📦 Recent Orders?",
    "👥 New Customers?",
    "📈 Sales Trend?",
];

export function AIAssistant() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hello! I'm connected to your store's live data. How can I help you?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    // Fetch Real Data
    const { data } = useDashboardStats();
    const stats = data?.stats;
    const recentOrders = data?.recentOrders;

    useEffect(() => {
        // Auto-scroll to bottom
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, open]);

    const processQuery = async (query) => {
        const q = query.toLowerCase();
        let response = "I'm not sure about that. Try asking about revenue, orders, or customers.";

        if (!stats) {
            return "I'm still syncing with the dashboard. Please try again in a moment.";
        }

        if (q.includes("sales") || q.includes("revenue") || q.includes("income")) {
            response = `Your total revenue is **${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.revenue.value)}**. That's a ${stats.revenue.change} change compared to last month.`;
        }
        else if (q.includes("order") || q.includes("orders")) {
            const count = stats.orders.value;
            const recent = recentOrders?.slice(0, 3).map(o => `${o.id} (${o.amount})`).join(", ");
            response = `You have **${count} total orders**. \n\nThe 3 most recent are: ${recent || "None generated yet"}.`;
        }
        else if (q.includes("customer") || q.includes("user")) {
            response = `You have **${stats.customers.value} total customers** and **${stats.active.value}** are active right now.`;
        }
        else if (q.includes("product") || q.includes("inventory")) {
            response = `You have **${stats.productsCount} products** listed in your catalog.`;
        }
        else if (q.includes("hello") || q.includes("hi")) {
            response = "Hello! I'm ready to analyze your shop's performance.";
        }

        return response;
    };

    const handleSubmit = async (e, overrideInput) => {
        e?.preventDefault();
        const query = overrideInput || input;
        if (!query.trim()) return;

        const userMsg = { role: "user", content: query };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        // Simulate "thinking" delay for realism
        setTimeout(async () => {
            const responseText = await processQuery(query);
            setMessages((prev) => [...prev, { role: "assistant", content: responseText }]);
            setIsLoading(false);
        }, 1000);
    };

    const handleClear = () => {
        setMessages([{ role: "assistant", content: "Chat cleared. What else can I check for you?" }]);
    };

    return (
        <>
            {/* Floating Trigger Button */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 right-6 z-50 h-14 w-14 bg-[#2C1810] text-[#D4A574] rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 border-4 border-[#D4A574]/20 animate-bounce-slow"
                >
                    <Sparkles className="w-6 h-6" />
                </button>
            )}

            {/* Chat Window */}
            {open && (
                <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] bg-white dark:bg-zinc-900 rounded-lg shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">

                    {/* Header */}
                    <div className="bg-[#2C1810] p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#D4A574]/20 p-2 rounded-lg">
                                <Bot className="w-5 h-5 text-[#D4A574]" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Admin Copilot</h3>
                                <p className="text-xs text-gray-300 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    Live Data
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleClear}
                                className="text-gray-400 hover:text-white transition-colors"
                                title="Clear Chat"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 bg-gray-50 dark:bg-zinc-900/50 overflow-y-auto custom-scrollbar" ref={scrollRef}>
                        <div className="flex flex-col gap-4">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex gap-3 max-w-[85%]",
                                        msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                        msg.role === "assistant" ? "bg-[#2C1810] text-[#D4A574]" : "bg-gray-200 text-gray-600"
                                    )}>
                                        {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                    </div>
                                    <div
                                        className={cn(
                                            "p-3 rounded-lg text-sm shadow-sm whitespace-pre-wrap",
                                            msg.role === "assistant"
                                                ? "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                                                : "bg-[#2C1810] text-white rounded-tr-none"
                                        )}
                                    >
                                        {/* Simple markdown bold parsing */}
                                        {msg.content.split("**").map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3 max-w-[85%]">
                                    <div className="w-8 h-8 rounded-full bg-[#2C1810] text-[#D4A574] flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-gray-100 rounded-tl-none flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                        <span className="text-xs text-gray-400">Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div className="px-4 pb-2 bg-white dark:bg-zinc-900 flex gap-2 overflow-x-auto no-scrollbar">
                        {SUGGESTIONS.map(s => (
                            <button
                                key={s}
                                onClick={(e) => handleSubmit(e, s.replace(/[^a-zA-Z ]/g, ""))}
                                className="text-xs border rounded-full px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 whitespace-nowrap transition-colors"
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
                        <form onSubmit={handleSubmit} className="relative">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask your Copilot..."
                                className="pr-12 py-6 bg-gray-50 border-gray-200 focus-visible:ring-[#2C1810]"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 top-2 h-8 w-8 bg-[#2C1810] hover:bg-[#3e2216] text-[#D4A574]"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
