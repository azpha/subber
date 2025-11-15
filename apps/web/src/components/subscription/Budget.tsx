import { Card, CardContent } from "@/components/ui/card";

export default function Budget() {
  return (
    <Card className="dark h-full">
      <CardContent className="space-y-2">
        <p className="text-xs opacity-50">Budget</p>
        <h1 className="text-2xl font-bold">$1.23</h1>
        <p className="text-sm opacity-85">
          spent out of <span className="font-bold">$2.34</span>
        </p>
      </CardContent>
    </Card>
  );
}
