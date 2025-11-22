import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { Card, CardContent } from "@/components/ui/card";
import LoadingCard from "./LoadingCard";
import EmptyState from "./EmptyState";
import type { Subscription } from "@/lib/types";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function Upcoming() {
  const upcomingItems = useAppSelector((state) => state.item.upcomingItem);
  const isLoading = useAppSelector((state) => state.item.isLoading);
  const [shownCard, setShownCard] = useState<number>(0);

  const methods = {
    card: "Card",
    paypal: "PayPal",
    bank: "Bank",
  };

  const UpcomingCard = ({ item }: { item: Subscription }) => {
    return (
      <div className="space-y-2">
        {" "}
        <p className="text-xs opacity-50">Upcoming</p>
        <h1 className="text-2xl font-bold">{item.name}</h1>
        <div className="inline-block space-x-2 text-xs font-semibold opacity-85">
          <p className="inline">{methods[item.paymentMethod!]}</p>
          <p className="inline">·</p>
          <p className="inline">${item.price}</p>
          <p className="inline">·</p>
          <p className="inline">
            {new Date(item.nextBillingDate as string).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingCard />;
  } else if (!upcomingItems) {
    return <EmptyState title={"Upcoming"} />;
  } else if (upcomingItems.length == 1) {
    return (
      <Card className="dark">
        <CardContent>
          <UpcomingCard item={upcomingItems[0]} />
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card className="dark">
        <CardContent>
          <div className="grid grid-cols-2">
            {upcomingItems && upcomingItems.length > 0 ? (
              <UpcomingCard item={upcomingItems[shownCard]} />
            ) : (
              <LoadingCard />
            )}
            <div className="flex justify-end">
              <div className="flex flex-col justify-center">
                <ArrowUp
                  className={`${
                    shownCard == 0 ? "opacity-50" : "hover:cursor-pointer"
                  }`}
                  onClick={() => {
                    if (shownCard > 0) {
                      setShownCard((prev) => {
                        return prev - 1;
                      });
                    }
                  }}
                />
                <ArrowDown
                  className={`${
                    shownCard != upcomingItems.length - 1
                      ? "hover:cursor-pointer"
                      : "opacity-50"
                  }`}
                  onClick={() => {
                    if (shownCard != upcomingItems.length - 1) {
                      setShownCard((prev) => {
                        return prev + 1;
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
}
