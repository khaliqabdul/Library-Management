import {
  faArrowAltCircleDown,
  faArrowAltCircleRight,
  faBook,
  faBookAtlas,
  faCubes,
  faRegistered,
  faEllipsisVertical,
  faAddressBook,
  faUserGraduate,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import Colors from "./Colors";

export const drawerMenu = [
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
        title: "Add Book",
        label: "addBook",
        icon: faBook,
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
        icon: faUserGraduate,
      },
      {
        title: "Members List",
        label: "MemberList",
        icon: faRegistered,
      },
    ],
  },
];
