import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Searchbarr,
  SearchForm,
  SearchFormButton,
  SearchFormButtonLabel,
  SearchFormInput,
} from './Searchbar.styled';

export default function Searchbar({ onSubmit }) {
  const [name, setName] = useState('');

  const handleChange = event => {
    setName(event.currentTarget.value.toLowerCase());
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (name.trim() === '') {
      toast.error('Enter the name you are looking for!');
      return;
    }
    onSubmit(name);
    setName('');
  };

  return (
    <Searchbarr>
      <SearchForm onSubmit={handleSubmit}>
        <SearchFormButton type="submit">
          <SearchFormButtonLabel>Search</SearchFormButtonLabel>
        </SearchFormButton>

        <SearchFormInput
          className="input"
          type="text"
          autocomplete="off"
          value={name}
          onChange={handleChange}
          autoFocus
          placeholder="Search images and photos"
        />
      </SearchForm>
    </Searchbarr>
  );
}
