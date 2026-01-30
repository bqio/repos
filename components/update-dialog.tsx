import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function UpdateDialog({
  open,
  version,
  setOpen,
  onClickUpdate,
}: {
  open: boolean;
  version: string | null;
  setOpen(open: boolean): void;
  onClickUpdate(): void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Обновление</DialogTitle>
          <DialogDescription>
            <br />
            Обнаружена новая версия <strong>Repos {version}</strong>.
            <br />
            <br />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button type="button" onClick={() => onClickUpdate()}>
            Обновить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
