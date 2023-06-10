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
import TextField from "@mui/material/TextField";
import {Broadcast, Event} from "../../../services/broadcast.ts";


export function TodoListList() {
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState<PagedCollection<TodoList>>({'@id': '/api/todo_lists'});
  const [page, setPage] = useState(0);
  const todoListService: TodoListService = useService('TodoListService') as TodoListService;
  const broadcast: Broadcast = useService('Broadcast') as Broadcast;

  useEffect(
    () => {
      setLoading(true);
      const subscription = todoListService.getCollection({title: search}).subscribe(collection => {
        setLoading(false);
        setCollection(collection);
      });

      const eventNames = ['list.deleted', 'list.created', 'list.updated']
      const subscriptionDeletion = broadcast.subscribe((event: Event) => eventNames.includes(event.name) && launchSearch({}))

      return () => {
        subscription.unsubscribe();
        subscriptionDeletion.unsubscribe();
      }
    },
    []
  );

  function launchSearch(params: { [key: string]: any }) {
    setLoading(true);
    const targetPage = params.hasOwnProperty('page') ? params.page : page
    const request = {
      page: targetPage + 1,
      title: params.hasOwnProperty('title') ? params.title : search,
    }
    todoListService.getCollection(request).subscribe(collection => {
      setLoading(false);
      setCollection(collection);
      setPage(targetPage);
      setSearch(request.title);
    });
  }

  function onPageChange(event, page: number) {
    launchSearch({page});
  }

  function onSearchChange(search: string) {
    launchSearch({title: search, page: 0});
  }

  const total = collection['hydra:totalItems'] ?? 0;

  const lists = collection["hydra:member"] || [];
  const buttons = lists.map(list => <Link key={list['@id']} to={'lists/' + list.id}>
    <ListItemButton>
      <ListItemText primary={list.title}/>
    </ListItemButton>
  </Link>);

  return <>
    <Link key='create' to={'lists/create'}>
      <ListItemButton>
        <ListItemText primary='Add'/>
      </ListItemButton>
    </Link>
    <TextField
      variant="filled"
      id="outlined-controlled"
      label="Search list"
      value={search}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(event.target.value);
      }}
    />
    <Loading loading={loading}>
      <List component="nav">
        {buttons}
      </List>
      <Pagination onPageChange={onPageChange} itemsPerPage={10} total={total} page={page}/>
    </Loading>
  </>
}
