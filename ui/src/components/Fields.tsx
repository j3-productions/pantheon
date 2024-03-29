import React, { KeyboardEventHandler, useCallback, useState } from 'react';
import {
  ActionMeta, components, ControlProps, OnChangeValue,
  MultiValue, MultiValueGenericProps, MultiValueRemoveProps
} from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { XMarkIcon } from '@heroicons/react/24/solid';

import * as Type from '../types/pantheon';

// TODO: Make the placeholder text color a light gray, like all the other fields.

const createOption = (label: string) => ({
  label,
  value: label,
});

function Control({children, ...props}: ControlProps<Type.FieldOption, true>) {
  return (
    <components.Control
      {...props}
      className="flex items-center w-full py-1 px-2 bg-bgp2/30 rounded-lg border border-bgp2/30 cursor-text text-fgp1"
    >
      {children}
    </components.Control>
  );
}

function TagContainer({
  children,
  ...props
}: MultiValueGenericProps<Type.FieldOption, true>) {
  return (
    <components.MultiValueContainer {...props}>
      <div className="flex">{children}</div>
    </components.MultiValueContainer>
  );
}

function TagLabel({data}: {data: Type.FieldOption}) {
  const { value, label } = data;
  return (
    <div className="flex h-6 items-center rounded-l bg-bgs2 text-bgp1">
      <span className="p-1 font-semibold">{label || value}</span>
    </div>
  );
}

function TagRemove(props: MultiValueRemoveProps<Type.FieldOption, true>) {
  return (
    <components.MultiValueRemove {...props}>
      <div className="flex h-full items-center rounded-r bg-bgs2 pr-1">
        <XMarkIcon className="h-4 w-4 text-bgp1" />
      </div>
    </components.MultiValueRemove>
  );
}

export const TagField = ({tags, onTags, className}: {
    tags: MultiValue<Type.FieldOption>;
    onTags: (tags: MultiValue<Type.FieldOption>) => void;
    className?: string;
  }) => {
  const [input, setInput] = useState('');

  const handleChange = useCallback((
    value: OnChangeValue<Type.FieldOption, true>,
    actionMeta: ActionMeta<Type.FieldOption>
  ) => {
    onTags(value);
  }, []);

  const handleInputChange = useCallback((value) => {
    setInput(value);
  }, []);

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback((event) => {
    if (!input) return;

    switch (event.key) {
      case 'Enter':
      case 'Tab':
        setInput('');
        onTags([...tags, createOption(input)])
        event.preventDefault();
    }
  }, [input, tags]);

  return (
    <CreatableSelect<Type.FieldOption, true>
      className={className}
      components={{
        ...components,
        Control,
        MultiValueContainer: TagContainer,
        MultiValueLabel: TagLabel,
        MultiValueRemove: TagRemove,
        DropdownIndicator: null
      }}
      styles={{
        control: (base, state) => ({
          boxShadow: `var(--tw-ring-inset) 0 0 0 calc(${state.isFocused ? 2 : 0}px + var(--tw-ring-offset-width)) var(--tw-ring-color);`,
          '--tw-ring-color': '#657B83',
        }),
        input: (base) => ({
          ...base,
          padding: 0,
          margin: 0,
        }),
        clearIndicator: (base) => ({
          ...base,
          cursor: 'pointer',
          padding: 0
        }),
        multiValue: (base) => ({
          ...base,
          backgroundColor: '',
          margin: '0 2px',
        }),
        multiValueRemove: (base) => ({
          ...base,
          paddingRight: '',
          paddingLeft: '',
          '&:hover': {
            color: 'inherit',
            backgroundColor: 'inherit',
          },
        }),
        valueContainer: (base) => ({
          ...base,
          padding: 0
        })
      }}
      isOptionDisabled={() => tags.length >= 8}
      inputValue={input}
      isClearable
      isMulti
      menuIsOpen={false}
      onChange={handleChange}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder="Type something and press tab or enter..."
      value={tags}
    />
  );
}
