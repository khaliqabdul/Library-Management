import {
  faArrowAltCircleDown,
  faArrowAltCircleRight,
  faBook,
  faBookAtlas,
  faCubes,
  faRegistered,
} from "@fortawesome/free-solid-svg-icons";
import Colors from "./Colors";

export const drawerMenu = [
  {
    title: "Books",
    bg: Colors.skyBlue,
    icon1: faArrowAltCircleRight,
    icon2: faArrowAltCircleDown,
    menuList: [
      {
        title: "Books List",
        label: "BooksList",
        icon: faBookAtlas,
      },
      {
        title: "Notifications",
        label: "Notifications",
        icon: faRegistered,
      },
    ],
  },
  {
    title: "Home",
    bg: Colors.skyBlue,
    icon1: faArrowAltCircleRight,
    icon2: faArrowAltCircleDown,
    menuList: [
      {
        title: "Home Screen",
        label: "HomeScreen",
        icon: faRegistered,
      },
      {
        title: "Notifications",
        label: "Notifications",
        icon: faRegistered,
      },
    ],
  },
  {
    title: "Members",
    bg: Colors.skyBlue,
    icon1: faArrowAltCircleRight,
    icon2: faArrowAltCircleDown,
    menuList: [
      {
        title: "Add Member",
        label: "Add Member Screen",
        icon: faRegistered,
      },
      {
        title: "Members List",
        label: "MemberList",
        icon: faRegistered,
      },
    ],
  },
];
