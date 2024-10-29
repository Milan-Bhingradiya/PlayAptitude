"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
};

const ReactQueryProvider = ({ children }: Props) => {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // refetchInterval: 3000, // TODO uncomment this line before production...
          },
        },
      })
  );
  return (
    <QueryClientProvider client={client}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} />  // TODO to remove @tanstack/react-query-devtools from package.json */}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
