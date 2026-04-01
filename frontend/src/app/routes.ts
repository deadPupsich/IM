import { createBrowserRouter } from "react-router";
import MainLayout from "./components/MainLayout.tsx";
import IncidentsPage from "./components/IncidentsPage.tsx";
import MyIncidentsPage from "./components/MyIncidentsPage.tsx";
import IncidentDetailPage from "./components/IncidentDetailPage.tsx";
import DashboardPage from "./components/DashboardPage.tsx";
import SettingsPage from "./components/SettingsPage.tsx";
import LoginPage from "./components/LoginPage.tsx";
import TrashPage from "./components/TrashPage.tsx";

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