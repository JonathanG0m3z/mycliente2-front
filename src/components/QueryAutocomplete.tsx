import { Autocomplete, TextField, createFilterOptions } from '@mui/material';

export interface AutocompleteOptionType {
  label: string | null;
  id?: string | null;
  inputValue?: string;
}

interface QueryAutocompleteProps {
  inputValue: AutocompleteOptionType | null;
  // eslint-disable-next-line no-unused-vars
  setInputValue: (value: AutocompleteOptionType | null) => void;
  options: AutocompleteOptionType[];
  // eslint-disable-next-line no-unused-vars
  setIsNewValue: (value: boolean) => void;
  loading: boolean;
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (value: boolean) => void;
  placeholder: string;
}

const QueryAutocomplete = ({ inputValue, setInputValue, options, setIsNewValue, loading, open, setOpen, placeholder }: QueryAutocompleteProps) => {
  const filter = createFilterOptions<AutocompleteOptionType>();
  return (
    <Autocomplete
      value={inputValue}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          setInputValue({
            label: newValue,
          });
          setIsNewValue(true);
        } else if (newValue && newValue.id) {
          setInputValue({
            ...newValue,
          });
          setIsNewValue(false);
        } else if (newValue && newValue.inputValue) {
          setInputValue({
            label: newValue.inputValue,
          });
          setIsNewValue(true);
        } else {
          setInputValue(newValue);
          setIsNewValue(false);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        const { inputValue } = params;
        const isExisting = options.some((option) => inputValue === option.label);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            label: `Agregar "${inputValue}"`,
          });
        }
        return filtered;
      }}
      selectOnFocus
      loading={loading}
      clearOnBlur
      handleHomeEndKeys
      id="client-name"
      options={options}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option;
        }
        if (option.label) {
          return option.label;
        }
        return option.label ?? '';
      }}
      renderOption={(props, option) => <li {...props}>{option.label}</li>}
      fullWidth
      freeSolo
      renderInput={(params) => <TextField {...params} label={placeholder} />}
    />
  );
};

export default QueryAutocomplete;
