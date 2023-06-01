import * as React from "react";
import {useEffect, useState} from "react";
import {Task} from "../../../interfaces/Task.ts";
import {TaskService} from "../../../services/providers/taskService.ts";
import {useService} from "../../../contexts/containerWrapper.tsx";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Title from "../../templates/Title.tsx";
import {useParams} from "react-router-dom";
import {TodoListService} from "../../../services/providers/todoListService.ts";
import {TaskForm} from "./TaskForm.tsx";
import {Loading} from "../../utils/Loading.tsx";
import {useMe} from "../../../hooks/useMe.ts";

export function TaskFormWrapper() {

  const {listId, taskId} = useParams();
  const taskService = useService('TaskService') as TaskService;
  const todoListService = useService('TodoListService') as TodoListService;
  const [task, setTask] = useState<Task|null>(null);
  const [loading, setLoading] = useState(true);

  if (taskId) {
    useEffect(() => {
      const subscription = taskService.get(parseInt(taskId))
        .subscribe((task) => {
          setTask(task);
          setLoading(false);
        });
      return () => subscription.unsubscribe();
    }, [taskId]);
  } else if (listId) {
    const currentUser = useMe();
    useEffect(() => {
      const subscription = todoListService.get(parseInt(listId))
        .subscribe((list) => {
          setTask({'@id': '', todoList: list, responsible: currentUser});
          setLoading(false);
        });
      return () => subscription.unsubscribe();
    }, [listId]);
  } else {
    setLoading(false);
  }

  return <Grid container spacing={3}>
    <Grid item xs={12}>
      <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
        <Loading loading={loading}>
          <Title>{task?.id ? ('Update ' + task.title) : 'New task'}</Title>
          <TaskForm data={task} />
        </Loading>
      </Paper>
    </Grid>
  </Grid>

}
