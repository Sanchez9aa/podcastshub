import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/infrastructure/query/queryClient";
import { AppRouter } from "@/router/AppRouter";
import { UIProvider } from "@/shared/context/UIContext";
import "./App.css";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider>
        <AppRouter />
      </UIProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
