import * as React from "react";
import {Task} from "../../../interfaces/Task.ts";
import {TaskService} from "../../../services/providers/taskService.ts";
import {useService} from "../../../contexts/containerWrapper.tsx";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";
import {useForm} from "react-hook-form";
import Box from "@mui/material/Box";
import {Stack} from "@mui/material";
import {TodoListSelectInput} from "../../form/TodoListSelectInput.tsx";
import {UserSelectInput} from "../../form/UserSelectInput.tsx";
import {SelectStatusInput} from "../../form/SelectStatusInput.tsx";

interface Params {
  data: Task|null;
}

export function TaskForm({data}: Params) {

  const navigate = useNavigate();
  const taskService: TaskService = useService('TaskService') as TaskService;

  const {
    handleSubmit,
    register,
    control,
    getValues,
  } = useForm<Task>({defaultValues: data || {"@id": ''}});

  const onSubmit = (data) => {
    taskService
      .save(data)
      .subscribe((task) => navigate(`/dashboard/lists/${task.todoList.id}`))
  }

  const onDelete = (task: Task) => {
    taskService.delete(task).subscribe(() => navigate(`/dashboard/lists/${task.todoList.id}`))
  }


  return <>
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TodoListSelectInput label='list' name='todoList' control={control} getValues={getValues} />
          <TextField label='the title' {...register('title')} />
          <TextField multiline label='the description' {...register('description')} />
          <SelectStatusInput label='status' name='status' control={control} />
          <UserSelectInput label='responsible' name='responsible' control={control} getValues={getValues} />
        </Stack>
        <FormGroup>
          <Button type='submit' >Submit</Button>
          <Button onClick={handleSubmit(onDelete)}>Delete</Button>
        </FormGroup>
      </form>
    </Box>
  </>
}
