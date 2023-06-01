import {Controller, useFormContext} from "react-hook-form";
import TextField from "@mui/material/TextField";


export function TextInput({name, label}) {
  const {control} = useFormContext();

  return <Controller
    name={name}
    control={control}
    render={({field: {onChange, value}}) => (
      <TextField
        size='small'
        onChange={onChange}
        value={value}
        label={label}
        variant='outlined'
      />

    )}
  />;
}
