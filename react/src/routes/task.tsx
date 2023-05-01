import { Route } from "react-router-dom";
import { List, Create, Update, Show } from "../components/task/";

const routes = [
  <Route path="/tasks/create" element={<Create />} key="create" />,
  <Route path="/tasks/edit/:id" element={<Update />} key="update" />,
  <Route path="/tasks/show/:id" element={<Show />} key="show" />,
  <Route path="/tasks" element={<List />} key="list" />,
  <Route path="/tasks/:page" element={<List />} key="page" />,
];

export default routes;
