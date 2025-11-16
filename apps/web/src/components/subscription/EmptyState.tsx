import { Card, CardContent } from "@/components/ui/card";

export default function EmptyState({ title }: { title: string }) {
  return (
    <Card className="dark h-full">
      <CardContent>
        <p className="text-xs opacity-50">{title}</p>
        <div className="py-2 space-y-2">
          <h1 className="text-2xl font-bold">Nothing to see</h1>
          <p className="font-semibold text-xs opacity-85">
            Awfully quiet here..
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
