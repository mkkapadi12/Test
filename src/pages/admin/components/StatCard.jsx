import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ADMIN_ICONS } from "@/lib/icons/admin.icons";

const StatCard = ({ title, value, subtitle, icon: Icon, iconBg, trend }) => (
  <Card className="relative overflow-hidden border border-border bg-card transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group">
    <CardHeader className="flex flex-row items-center justify-between p-5 pb-2">
      <CardDescription className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </CardDescription>
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className="h-5 w-5" />
      </div>
    </CardHeader>
    <CardContent className="p-5 pt-1">
      <CardTitle className="text-3xl font-extrabold tracking-tight">
        {value}
      </CardTitle>
      <div className="mt-2 flex items-center gap-1.5">
        {trend && (
          <Badge
            variant="secondary"
            className="h-5 gap-1 text-[10px] font-semibold"
          >
            <ADMIN_ICONS.TRENDINGUP className="h-3 w-3" />
            {trend}
          </Badge>
        )}
        <span className="text-[11px] text-muted-foreground">{subtitle}</span>
      </div>
    </CardContent>
    {/* Decorative accent */}
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
  </Card>
);

export default StatCard;
