import {useService} from "../../contexts/containerWrapper.tsx";
import {AutocompleteInput} from "./AutocompleteInput.tsx";
import {Control} from "react-hook-form";
import {map} from "rxjs";
import {UseFormGetValues} from "react-hook-form/dist/types/form";
import {TodoListService} from "../../services/providers/todoListService.ts";
import {TodoList} from "../../interfaces/TodoList.ts";


interface Params {
  name: string
  label: string
  control: Control<unknown, any>
  getValues: UseFormGetValues<any>
}

export function TodoListSelectInput({control, getValues, name, label}: Params) {

  const todoListService = useService('TodoListService') as TodoListService;

  const provider = (input: string) => {
    return todoListService.getCollection(input ? {title: input} : {}).pipe(map(page => page["hydra:member"] ?? []))
  }

  return <AutocompleteInput<TodoList>
    name={name}
    label={label}
    control={control}
    value={() => (getValues(name) as TodoList)}
    provider={provider}
    optionLabel='title'
    equality={(option, value) => value?.id === option?.id}
  />


}
