import { Autocomplete, AutocompleteProps, createFilterOptions } from '@mui/material';

export interface AutocompleteOptionType {
  label: string | null;
  id?: string | null;
  inputValue?: string;
}

interface QueryAutocompleteProps extends AutocompleteProps<AutocompleteOptionType, false, false, true> {
  optionSelected: AutocompleteOptionType | null;
  // eslint-disable-next-line no-unused-vars
  setOptionSelected: (value: AutocompleteOptionType | null) => void;
  options: AutocompleteOptionType[];
  // eslint-disable-next-line no-unused-vars
  setIsNewValue: (value: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onChangeControl?: (value: string | AutocompleteOptionType | null) => void;
}

const QueryAutocomplete = ({ optionSelected, setOptionSelected, options = [], setIsNewValue, onChangeControl, ...autoCompleteProps }: QueryAutocompleteProps) => {
  const filter = createFilterOptions<AutocompleteOptionType>();
  return (
    <Autocomplete
      {...autoCompleteProps}
      value={optionSelected}
      onChange={(event, newValue) => {
        if (onChangeControl) onChangeControl(newValue);
        if (typeof newValue === 'string') {
          setOptionSelected({
            label: newValue,
          });
          setIsNewValue(true);
        } else if (newValue && newValue.id) {
          setOptionSelected({
            ...newValue,
          });
          setIsNewValue(false);
        } else if (newValue && newValue.inputValue) {
          setOptionSelected({
            label: newValue.inputValue,
          });
          setIsNewValue(true);
        } else {
          setOptionSelected(newValue);
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
      clearOnBlur
      handleHomeEndKeys
      options={options}
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
    />
  );
};

export default QueryAutocomplete;
