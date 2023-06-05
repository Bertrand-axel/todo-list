import * as React from "react";
import {useEffect, useState} from "react";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import {PagedCollection} from "../../../interfaces/Collection.ts";
import {TodoList} from "../../../interfaces/TodoList.ts";
import {TodoListService} from "../../../services/providers/todoListService.ts";
import {useService} from "../../../contexts/containerWrapper.tsx";
import List from "@mui/material/List";
import {Link} from "react-router-dom";
import {Loading} from "../../utils/Loading.tsx";
import Pagination from "../../Pagination.tsx";


export function TodoListList() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState<PagedCollection<TodoList>>({'@id': '/api/todo_lists'});
  const [page, setPage] = useState(0);
  const todoListService: TodoListService = useService('TodoListService') as TodoListService;

  useEffect(
    () => {
      setLoading(true);
      const subscription = todoListService.getCollection({search}).subscribe(collection => {
        setLoading(false);
        setCollection(collection);
      });
      return () => subscription.unsubscribe();
    },
    [search]
  );

  function onPageChange(event, page: number) {
    setLoading(true);
    todoListService.getCollection({page: page + 1}).subscribe(collection => {
      setLoading(false);
      setCollection(collection);
      setPage(page);
    });
  }

  const total = collection['hydra:totalItems'] ?? 0;

  const lists = collection["hydra:member"] || [];
  const buttons = lists.map(list => <Link key={list['@id']} to={'lists/' + list.id}>
    <ListItemButton>
      <ListItemText primary={list.title}/>
    </ListItemButton>
  </Link>);

  return <Loading loading={loading}>
    <List component="nav">
      <Link key='create' to={'lists/create'}>
        <ListItemButton>
          <ListItemText primary='Add'/>
        </ListItemButton>
      </Link>
      {buttons}
    </List>
    <Pagination onPageChange={onPageChange} itemsPerPage={10} total={total} page={page} />
  </Loading>
}
