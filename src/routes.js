// dashRoutes.js - Updated with role-based access
import React from "react";
import Dashboard from "views/Dashboard/Dashboard.js";
import Billing from "views/Dashboard/Billing.js";
import Profile from "views/Dashboard/Profile.js";
import SignIn from "views/Pages/SignIn.js";
import AdminManagement from "views/Dashboard/AdminManagement.js";
import UserManagement from "views/Dashboard/UserManagement.js";
import ProductManagement from "views/Dashboard/ProductManagement";

import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  DocumentIcon,
  GlobeIcon,
  RocketIcon,
} from "components/Icons/Icons";

import EMinthiran from "views/Dashboard/EMinthiran.js";
import Carousel from "views/Dashboard/Carousel.js";
import Events from "views/Dashboard/Events.js";
import Forms from "views/Dashboard/Forms.js";
import ImportantNotice from "views/Dashboard/ImportantNotice.js";
import BoardProceedings from "views/Dashboard/BoardProceedings.js";
import { FaFileAlt, FaBullhorn, FaClipboardList } from "react-icons/fa";

const ICON_COLOR = "#0A3D91";



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
  {
    path: "/forms",
    name: "Forms",
    icon: <FaFileAlt color={ICON_COLOR} />,
    element: <Forms />,
    layout: "/admin",
  },
  {
    path: "/important-notice",
    name: "Important Notice",
    icon: <FaBullhorn color={ICON_COLOR} />,
    element: <ImportantNotice />,
    layout: "/admin",
  },
  {
    path: "/board-proceedings",
    name: "Board Proceedings",
    icon: <FaClipboardList color={ICON_COLOR} />,
    element: <BoardProceedings />,
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
    name: "Sign In",
    rtlName: "تسجيل الدخول",
    element: <SignIn />,
    layout: "/auth",
  },
];

export default dashRoutes;