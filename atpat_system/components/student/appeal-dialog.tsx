"use client"

import { useState } from "react"
import { apiPost } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function AppealDialog({
  flagId,
  disabled,
  onSubmitted,
}: {
  flagId: string
  disabled?: boolean
  onSubmitted?: () => void
}) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function submitAppeal() {
    if (!message.trim()) {
      toast({ title: "Message required", description: "Please explain your reconsideration request." })
      return
    }
    setSubmitting(true)
    try {
      // expected backend route: POST /api/flags/:id/appeal { message }
      await apiPost(`/api/flags/${flagId}/appeal`, { message })
      toast({ title: "Appeal submitted", description: "Your reconsideration request is pending review." })
      setOpen(false)
      setMessage("")
      onSubmitted?.()
    } catch (err: any) {
      toast({
        title: "Failed to submit appeal",
        description: err?.message || "Try again later.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>Request Reconsideration</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Reconsideration</DialogTitle>
          <DialogDescription>Explain why this flag should be reviewed. Be concise and factual.</DialogDescription>
        </DialogHeader>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Provide context for the proctoring event..."
        />
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={submitAppeal} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Appeal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AppealDialog
