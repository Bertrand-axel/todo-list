import {User} from "../../interfaces/User.ts";
import {useService} from "../../contexts/containerWrapper.tsx";
import {UserService} from "../../services/providers/userService.ts";
import {AutocompleteInput} from "./AutocompleteInput.tsx";
import {Control} from "react-hook-form";
import {map} from "rxjs";
import {UseFormGetValues} from "react-hook-form/dist/types/form";


interface Params {
  name: string
  label: string
  control: Control<unknown, any>
  getValues: UseFormGetValues<any>
}

export function UserSelectInput({control, getValues, name, label}: Params) {

  const userService = useService('UserService') as UserService;

  const provider = (input: string) => {
    return userService.getCollection(input ? {username: input} : {}).pipe(map(page => page["hydra:member"] ?? []))
  }

  return <AutocompleteInput<User>
    name={name}
    label={label}
    control={control}
    value={() => getValues(name)}
    provider={provider}
    optionLabel={'username'}
    equality={(option, value) => value?.id === option?.id}
  />


}
