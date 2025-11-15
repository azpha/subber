import { useAppSelector } from "@/store/hooks";
import { Subscription } from "@/lib/types";
import { useEffect, useMemo } from "react";

export default function Info() {
  const items = useAppSelector((state) => state.item.items);

  useEffect(() => {
    console.log(items);
  }, [items]);

  const ListItem = ({ item }: { item: Subscription }) => {
    const methods = {
      card: "Card",
      paypal: "PayPal",
      bank: "Bank",
    };

    return (
      <div>
        <h1 className="text-2xl font-semibold">{item.name}</h1>
        <div className="inline-block space-x-2 text-xs font-semibold opacity-85">
          <p className="inline">{methods[item.paymentMethod!]}</p>
          <p className="inline">·</p>
          <p className="inline">${item.price}</p>
          <p className="inline">·</p>
          <p className="inline">{new Date().toLocaleDateString()}</p>
        </div>
      </div>
    );
  };

  const allCards = useMemo(() => {
    return items.map((v) => {
      return <ListItem item={v} />;
    });
  }, [items]);

  return (
    <div className="grid grid-cols-1">
      {allCards.length > 0 ? (
        allCards
      ) : (
        <>
          <h1 className="text-2xl font-semibold">That sucks.</h1>
          <p className="py-2 opacity-85">No subscriptions here</p>
        </>
      )}
    </div>
  );
}
