import { atom, selector } from 'recoil';
import { IMovie } from './api';

export const searchTvResult = atom<IMovie[]>({
  key: 'searchTv',
  default: [],
});

export const searchKeyword = atom<string>({
  key: 'keyword',
  default: '',
});