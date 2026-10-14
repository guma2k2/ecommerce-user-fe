'use client';

import React from 'react';
import { FileText, Loader2, Calendar, Receipt, ShieldCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Badge,
  Button,
  Typography,
} from '@/components/ui';
import { formatCurrency } from '@/shared/utils/appUtils';
import { usePaymentLedger } from '../hooks';
import type { LedgerEntryType } from '../types';

interface PaymentLedgerDialogProps {
  paymentId: string;
  orderId?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function getEntryBadge(type: LedgerEntryType) {
  switch (type) {
    case 'INITIALIZATION':
      return <Badge variant="secondary">Initialization</Badge>;
    case 'CAPTURE':
      return <Badge variant="success">Capture</Badge>;
    case 'REFUND':
      return <Badge variant="destructive">Refund</Badge>;
    case 'CHARGEBACK':
      return <Badge variant="destructive">Chargeback</Badge>;
    case 'FEE':
      return <Badge variant="outline">Fee</Badge>;
    case 'ADJUSTMENT':
      return <Badge variant="accent">Adjustment</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
}

export function PaymentLedgerDialog({
  paymentId,
  orderId,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: PaymentLedgerDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const { data: entries, isLoading, isError } = usePaymentLedger(paymentId);

  return (
    <>
      {trigger && (
        <span onClick={() => setOpen(true)} className="inline-flex cursor-pointer">
          {trigger}
        </span>
      )}
      {!trigger && controlledOpen === undefined && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="gap-1.5 text-xs"
        >
          <Receipt className="size-3.5" />
          <span>View Ledger</span>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>

      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-3 border-b border-border/40">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Receipt className="size-4 text-primary" />
            <span>Payment Audit Ledger</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Transaction audit trail for payment <span className="font-mono">{paymentId}</span>
            {orderId && (
              <>
                {' '}• Order <span className="font-mono">{orderId}</span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="size-6 animate-spin text-primary" />
            <Typography.Muted className="text-xs">Loading ledger entries...</Typography.Muted>
          </div>
        ) : isError ? (
          <div className="py-8 text-center text-xs text-destructive">
            Failed to load payment ledger history. Please try again.
          </div>
        ) : !entries || entries.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
            <FileText className="size-8 mx-auto opacity-40" />
            <p>No transaction ledger entries recorded yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {entries.map((entry) => (
              <div key={entry.id} className="py-3.5 first:pt-1 last:pb-0 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getEntryBadge(entry.entryType)}
                    <Badge variant="outline" className="text-[10px] uppercase font-mono">
                      {entry.balanceType}
                    </Badge>
                  </div>
                  <Typography.Tabular className="font-bold text-sm text-foreground">
                    {entry.balanceType === 'CREDIT' ? '-' : '+'}
                    {formatCurrency(entry.amount, entry.currency || 'USD')}
                  </Typography.Tabular>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3 text-primary shrink-0" />
                    <span>Provider: <strong className="text-foreground">{entry.gatewayProvider}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3 shrink-0" />
                    <span>
                      {new Date(entry.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>

                  {entry.gatewayTransactionId && (
                    <div className="sm:col-span-2 flex items-center gap-1.5 font-mono text-[10px] break-all">
                      <span className="text-muted-foreground">Txn:</span>
                      <span className="text-foreground">{entry.gatewayTransactionId}</span>
                    </div>
                  )}

                  {entry.idempotencyKey && (
                    <div className="sm:col-span-2 text-[10px] text-muted-foreground truncate">
                      Idempotency: <span className="font-mono">{entry.idempotencyKey}</span>
                    </div>
                  )}

                  {entry.metadata && (
                    <div className="sm:col-span-2 text-[11px] italic text-muted-foreground mt-0.5">
                      &ldquo;{entry.metadata}&rdquo;
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}
