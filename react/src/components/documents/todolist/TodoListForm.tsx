import * as React from "react";
import {useForm} from "react-hook-form";
import {TodoList} from "../../../interfaces/TodoList.ts";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import {TodoListService} from "../../../services/providers/todoListService.ts";
import {useService} from "../../../contexts/containerWrapper.tsx";
import {useNavigate} from "react-router-dom";
import TextField from "@mui/material/TextField";
import {Stack} from "@mui/material";
import {UserSelectInput} from "../../form/UserSelectInput.tsx";

interface Params {
  data: TodoList | null
}

export function TodoListForm({data}: Params) {

  const filtered: TodoList = {
    '@id': data?.["@id"] ?? '',
    id: data?.id ?? undefined,
    owner: data?.owner ?? null,
    title: data?.title ?? '',
    description: data?.description ?? '',
  }
  const navigate = useNavigate();
  const todoListService: TodoListService = useService('TodoListService') as TodoListService;
  const {
    handleSubmit,
    register,
    control,
    getValues,
  } = useForm<TodoList>({defaultValues: filtered});

  const onSubmit = (data) => {
    todoListService
      .save(data)
      .subscribe((list) => navigate(`/dashboard/lists/${list.id}`))
  }

  const onDelete = (data: TodoList) => {
    todoListService.delete(data).subscribe(() => navigate('/dashboard'));
  }

  return <>
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <UserSelectInput label='owner' name='owner' control={control} getValues={getValues}/>
          <TextField label='the title' {...register('title')} />
          <TextField multiline label='the description' {...register('description')} />
        </Stack>
        <FormGroup>
          <Button type='submit'>Submit</Button>
          <Button onClick={handleSubmit(onDelete)}>Delete</Button>
        </FormGroup>
      </form>
    </Box>
  </>

}
