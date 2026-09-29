"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EndSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function EndSessionModal({
  open,
  onOpenChange,
  onConfirm,
}: EndSessionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border/70 text-foreground rounded-3xl shadow-xl">
        <DialogHeader>
          <DialogTitle>End Session?</DialogTitle>
          <DialogDescription>
            Are you sure you want to end this session? You will be redirected to the studio hub.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onOpenChange(false);
              onConfirm();
            }}
            className="rounded-full font-bold"
          >
            End Session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
