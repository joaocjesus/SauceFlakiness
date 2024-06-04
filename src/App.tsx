import { TestCasesContainer } from "./components/TestCases/TestCasesContainer";

export interface TestResults {
  name: string;
  passed?: number;
  failed?: number;
  error?: number;
  complete?: number;
  total_runs: number;
}

function App() {
  return (
    <div className="relative mx-auto">
      <h1 className="p-3 text-2xl h-14 text-center bg-primary text-white font-bold">
        SauceLabs Stats
      </h1>
      <TestCasesContainer />
    </div>
  );
}

export default App;
