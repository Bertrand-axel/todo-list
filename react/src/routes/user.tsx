import { Route } from "react-router-dom";
import { List, Create, Update, Show } from "../components/user/";

const routes = [
  <Route path="/users/create" element={<Create />} key="create" />,
  <Route path="/users/edit/:id" element={<Update />} key="update" />,
  <Route path="/users/show/:id" element={<Show />} key="show" />,
  <Route path="/users" element={<List />} key="list" />,
  <Route path="/users/:page" element={<List />} key="page" />,
];

export default routes;
