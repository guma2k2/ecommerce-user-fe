'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw, Loader2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
  Textarea,
  Alert,
  AlertDescription,
} from '@/components/ui';
import { formatCurrency } from '@/shared/utils/appUtils';
import { useRefundPayment } from '../hooks';

interface RefundPaymentDialogProps {
  paymentId: string;
  orderId?: string;
  maxAmount: number;
  currency?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RefundPaymentDialog({
  paymentId,
  orderId,
  maxAmount,
  currency = 'USD',
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSuccess,
}: RefundPaymentDialogProps) {
  const { t, i18n } = useTranslation('payment');
  const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const [amount, setAmount] = useState<string>(String(maxAmount || ''));
  const [reason, setReason] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: refund, isPending } = useRefundPayment();

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0.01) {
      setErrorMessage(t('refund.errAmountPositive'));
      return;
    }

    if (parsedAmount > maxAmount) {
      setErrorMessage(
        t('refund.errAmountExceed', { amount: formatCurrency(maxAmount, currency, locale) })
      );
      return;
    }

    refund(
      {
        paymentId,
        payload: {
          amount: parsedAmount,
          reason: reason.trim() || undefined,
        },
      },
      {
        onSuccess: (data) => {
          if (data.successful) {
            setOpen(false);
            onSuccess?.();
          } else {
            setErrorMessage(data.failureReason || t('refund.errFallback'));
          }
        },
        onError: (err) => {
          const apiError = err as { response?: { data?: { message?: string } }; message?: string };
          setErrorMessage(
            apiError?.response?.data?.message ||
              apiError?.message ||
              t('refund.errFallback')
          );
        },
      }
    );
  };

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
          className="gap-1.5 text-xs text-amber-600 hover:text-amber-700"
        >
          <RotateCcw className="size-3.5" />
          <span>{t('refund.trigger')}</span>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-3 border-b border-border/40">
            <DialogTitle className="flex items-center gap-2 text-base font-semibold">
              <RotateCcw className="size-4 text-amber-500" />
              <span>{t('refund.title')}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {t('refund.description')}{' '}
              <span className="font-mono font-medium text-foreground">{orderId || paymentId}</span>
            </DialogDescription>
          </DialogHeader>

          {errorMessage && (
            <Alert variant="destructive" className="text-xs">
              <AlertCircle className="size-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRefundSubmit} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="refund-amount" className="font-medium text-foreground">
                  {t('refund.amountLabel', { currency })}
                </label>
                <span className="text-muted-foreground text-[11px]">
                  {t('refund.maxNotice', { amount: formatCurrency(maxAmount, currency, locale) })}
                </span>
              </div>
              <Input
                id="refund-amount"
                type="number"
                step="0.01"
                min="0.01"
                max={maxAmount}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="refund-reason" className="text-xs font-medium text-foreground">
                {t('refund.reasonLabel')}
              </label>
              <Textarea
                id="refund-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t('refund.reasonPlaceholder')}
                rows={3}
                maxLength={255}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                {t('refund.cancel')}
              </Button>
              <Button type="submit" size="sm" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1.5" />
                    {t('refund.submitting')}
                  </>
                ) : (
                  t('refund.submit')
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
