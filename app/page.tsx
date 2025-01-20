import { Counter } from '@/components/counter/Counter';
import { Quotes } from '@/components/quotes/Quotes';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <Counter />
      <Quotes/>
    </main>
  );
}
