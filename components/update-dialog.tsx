import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { translations, type Language } from '@/lib/i18n';

export function UpdateDialog({
  open,
  version,
  setOpen,
  onClickUpdate,
  l,
}: {
  open: boolean;
  version: string | null;
  setOpen(open: boolean): void;
  onClickUpdate(): void;
  l: Language;
}) {
  const t = translations[l];
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {t.updateDialogTitle} {version}
          </DialogTitle>
          <DialogDescription>
            <br />
            {t.updateDialogDescr}
            <br />
            <br />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button type="button" onClick={() => onClickUpdate()}>
            {t.updateDialogButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
