import * as React from "react"
import { X } from "lucide-react"

const SheetContext = React.createContext<{ open: boolean; onOpenChange: (open: boolean) => void } | null>(null)

export const Sheet = ({ children, open, onOpenChange }: { children: React.ReactNode; open: boolean; onOpenChange: (open: boolean) => void }) => {
    return (
        <SheetContext.Provider value={{ open, onOpenChange }}>
            {children}
        </SheetContext.Provider>
    )
}

export const SheetTrigger = ({ children }: { asChild?: boolean; children: React.ReactNode }) => {
    const context = React.useContext(SheetContext)
    if (!context) throw new Error("SheetTrigger used outside Sheet")

    return (
        <div onClick={() => context.onOpenChange(true)} className="cursor-pointer">
            {children}
        </div>
    )
}

export const SheetContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const context = React.useContext(SheetContext)
    if (!context) throw new Error("SheetContent used outside Sheet")

    if (!context.open) return null

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-50 bg-black/50 transition-opacity"
                onClick={() => context.onOpenChange(false)}
            />
            {/* Sidebar - sliding in from right */}
            <div className={`fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm ${className || ''}`}>
                <button
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100"
                    onClick={() => context.onOpenChange(false)}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
                {children}
            </div>
        </>
    )
}

export const SheetHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={`flex flex-col space-y-2 text-center sm:text-left ${className || ''}`}>
            {children}
        </div>
    )
}

export const SheetTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={`text-lg font-semibold text-gray-950 ${className || ''}`}>
            {children}
        </div>
    )
}
