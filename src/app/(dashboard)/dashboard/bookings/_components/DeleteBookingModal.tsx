import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import bookingService from "@/services/bookingService";
import { AxiosError } from "axios";
import { Trash } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export function DeleteBooking({
  bookingId,
  setRefetch,
}: {
  bookingId: string;
  setRefetch: Dispatch<SetStateAction<boolean>>;
}) {
  const [open, setOpen] = useState(false);

  const deleteBookings = async () => {
    try {
      const res = await bookingService.deleteBooking(bookingId);
      if (res?.success) {
        setRefetch((prev) => !prev);
      }
    } catch (error) {
      if (error instanceof AxiosError)
        return toast.error(error.response?.data.message);
      toast.error("An error occurred");
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button size="icon" variant="ghost">
            <Trash className="w-4 h-4 text-red-500" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to do this? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={() => deleteBookings()}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
