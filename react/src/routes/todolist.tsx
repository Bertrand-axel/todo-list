import { Route } from "react-router-dom";
import { List, Create, Update, Show } from "../components/todolist/";

const routes = [
  <Route path="/todo_lists/create" element={<Create />} key="create" />,
  <Route path="/todo_lists/edit/:id" element={<Update />} key="update" />,
  <Route path="/todo_lists/show/:id" element={<Show />} key="show" />,
  <Route path="/todo_lists" element={<List />} key="list" />,
  <Route path="/todo_lists/:page" element={<List />} key="page" />,
];

export default routes;
