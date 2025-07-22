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
import axiosInstance from "@/utils/axios";
import { AxiosError } from "axios";
import { Trash } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export function DeleteBooking({
  bookingId,
  setRefetch,
  setLoading,
}: {
  bookingId: string;
  setRefetch: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const deleteBookings = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.delete(`/bookings/${bookingId}`);
      if (res?.data?.success) {
        setRefetch((prev) => !prev);
      }
    } catch (error) {
      if (error instanceof AxiosError)
        return toast.error(error.response?.data.message);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
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
