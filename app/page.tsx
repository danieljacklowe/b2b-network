// Notice the "./" at the start? That means "Look in the current folder"
import Hero from './components/Hero';
import WaitlistForm from './components/WaitlistForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
      <Hero />
      <div className="-mt-20 z-20 w-full px-4 pb-20">
        <WaitlistForm />
      </div>
      <footer className="w-full py-8 text-center text-slate-600 text-sm">
        <p>&copy; 2024 B2B Exchange Network. All Rights Reserved.</p>
      </footer>
    </main>
  );
}