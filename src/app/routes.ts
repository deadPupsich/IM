import { createBrowserRouter } from "react-router";
import MainLayout from "./components/MainLayout";
import IncidentsPage from "./components/IncidentsPage";
import MyIncidentsPage from "./components/MyIncidentsPage";
import IncidentDetailPage from "./components/IncidentDetailPage";
import DashboardPage from "./components/DashboardPage";
import SettingsPage from "./components/SettingsPage";
import LoginPage from "./components/LoginPage";
import TrashPage from "./components/TrashPage";

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