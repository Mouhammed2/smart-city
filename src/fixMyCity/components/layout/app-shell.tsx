import { ArrowLeft, Bell, ClipboardList, Grid3X3, PlusCircle, UserCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {Avatar, AvatarFallback} from "../ui/avatar";
import {Button} from "../ui/button";
import {Card, CardContent} from "../ui/card";

type TopAppBarProps = {
  showBack?: boolean;
  title?: string;
};

export const TopAppBar = ({ showBack = false, title = "Fix My City" }: TopAppBarProps) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        {showBack && (
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </Button>
        )}
        <Link to="/civic" className="text-xl font-extrabold tracking-tight text-blue-700">
          {title}
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-slate-600" />
        </Button>
        <Button variant="ghost" size="icon">
          <UserCircle2 className="h-5 w-5 text-slate-600" />
        </Button>
      </div>
    </header>
  );
};

export const Sidebar = () => (
  <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-64 flex-col space-y-2 bg-slate-100/70 p-4 md:flex">
    <Card className="mb-8 border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-bold text-slate-900">Civic Architect</p>
            <p className="text-[11px] text-slate-500">Municipal Portal</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Link to="/civic" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 transition hover:translate-x-1 hover:bg-white hover:text-blue-700">
      <Grid3X3 className="h-4 w-4" />
      <span>Overview</span>
    </Link>
    <Link to="/civic/tracking" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 transition hover:translate-x-1 hover:bg-slate-200/60">
      <ClipboardList className="h-4 w-4" />
      <span>Tracking</span>
    </Link>
    <div className="mt-auto p-4">
      <Button asChild className="w-full bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-600">
        <Link to="/civic/new-report">
          <PlusCircle className="h-4 w-4" />
          Report Issue
        </Link>
      </Button>
    </div>
  </aside>
);

