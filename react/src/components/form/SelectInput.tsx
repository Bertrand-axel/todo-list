import {Control, Controller} from "react-hook-form";
import {FormControl, InputLabel, Select} from "@mui/material";

interface Params {
  name: string,
  label: string,
  control: Control<unknown, any>,
}

export function SelectInput({label, children, control, name}: Params) {

  return <FormControl sx={{ m: 1, minWidth: 120 }}>
    <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel>
    <Controller
      render={({field}) => {
        const {onChange, value} = field;
        return <Select
          {...field}
          label={label}
        >
          {children}
        </Select>;
      }}
      name={name}
      control={control}
    />

  </FormControl>
}
