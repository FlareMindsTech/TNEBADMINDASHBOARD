// dashRoutes.js - Updated with role-based access
import React from "react";
import Dashboard from "views/Dashboard/Dashboard.js";
import Billing from "views/Dashboard/Billing.js";
import Profile from "views/Dashboard/Profile.js";
import SignIn from "views/Pages/SignIn.js";
import AdminManagement from "views/Dashboard/AdminManagement.js";
import UserManagement from "views/Dashboard/UserManagement.js";
import { MdLogout } from "react-icons/md";

import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  DocumentIcon,
  GlobeIcon,
  RocketIcon,


} from "components/Icons/Icons";

import ProductManagement from "views/Dashboard/ProductManagement";


import EMinthiran from "views/Dashboard/EMinthiran.js";
import Carousel from "views/Dashboard/Carousel.js";
import Events from "views/Dashboard/Events.js";


const ICON_COLOR = "#0A3D91";

// ✅ Added: Logout component
const Logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  const base = window.location.origin + window.location.pathname;
  window.location.replace(`${base}#/auth/signin`);
  return <div>Logging out...</div>;
};



var dashRoutes = [
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   rtlName: "لوحة القيادة",
  //   icon: <HomeIcon color="#0A3D91" />,
  //   element: <Dashboard />,
  //   layout: "/admin",
  // },
  {
    path: "/admin-management",
    name: "Gallery",
    rtlName: "إدارة المسؤول",
    icon: <StatsIcon color="#0A3D91" />,
    element: <AdminManagement />,
    layout: "/admin",
  },
  {
    path: "/events",
    name: "Events",
    icon: <GlobeIcon color={ICON_COLOR} />,
    element: <Events />,
    layout: "/admin",
  },
  // {
  //   path: "/ProductManagement",
  //   name: "Product Management",
  //   rtlName: "إدارة المستخدمين",
  //   icon: <StatsIcon color="#0A3D91" />,
  //   element: <ProductManagement />,
  //   layout: "/admin",
  // },
  // {
  //   path: "/user-management",
  //   name: "User Management",
  //   rtlName: "إدارة المستخدمين",
  //   icon: <StatsIcon color="#0A3D91" />,
  //   element: <UserManagement />,
  //   layout: "/admin",
  // },


  {
    path: "/e-minthiran",
    name: "E-Minthiran",
    icon: <DocumentIcon color={ICON_COLOR} />,
    element: <EMinthiran />,
    layout: "/admin",
  },
  {
    path: "/carousel",
    name: "Carousel",
    icon: <RocketIcon color={ICON_COLOR} />,
    element: <Carousel />,
    layout: "/admin",
  },
  // {
  //   path: "/billing",
  //   name: "Billing",
  //   rtlName: "الفواتير",
  //   icon: <CreditIcon color="#0A3D91" />,
  //   element: <Billing />,
  //   layout: "/admin",
  // },
  {
    path: "/profile",
    name: "Profile",
    element: <Profile />,
    layout: "/admin",
  },
  {
    path: "/signin",
    name: "Logout",
    rtlName: "تسجيل الدخول",
    icon: <MdLogout color={ICON_COLOR} />,
    element: <SignIn />,
    layout: "/auth",
  },
  {
    path: "/logout",
    name: "Logout",
    rtlName: "تسجيل الخروج",
    icon: <MdLogout color={ICON_COLOR} />,
    element: <Logout />,
    layout: "/admin",
  },
];

export default dashRoutes;