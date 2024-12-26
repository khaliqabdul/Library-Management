import {
  faArrowAltCircleDown,
  faArrowAltCircleRight,
  faBook,
  faBookAtlas,
  faUserGraduate,
  faUserEdit,
  faUserGroup,
  faUsersLine,
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
        title: "Profile",
        label: "ProfileScreen",
        icon: faUserGraduate,
      },
      {
        title: "Edit Profile",
        label: "editProfile",
        icon: faUserEdit,
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
        title: "Members List",
        label: "MemberList",
        icon: faUsersLine,
      },
      {
        title: "Add Member",
        label: "Add Member Screen",
        icon: faUserGroup,
      },
    ],
  },
];
