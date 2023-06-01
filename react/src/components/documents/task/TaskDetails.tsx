import * as React from "react";
import {useEffect, useState} from "react";
import {useService} from "../../../contexts/containerWrapper.tsx";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Title from "../../templates/Title.tsx";
import {Link, useParams} from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import {ListItem} from "@mui/material";
import List from "@mui/material/List";
import {Task} from "../../../interfaces/Task.ts";
import {TaskService} from "../../../services/providers/taskService.ts";

export function TaskDetails() {
  const [loading, setLoading] = useState(true);
  const {taskId}: {taskId: string} = useParams();
  const id = parseInt(taskId, 10);

  const [task, setTask] = useState<Task|null>(null);

  const service: TaskService = useService('TaskService') as TaskService;
  useEffect(
    () => {
      setLoading(true);
      const subscription = service.get(id).subscribe(list => {
        setLoading(false);
        setTask(list);
      });
      return () => subscription.unsubscribe();
    },
    [id]
  );

  if (loading || task === null) {
    return <ListItemText primary='loading' />;
  }

  return <Grid container spacing={3}>
    {/* Recent Orders */}
    <Grid item xs={12}>
      <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
        <Title>Details {task.title}<Link to='../edit'><IconButton><EditIcon/></IconButton></Link></Title>
        <List>
          <ListItem>
            <ListItemText primary='Title' secondary={task.title} />
          </ListItem>
          <ListItem>
            <ListItemText primary='Description' secondary={task.description} />
          </ListItem>
          <ListItem>
            <ListItemText primary='Status' secondary={task.status} />
          </ListItem>
          <ListItem>
            <ListItemText primary='Responsible' secondary={task.responsible?.username} />
          </ListItem>
        </List>
      </Paper>
    </Grid>
  </Grid>
}
