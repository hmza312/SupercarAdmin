import { useState } from 'react';

type State = {
   [key: string]: {
      value: any;
      error: null | string;
   };
};

type UpdateValue = (key: string, value: any) => void;

const useReduceState = (initialState: State): [State, UpdateValue] => {
   const [state, setState] = useState<State>(initialState);

   const updateValue: UpdateValue = (key, value) => {
      setState((prevState) => ({
         ...prevState,
         [key]: value
      }));
   };

   return [state, updateValue];
};

export default useReduceState;
