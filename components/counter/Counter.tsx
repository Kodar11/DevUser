'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { decrement, increment, setValue, selectCount } from '@/lib/redux/features/count/counterSlice';

export const Counter = () => {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectCount);

  const [incrementAmount, setIncrementAmount] = useState('2');
  const incrementValue = Number(incrementAmount) || 0;

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-center">Counter</h1>
      <div className="flex justify-center items-center space-x-4">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
        <span className="text-xl font-semibold">{count}</span>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <input
          type="number"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-24 text-center"
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => dispatch(setValue(incrementValue))}
        >
          Set Value
        </button>
      </div>
    </div>
  );
};
