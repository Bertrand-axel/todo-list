import * as React from "react";
import {useEffect, useState} from "react";
import {PagedCollection} from "../../../interfaces/Collection.ts";
import {Task} from "../../../interfaces/Task.ts";
import {TaskService} from "../../../services/providers/taskService.ts";
import {useService} from "../../../contexts/containerWrapper.tsx";
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
import {TableSortLabel} from "@mui/material";
import TextField from "@mui/material/TextField";

export function TaskList() {
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState<PagedCollection<Task>>({'@id': '/api/tasks'});
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState({'title': 'asc'});
  const [search, setSearch] = useState<string>('');
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

  function launchSearch(params: { [key: string]: any }) {
    setLoading(true);
    const targetPage = params.hasOwnProperty('page') ? params.page : page;
    const order = params.hasOwnProperty('order') ? params.order : sortOrder;
    const request = {
      page: targetPage + 1,
      order: order,
      title: params.hasOwnProperty('title') ? params.title : search,
    }
    taskService.getForList(id, request).subscribe(collection => {
      setLoading(false);
      setLists(collection);
      setPage(targetPage);
      setSortOrder(order);
      setSearch(request.title);
    });
  }

  function changeSortOrder() {
    launchSearch({order: {title: (sortOrder.title === 'asc' ? 'desc' : 'asc')}})
  }

  function onPageChange(event, page: number) {
    launchSearch({page});
  }

  function onSearchChange(search: string) {
    launchSearch({title: search, page: 0});
  }

  function deleteTask(task: Task) {
    taskService.delete(task).subscribe();
  }

  const items = lists["hydra:member"] || [];
  const total = lists['hydra:totalItems'] ?? 0;

  return <>
    <TextField
      variant="filled"
      id="outlined-controlled"
      label="Search task"
      value={search}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(event.target.value);
      }}
    />
    <Loading loading={loading}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sortDirection={sortOrder.title}>
              <TableSortLabel
                active={true}
                direction={sortOrder.title}
                onClick={changeSortOrder}
              >
                Title
              </TableSortLabel>
            </TableCell>
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
                <IconButton><DeleteIcon onClick={() => deleteTask(row)}/></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination onPageChange={onPageChange}  total={total} page={page} />
    </Loading>
  </>
}
