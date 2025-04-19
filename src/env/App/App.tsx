import type { FC } from 'react';

import { Counter, WaveVisualizer } from '@/lib';
import './index.css';

const App: FC = () => {
  return (
    <div>
      <Counter />
      <WaveVisualizer />
    </div>
  );
};

export default App;
