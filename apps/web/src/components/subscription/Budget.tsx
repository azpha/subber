import { Card, CardContent } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";

export default function Budget() {
  const budget = useAppSelector((state) => state.settings.settings?.budget);
  const spendThisMonth = useAppSelector((state) => state.item.totalSpend);

  return (
    <Card className="dark h-full">
      <CardContent className="space-y-2">
        <p className="text-xs opacity-50">Budget</p>
        {budget ? (
          <>
            <h1 className="text-2xl font-bold">${spendThisMonth}</h1>
            <p className="text-sm opacity-85">
              spent out of <span className="font-bold">${budget}</span>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">None here yet</h1>
            <p className="text-xs opacity-85">
              Configure your budget in settings
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
