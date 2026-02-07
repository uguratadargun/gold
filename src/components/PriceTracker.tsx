import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Container,
  Button,
  Icon,
  useColorModeValue,
  Flex,
  Tooltip,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Radio,
  RadioGroup,
  Stack,
  Divider,
  useColorMode,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import {
  fetchGoldPrices,
  fetchCurrencyPrices,
  PriceDisplay,
} from "../services/priceService";
import { FaCalculator, FaSun, FaMoon } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

// Translations
const translations = {
  tr: {
    title: "Altın ve Döviz Fiyatları",
    goldTab: "Altın",
    currencyTab: "Döviz",
    lastUpdated: "Son güncelleme",
    live: "Canlı",
    refresh: "Yenile",
    calculator: "Hesaplayıcı",
    calculateTransactions: "İşlemleri hesapla",
    buying: "Alış",
    selling: "Satış",
    buyPrice: "Alış Fiyatı",
    sellPrice: "Satış Fiyatı",
    goldTransactionCalculator: "Altın İşlem Hesaplayıcı",
    currencyTransactionCalculator: "Döviz İşlem Hesaplayıcı",
    transactionType: "İşlem Türü",
    buyGold: "Altın Al",
    sellGold: "Altın Sat",
    buyCurrency: "Döviz Al",
    sellCurrency: "Döviz Sat",
    goldItems: "Altın Öğeleri",
    currencyItems: "Döviz Öğeleri",
    addItem: "Öğe Ekle",
    noItems: 'Öğe eklenmedi. Başlamak için "Öğe Ekle"ye tıklayın.',
    goldType: "Altın Türü",
    currencyType: "Döviz Türü",
    amount: "Miktar",
    amountGram: "Miktar (gram)",
    amountCurrency: "Miktar",
    cost: "Maliyet",
    value: "Değer",
    totalCost: "Toplam Maliyet",
    totalValue: "Toplam Değer",
    youWillPay: "Ödeyeceğiniz miktar",
    youWillReceive: "Alacağınız miktar",
    forYourGoldPurchase: "altın alımınız için",
    forYourGoldSale: "altın satışınız için",
    forYourCurrencyPurchase: "döviz alımınız için",
    forYourCurrencySale: "döviz satışınız için",
    close: "Kapat",
    pricesUpdated: "Fiyatlar Güncellendi",
    goldPricesRefreshed: "Fiyatlar yenilendi",
    error: "Hata",
    failedToFetch: "Fiyatlar alınamadı",
  },
};

const PriceCard = ({
  price,
  t,
}: {
  price: PriceDisplay;
  t: typeof translations.tr;
}) => {
  const cardBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue("gray.700", "white");
  const labelColor = useColorModeValue("gray.600", "gray.300");

  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        p={6}
        borderRadius="xl"
        boxShadow={useColorModeValue("lg", "dark-lg")}
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        _hover={{
          transform: "translateY(-4px)",
          boxShadow: useColorModeValue("2xl", "dark-xl"),
        }}
        transition="all 0.2s"
      >
        <Heading size="md" mb={4} color={headingColor}>
          {price.type}
        </Heading>
        <Flex justify="space-between" gap={4}>
          <Stat>
            <StatLabel color={labelColor}>{t.buying}</StatLabel>
            <StatNumber color="green.400" fontSize="xl">
              {price.buying}
            </StatNumber>
            <StatHelpText color={labelColor}>
              <StatArrow type="increase" />
              {t.buyPrice}
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel color={labelColor}>{t.selling}</StatLabel>
            <StatNumber color="red.400" fontSize="xl">
              {price.selling}
            </StatNumber>
            <StatHelpText color={labelColor}>
              <StatArrow type="decrease" />
              {t.sellPrice}
            </StatHelpText>
          </Stat>
        </Flex>
      </Box>
    </MotionBox>
  );
};

