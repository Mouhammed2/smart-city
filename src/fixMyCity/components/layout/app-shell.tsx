import { ArrowLeft, Bell, ClipboardList, Grid3X3, Shield, PlusCircle, UserCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {Avatar, AvatarFallback} from "../ui/avatar";
import {Button} from "../ui/button";
import {Card, CardContent} from "../ui/card";
import { useAuth } from '../../../auth/store/useAuth';

type TopAppBarProps = {
  showBack?: boolean;
  title?: string;
};

export const TopAppBar = ({ showBack = false, title = "Fix My City" }: TopAppBarProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        {showBack && (
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </Button>
        )}
        <Link to="/fixmycity" className="text-xl font-extrabold tracking-tight text-blue-700">
          {title}
        </Link>
        {user?.role === 'ADMIN' && (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">Admin</span>
        )}
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

export const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
  <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-64 flex-col space-y-2 bg-slate-100/70 p-4 md:flex">
    <Card className="mb-8 border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{user?.username?.slice(0, 2).toUpperCase() || 'CU'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-bold text-slate-900">{user?.username || 'Citizen User'}</p>
            <p className="text-[11px] text-slate-500">{user?.email || 'Municipal Portal'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Link to="/fixmycity" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 transition hover:translate-x-1 hover:bg-white hover:text-blue-700">
      <Grid3X3 className="h-4 w-4" />
      <span>Overview</span>
    </Link>
    <Link to="/fixmycity/tracking" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 transition hover:translate-x-1 hover:bg-slate-200/60">
      <ClipboardList className="h-4 w-4" />
      <span>Tracking</span>
    </Link>
    {isAdmin && (
      <Link to="/fixmycity/admin" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 transition hover:translate-x-1 hover:bg-slate-200/60">
        <Shield className="h-4 w-4" />
        <span>Admin</span>
      </Link>
    )}
    <div className="mt-auto p-4">
      <Button asChild className="w-full bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-600">
        <Link to="/fixmycity/new-report">
          <PlusCircle className="h-4 w-4" />
          Report Issue
        </Link>
      </Button>
    </div>
  </aside>
  );
};

