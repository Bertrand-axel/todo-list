import * as React from "react";
import {useEffect, useState} from "react";
import {useService} from "../../../contexts/containerWrapper.tsx";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Title from "../../templates/Title.tsx";
import {useParams} from "react-router-dom";
import {TodoListService} from "../../../services/providers/todoListService.ts";
import {TodoList} from "../../../interfaces/TodoList.ts";
import {TodoListForm} from "./TodoListForm.tsx";
import {Loading} from "../../utils/Loading.tsx";
import {useMe} from "../../../hooks/useMe.ts";

export function TodoListFormWrapper() {

  const {listId} = useParams();
  const todoListService = useService('TodoListService') as TodoListService;
  const [list, setList] = useState<TodoList | null>(null);
  const [loading, setLoading] = useState(true);

  if (listId) {
    useEffect(() => {
      const subscription = todoListService.get(parseInt(listId))
        .subscribe((list) => {
          setList(list);
          setLoading(false);
        });
      return () => subscription.unsubscribe();
    }, [listId]);
  } else if (loading) {
    setList({'@id': '', owner: useMe()});
    setLoading(false);
  }

  return <Grid container spacing={3}>
    <Grid item xs={12}>
      <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
        <Loading loading={loading}>
          <Title>{list?.id ? ('Update ' + list.title) : 'New list'}</Title>
          <TodoListForm data={list}/>
        </Loading>
      </Paper>
    </Grid>
  </Grid>

}
