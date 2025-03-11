import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText: string;
  cancelText: string;
}

export function Popup({ isOpen, onClose, onConfirm, title, children, confirmText, cancelText }: PopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div>{children}</div>
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-red-500 text-red-500 hover:bg-red-50">{cancelText}</Button>
          <Button onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white">{confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

