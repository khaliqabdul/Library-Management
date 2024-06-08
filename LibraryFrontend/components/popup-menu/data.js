import Icon from "../Icons";
import { faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import Colors from "../Colors";

export const data = [
  {
    id: 1,
    name: "Edit",
    icon: <Icon color={Colors.white} icon={faEdit}/>,
  },
  {
    id: 2,
    name: "Delete",
    icon: <Icon color={Colors.white} icon={faTrash}/>,
  },
];