const CalculatorModal = ({
  isOpen,
  onClose,
  prices,
  isGold,
  t,
}: {
  isOpen: boolean;
  onClose: () => void;
  prices: PriceDisplay[];
  isGold: boolean;
  t: typeof translations.tr;
}) => {
  const [transactionType, setTransactionType] = useState<"buy" | "sell">("buy");
  const [selectedItems, setSelectedItems] = useState<
    Array<{ type: string; amount: number }>
  >([]);
  const [result, setResult] = useState<number | null>(null);

  // Color mode values - hepsini en başta tanımla
  const modalBg = useColorModeValue("white", "gray.900");
  const headerColor = useColorModeValue("gray.700", "white");
  const closeButtonColor = useColorModeValue("gray.500", "gray.300");
  const labelColor = useColorModeValue("gray.700", "gray.300");
  const radioColorScheme = useColorModeValue("blue", "green");
  const dividerColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "white");
  const buttonColorScheme = useColorModeValue("blue", "green");
  const itemTextColor = useColorModeValue("gray.500", "gray.400");
  const itemBg = useColorModeValue("white", "gray.800");
  const itemBorderColor = useColorModeValue("gray.200", "gray.700");
  const selectBg = useColorModeValue("white", "gray.700");
  const selectColor = useColorModeValue("gray.800", "white");
  const selectBorderColor = useColorModeValue("gray.300", "gray.600");
  const selectHoverBorderColor = useColorModeValue("gray.400", "gray.500");
  const selectFocusBorderColor = useColorModeValue("blue.500", "green.500");
  const stepperColor = useColorModeValue("gray.600", "gray.300");
  const costBg = useColorModeValue("gray.50", "gray.700");
  const costTextColor = useColorModeValue("gray.700", "gray.200");
  const resultBg = useColorModeValue("gray.50", "gray.700");
  const resultTextColor = useColorModeValue("gray.700", "white");
  const resultSubTextColor = useColorModeValue("gray.500", "gray.400");

  // Reset calculator when modal is closed or tab changes
  useEffect(() => {
    if (!isOpen) {
      setTransactionType("buy");
      setSelectedItems([]);
      setResult(null);
    }
  }, [isOpen, isGold]);

  const addItem = () => {
    setSelectedItems([...selectedItems, { type: "", amount: 1 }]);
  };

  const removeItem = (index: number) => {
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    setSelectedItems(newItems);
  };

  const updateItem = (
    index: number,
    field: "type" | "amount",
    value: string | number
  ) => {
    const newItems = [...selectedItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setSelectedItems(newItems);
  };

  const calculateResult = () => {
    if (selectedItems.length === 0) return;

    let total = 0;

    selectedItems.forEach((item) => {
      if (!item.type || item.amount <= 0) return;

      const selectedPrice = prices.find((p) => p.type === item.type);
      if (!selectedPrice) return;

      const priceValue =
        transactionType === "buy"
          ? parseFloat(
              selectedPrice.selling.replace(/[^0-9,]/g, "").replace(",", ".")
            )
          : parseFloat(
              selectedPrice.buying.replace(/[^0-9,]/g, "").replace(",", ".")
            );

      total += priceValue * item.amount;
    });

    setResult(total);
  };

  useEffect(() => {
    if (
      selectedItems.length > 0 &&
      selectedItems.some((item) => item.type && item.amount > 0)
    ) {
      calculateResult();
    } else {
      setResult(null);
    }
  }, [selectedItems, transactionType]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={modalBg}>
        <ModalHeader color={headerColor}>
          {isGold ? t.goldTransactionCalculator : t.currencyTransactionCalculator}
        </ModalHeader>
        <ModalCloseButton color={closeButtonColor} />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel color={labelColor}>
                {t.transactionType}
              </FormLabel>
              <RadioGroup
                value={transactionType}
                onChange={(value) =>
                  setTransactionType(value as "buy" | "sell")
                }
              >
                <Stack direction="row">
                  <Radio value="buy" colorScheme={radioColorScheme}>
                    {isGold ? t.buyGold : t.buyCurrency}
                  </Radio>
                  <Radio value="sell" colorScheme={radioColorScheme}>
                    {isGold ? t.sellGold : t.sellCurrency}
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <Divider borderColor={dividerColor} />

            <Box>
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontWeight="bold" color={textColor}>
                  {isGold ? t.goldItems : t.currencyItems}
                </Text>
                <Button
                  size="sm"
                  colorScheme={buttonColorScheme}
                  onClick={addItem}
                >
                  {t.addItem}
                </Button>
              </Flex>

              {selectedItems.length === 0 ? (
                <Text color={itemTextColor} textAlign="center" py={4}>
                  {t.noItems}
                </Text>
              ) : (
                <Stack spacing={4}>
                  {selectedItems.map((item, index) => (
                    <Box
                      key={index}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      position="relative"
                      bg={itemBg}
                      borderColor={itemBorderColor}
                    >
                      <Button
                        size="xs"
                        colorScheme="red"
                        position="absolute"
                        top={2}
                        right={2}
                        onClick={() => removeItem(index)}
                      >
                        ×
                      </Button>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl>
                          <FormLabel color={labelColor}>
                            {isGold ? t.goldType : t.currencyType}
                          </FormLabel>
                          <Select
                            placeholder={isGold ? t.goldType : t.currencyType}
                            value={item.type}
                            onChange={(e) =>
                              updateItem(index, "type", e.target.value)
                            }
                            bg={selectBg}
                            color={selectColor}
                            borderColor={selectBorderColor}
                            _hover={{
                              borderColor: selectHoverBorderColor,
                            }}
                            _focus={{
                              borderColor: selectFocusBorderColor,
                            }}
                          >
                            {prices.map((price, idx) => (
                              <option key={idx} value={price.type}>
                                {price.type}
                              </option>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel color={labelColor}>
                            {isGold ? t.amountGram : t.amountCurrency}
                          </FormLabel>
                          <NumberInput
                            min={1}
                            step={1}
                            value={item.amount}
                            onChange={(_, value) =>
                              updateItem(index, "amount", value)
                            }
                          >
                            <NumberInputField
                              bg={selectBg}
                              color={selectColor}
                              borderColor={selectBorderColor}
                              _hover={{
                                borderColor: selectHoverBorderColor,
                              }}
                              _focus={{
                                borderColor: selectFocusBorderColor,
                              }}
                            />
                            <NumberInputStepper>
                              <NumberIncrementStepper color={stepperColor} />
                              <NumberDecrementStepper color={stepperColor} />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>
                      </SimpleGrid>

                      {item.type && item.amount > 0 && (
                        <Box mt={2} p={2} bg={costBg} borderRadius="md">
                          <Text fontSize="sm" color={costTextColor}>
                            {transactionType === "buy" ? t.cost : t.value}:{" "}
                            {(() => {
                              const selectedPrice = prices.find(
                                (p) => p.type === item.type
                              );
                              if (!selectedPrice) return "0";

                              const priceValue =
                                transactionType === "buy"
                                  ? parseFloat(
                                      selectedPrice.selling
                                        .replace(/[^0-9,]/g, "")
                                        .replace(",", ".")
                                    )
                                  : parseFloat(
                                      selectedPrice.buying
                                        .replace(/[^0-9,]/g, "")
                                        .replace(",", ".")
                                    );

                              return (priceValue * item.amount).toLocaleString(
                                "tr-TR",
                                {
                                  style: "currency",
                                  currency: "TRY",
                                }
                              );
                            })()}
                          </Text>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>

            <Divider borderColor={dividerColor} />

            {result !== null && result > 0 && (
              <Box p={4} bg={resultBg} borderRadius="md">
                <Text fontWeight="bold" mb={2} color={resultTextColor}>
                  {transactionType === "buy" ? t.totalCost : t.totalValue}:
                </Text>
                <Text
                  fontSize="2xl"
                  color={transactionType === "buy" ? "green.400" : "blue.400"}
                >
                  {result.toLocaleString("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  })}
                </Text>
                <Text fontSize="sm" color={resultSubTextColor} mt={2}>
                  {transactionType === "buy"
                    ? `${t.youWillPay} ${result.toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })} ${isGold ? t.forYourGoldPurchase : t.forYourCurrencyPurchase}`
                    : `${t.youWillReceive} ${result.toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })} ${isGold ? t.forYourGoldSale : t.forYourCurrencySale}`}
                </Text>
              </Box>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme={buttonColorScheme} mr={3} onClick={onClose}>
            {t.close}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const PriceTracker = () => {
  const [goldPrices, setGoldPrices] = useState<PriceDisplay[]>([]);
  const [currencyPrices, setCurrencyPrices] = useState<PriceDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeTab, setActiveTab] = useState(0); // 0: Altın, 1: Döviz
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  // Tüm color mode values'ları en başta tanımla
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.500", "gray.400");
  const buttonColor = useColorModeValue("gray.700", "white");
  const buttonBorderColor = useColorModeValue("gray.300", "gray.600");
  const buttonHoverBg = useColorModeValue("gray.50", "gray.700");
  const purpleColor = useColorModeValue("purple.600", "pink.300");
  const purpleBorderColor = useColorModeValue("purple.300", "pink.700");
  const purpleHoverBg = useColorModeValue("purple.50", "pink.900");
  const spinnerColor = useColorModeValue("blue.500", "cyan.400");
  const tabColorScheme = useColorModeValue("blue", "green");
  const tabSelectedColor = useColorModeValue("blue.600", "green.400");
  const tabSelectedBorderColor = useColorModeValue("blue.600", "green.400");
  const tabSelectedBorderBottomColor = useColorModeValue("white", "gray.900");

  const t = translations.tr;

  const fetchPrices = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const [goldData, currencyData] = await Promise.all([
        fetchGoldPrices(),
        fetchCurrencyPrices(),
      ]);
      setGoldPrices(goldData);
      setCurrencyPrices(currencyData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching prices:", error);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchPrices(true);
    // Set up automatic refresh every 30 seconds
    const interval = setInterval(() => fetchPrices(false), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="container.xl">
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Flex justifyContent="space-between" alignItems="center" mb={8}>
            <Box>
              <Heading as="h1" size="xl" mb={2} color={headingColor}>
                {t.title}
              </Heading>
              <Flex alignItems="center" gap={2}>
                <Text color={textColor} fontSize="sm">
                  {t.lastUpdated}: {lastUpdated.toLocaleString()}
                </Text>
              </Flex>
            </Box>
            <Flex gap={3}>
              <Tooltip
                label={colorMode === "light" ? "Karanlık Mod" : "Aydınlık Mod"}
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleColorMode}
                  color={buttonColor}
                  borderColor={buttonBorderColor}
                  _hover={{ bg: buttonHoverBg }}
                  w="32px"
                  h="32px"
                  p="0"
                  minW="32px"
                >
                  <Icon
                    as={colorMode === "light" ? FaMoon : FaSun}
                    boxSize="16px"
                  />
                </Button>
              </Tooltip>

              <Tooltip label={t.calculateTransactions} placement="left">
                <Button
                  leftIcon={<Icon as={FaCalculator} />}
                  colorScheme={useColorModeValue("purple", "pink")}
                  variant="outline"
                  size="sm"
                  onClick={onOpen}
                  color={purpleColor}
                  borderColor={purpleBorderColor}
                  _hover={{ bg: purpleHoverBg }}
                >
                  {t.calculator}
                </Button>
              </Tooltip>
            </Flex>
          </Flex>
        </MotionBox>

        {isInitialLoad && loading ? (
          <Flex justify="center" align="center" minH="300px">
            <Spinner size="xl" color={spinnerColor} thickness="4px" />
          </Flex>
        ) : (
          <Tabs
            colorScheme={tabColorScheme}
            variant="enclosed"
            index={activeTab}
            onChange={(index) => setActiveTab(index)}
          >
            <TabList mb={6}>
              <Tab
                _selected={{
                  color: tabSelectedColor,
                  borderColor: tabSelectedBorderColor,
                  borderBottomColor: tabSelectedBorderBottomColor,
                }}
                fontWeight="bold"
              >
                {t.goldTab}
              </Tab>
              <Tab
                _selected={{
                  color: tabSelectedColor,
                  borderColor: tabSelectedBorderColor,
                  borderBottomColor: tabSelectedBorderBottomColor,
                }}
                fontWeight="bold"
              >
                {t.currencyTab}
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0}>
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3 }}
                  spacing={6}
                  as={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: "0.5s", delay: "0.2s" }}
                >
                  {goldPrices.map((price, index) => (
                    <PriceCard key={index} price={price} t={t} />
                  ))}
                </SimpleGrid>
              </TabPanel>

              <TabPanel p={0}>
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3 }}
                  spacing={6}
                  as={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: "0.5s", delay: "0.2s" }}
                >
                  {currencyPrices.map((price, index) => (
                    <PriceCard key={index} price={price} t={t} />
                  ))}
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}

        <CalculatorModal
          isOpen={isOpen}
          onClose={onClose}
          prices={activeTab === 0 ? goldPrices : currencyPrices}
          isGold={activeTab === 0}
          t={t}
        />
      </Container>
    </Box>
  );
};
