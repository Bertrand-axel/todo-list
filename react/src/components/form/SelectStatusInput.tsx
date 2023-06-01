import {SelectInput} from "./SelectInput.tsx";
import {Control} from "react-hook-form";
import {MenuItem} from "@mui/material";


interface Params {
  name: string,
  label: string,
  control: Control<unknown, any>,
}

export function SelectStatusInput({label, control, name}: Params) {

  return <SelectInput name={name} control={control} label={label} defaultValue='WAITING'>
    <MenuItem value='WAITING'>Waiting</MenuItem>
    <MenuItem value='DOING'>Doing</MenuItem>
    <MenuItem value='DONE'>Done</MenuItem>
  </SelectInput>
}
