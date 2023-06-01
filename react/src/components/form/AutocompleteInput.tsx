import {Control, Controller} from "react-hook-form";
import {Observable} from "rxjs";
import {useEffect, useState} from "react";
import {Autocomplete} from "@mui/material";
import TextField from "@mui/material/TextField";

interface Params<T> {
  name: string, // the name of the form field
  label: string,
  control: Control<unknown, any>; // the react-hook-form control option of the form
  value: () => (T | null | undefined), // from react-hook-form, allows to access the current value of the field

  // a function that, given the filtering text returns an Observable that emits a
  // single value being the list of filtered options
  provider: (input: string) => Observable<T[]>;
  // the field to display in the list of options, also used for the selected value
  // could use separate parameters like valueLabel or an optionRenderer like the original
  // mui component has but that would be pushing too far for our use
  optionLabel: string;
  // function taking an option and the current value,
  // telling if they represent the same element value
  equality: (option: T, value: T) => boolean;
}

export function AutocompleteInput<T extends unknown>({
                                                       name,
                                                       label,
                                                       control,
                                                       value,
                                                       provider,
                                                       optionLabel = 'label',
                                                       equality = (option, value) => option === value,
                                                     }: Params<T>) {

  const currentValue = value();
  const [options, setOptions] = useState<T[]>(currentValue ? [currentValue] : []);

  const onInputChange = function (event, input) {

    // launch search for input value in order to update the list of options
    provider(input).subscribe((options) => {
      const currentValue = value();
      // if current is not in the listed ones, add it in order to avoid tha Autocomplete component to warn use
      // about the selected value not available in the options.
      if (currentValue !== null && currentValue !== undefined && !options.some((option) => equality(option, currentValue))) {
        options = [currentValue, ...options];
      }
      console.log('seto', options);
      setOptions(options);
    })
  }

  // initialize options
  useEffect(() => {
    const current = value();
    if (current === null || current === undefined) {
      onInputChange(null, '')
    }
  }, []);

  return (

    <Controller
      name={name}
      control={control}
      render={({field}) => {
        const {onChange, value} = field;
        return <Autocomplete
          {...field}
          value={value ?? null}
          getOptionLabel={(option) => option[optionLabel]}
          onChange={(event, value) => onChange(value ?? null)}
          options={options}
          renderInput={(params) => (
            <TextField {...params} label={label}/>
          )}
          onInputChange={onInputChange}
          isOptionEqualToValue={equality}

        />
      }}
    />
  );
}
