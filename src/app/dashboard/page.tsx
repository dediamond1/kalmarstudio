import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-center gap-6 mt-6 xl:mt-12 h-full w-full relative">
        {/* Total user */}
        <CardItem title="Total Users" value={0} />

        {/* Active Sessions */}
        <CardItem title="Active Sessions" value={0} />

        {/* Premium Users */}
        <CardItem title="Premium Users" value={0} />

        {/* Banned Users */}
        <CardItem title="Banned Users" value={0} />

        {/* Orders */}
        <CardItem title="Orders" value={0} />
      </div>
    </div>
  );
}

const CardItem = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => {
  return (
    <Card className="w-[18%] flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};
