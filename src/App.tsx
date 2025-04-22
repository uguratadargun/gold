import { ChakraProvider, Box } from "@chakra-ui/react";
import { GoldPriceTable } from "./components/GoldPriceTable";

function App() {
  return (
    <ChakraProvider>
      <Box minH="100vh" bg="gray.50">
        <GoldPriceTable />
      </Box>
    </ChakraProvider>
  );
}

export default App;
