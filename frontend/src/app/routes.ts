import { createBrowserRouter } from "react-router";
import { MainLayout } from "./layout";
import { IncidentsPage, MyIncidentsPage, IncidentDetailPage } from "./features/incidents";
import { DashboardPage } from "./features/dashboard";
import { SettingsPage } from "./features/settings";
import { LoginPage } from "./features/auth";
import { TrashPage } from "./features/trash";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: IncidentsPage },
      { path: "my-incidents", Component: MyIncidentsPage },
      { path: "incident/:id", Component: IncidentDetailPage },
      { path: "dashboard", Component: DashboardPage },
      { path: "settings", Component: SettingsPage },
      { path: "trash", Component: TrashPage },
    ],
  },
]);
