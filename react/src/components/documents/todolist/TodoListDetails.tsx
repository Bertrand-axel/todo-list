import * as React from "react";
import {useEffect, useState} from "react";
import {useService} from "../../../contexts/containerWrapper.tsx";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Title from "../../templates/Title.tsx";
import {Link, useParams} from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import {TodoList} from "../../../interfaces/TodoList.ts";
import {TodoListService} from "../../../services/providers/todoListService.ts";
import {ListItem} from "@mui/material";
import {TaskList} from "../task/TaskList.tsx";
import List from "@mui/material/List";

export function TodoListDetails() {
  const [loading, setLoading] = useState(true);
  const {listId}: { listId: string } = useParams();
  const id = parseInt(listId, 10);

  const [list, setList] = useState<TodoList | null>(null);

  const service: TodoListService = useService('TodoListService') as TodoListService;
  useEffect(
    () => {
      setLoading(true);
      const subscription = service.get(id).subscribe(list => {
        setLoading(false);
        setList(list);
      });
      return () => subscription.unsubscribe();
    },
    [id]
  );

  if (loading || list === null) {
    return <ListItemText primary='loading'/>;
  }

  return <Grid container spacing={3}>
    {/* Recent Orders */}
    <Grid item xs={12}>
      <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
        <Title>Details {list.title}<Link to='edit'><IconButton><EditIcon/></IconButton></Link></Title>
        <List>
          <ListItem>
            <ListItemText primary='Title' secondary={list.title}/>
          </ListItem>
          <ListItem>
            <ListItemText primary='Description' secondary={list.description}/>
          </ListItem>
          <ListItem>
            <ListItemText primary='Owner' secondary={list.owner.username}/>
          </ListItem>
        </List>
      </Paper>
      <Paper sx={{p: 2, mt: 2, display: 'flex', flexDirection: 'column'}}>
        <Title>Tasks <Link to='tasks/create'><IconButton><AddIcon/></IconButton></Link></Title>
        <TaskList/>
      </Paper>
    </Grid>
  </Grid>
}
