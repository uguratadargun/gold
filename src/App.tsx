import { ChakraProvider, Box } from "@chakra-ui/react";
import { PriceTracker } from "./components/PriceTracker";

function App() {
  return (
    <ChakraProvider>
      <Box minH="100vh" bg="gray.50">
        <PriceTracker />
      </Box>
    </ChakraProvider>
  );
}

export default App;
