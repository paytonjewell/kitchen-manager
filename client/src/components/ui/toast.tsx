import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toastVariants = cva(
  "fixed bottom-4 right-4 z-50 flex max-w-md items-center gap-3 rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-bottom-5",
  {
    variants: {
      variant: {
        default: "bg-background border-border",
        destructive: "bg-destructive text-destructive-foreground border-destructive",
        success: "bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-100 dark:border-green-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ToastProps extends VariantProps<typeof toastVariants> {
  title?: string
  description?: string
  onClose?: () => void
}

export interface ToastState extends ToastProps {
  id: string
}

type ToastContextValue = {
  toasts: ToastState[]
  toast: (props: ToastProps) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastState[]>([])

  const toast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...props, id }])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismiss(id)
    }, 5000)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(toastVariants({ variant: t.variant }))}
          >
            <div className="flex-1">
              {t.title && (
                <div className="font-semibold">{t.title}</div>
              )}
              {t.description && (
                <div className="text-sm opacity-90">{t.description}</div>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-sm opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}
