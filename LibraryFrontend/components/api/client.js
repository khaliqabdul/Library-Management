import axios from "axios";
import { baseURL } from "../popup-menu/data";

export default axios.create({baseURL: baseURL})