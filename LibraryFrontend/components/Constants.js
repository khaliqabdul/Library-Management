import {faArrowAltCircleDown, faArrowAltCircleRight, faBook, faBookAtlas, faCubes, faRegistered} from '@fortawesome/free-solid-svg-icons';
import Colors from './Colors';

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
        ]
    },
    {
        title: "Books",
        bg: Colors.skyBlue,
        icon1: faArrowAltCircleRight,
        icon2: faArrowAltCircleDown,
        menuList: [
            {
                title: "Add Books",
                label: "Add Reader Screen",
                icon: faRegistered,
            },
            {
                title: "Issue Books",
                label: "Article",
                icon: faRegistered,
            },
        ]
    },
];
