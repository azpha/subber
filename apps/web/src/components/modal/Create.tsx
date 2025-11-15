import { useState } from "react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldSet,
} from "@/components/ui/field";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { createItem } from "@/store/thunks/itemThunks";
import type { CreationValues, PaymentMethod } from "@/lib/types";

export default function Create({
  date,
  closeModal,
}: {
  date: Date | undefined;
  closeModal: () => void;
}) {
  const dispatch = useAppDispatch();
  const [values, setValues] = useState<CreationValues>({
    name: null,
    paymentMethod: null,
    price: null,
  });
  const [error, setError] = useState<string>("");
  const onSubmit = () => {
    if (
      !values.paymentMethod ||
      (values.paymentMethod?.toLowerCase() !== "card" &&
        values.paymentMethod?.toLowerCase() !== "paypal" &&
        values.paymentMethod?.toLowerCase() !== "bank")
    ) {
      setError("Invalid payment method");
    } else {
      values.paymentMethod =
        values.paymentMethod.toLowerCase() as PaymentMethod;
    }

    if (!date) {
      setError("No date received");
    } else {
      const lastBillingDate = new Date(date);
      lastBillingDate.setMonth(date.getMonth() - 1);

      const data = {
        ...values,
        nextBillingDate: date.toISOString().split("T")[0],
        lastBillingDate: lastBillingDate.toISOString().split("T")[0],
      };

      try {
        dispatch(createItem(data, date));
        closeModal();
      } catch (e) {
        setError("Something went wrong!");
        console.error(e);
      }
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Service Name</FieldLabel>
                <FieldDescription>Display name of service</FieldDescription>
                <Input
                  onChange={(v) => {
                    setValues((prevState) => {
                      return {
                        ...prevState,
                        name: v.target.value,
                      };
                    });
                  }}
                  placeholder="Spotify"
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Price</FieldLabel>
                <FieldDescription>
                  Price formatted as a decimal
                </FieldDescription>
                <Input
                  onChange={(v) => {
                    setValues((prevState) => {
                      return {
                        ...prevState,
                        price: v.target.value.replace("$", ""),
                      };
                    });
                  }}
                  placeholder="$4.99"
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Payment Method</FieldLabel>
                <FieldDescription>Must be either Card or Bank</FieldDescription>
                <Input
                  onChange={(v) => {
                    setValues((prevState) => {
                      return {
                        ...prevState,
                        paymentMethod: v.target.value as PaymentMethod,
                      };
                    });
                  }}
                  placeholder="Card"
                  required
                />
              </Field>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
        <p className="opacity-80 mt-2 text-red-400 font-semibold">{error}</p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button variant="default" type="submit" className="w-full">
            Submit
          </Button>
          <DialogClose asChild>
            <Button variant="outline" type="button" className="w-full">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </form>
    </div>
  );
}
