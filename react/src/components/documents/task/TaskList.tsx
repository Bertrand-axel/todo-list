import * as React from "react";
import {useEffect, useState} from "react";
import {PagedCollection} from "../../../interfaces/Collection.ts";
import {Task} from "../../../interfaces/Task.ts";
import {TaskService} from "../../../services/providers/taskService.ts";
import {useService} from "../../../contexts/containerWrapper.tsx";
import ListItemText from "@mui/material/ListItemText";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {Link, useParams} from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {Loading} from "../../utils/Loading.tsx";
import Pagination from "../../Pagination.tsx";

export function TaskList() {
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState<PagedCollection<Task>>({'@id': '/api/tasks'});
  const [page, setPage] = useState(0);
  const {listId}: {listId: string} = useParams();

  const id = parseInt(listId, 10);

  const taskService: TaskService = useService('TaskService') as TaskService;

  useEffect(
    () => {
      setLoading(true);
      const subscription = taskService.getForList(id).subscribe(collection => {
        setLoading(false);
        setLists(collection);
      });
      return () => subscription.unsubscribe();
    },
    [id]
  );

  if (loading) {
    return <ListItemText primary='loading' />;
  }

  const items = lists["hydra:member"] || [];

  function onPageChange(event, page: number) {
    setLoading(true);
    taskService.getForList(id, {page: page + 1}).subscribe(collection => {
      setLoading(false);
      setLists(collection);
      setPage(page);
    });
  }

  const total = lists['hydra:totalItems'] ?? 0;

  return <Loading loading={loading}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Responsible</TableCell>
          <TableCell>{'Todo list'}</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((row) => (
          <TableRow key={row['@id']}>
            <TableCell>{row.title}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>{row.responsible?.username}</TableCell>
            <TableCell>{row.todoList.title}</TableCell>
            <TableCell>
              <Link to={`tasks/${row.id}/details`}><IconButton><VisibilityIcon/></IconButton></Link>
              <Link to={`tasks/${row.id}/edit`}><IconButton><EditIcon/></IconButton></Link>
              <IconButton><DeleteIcon/></IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <Pagination onPageChange={onPageChange}  total={total} page={page} />
  </Loading>
}
