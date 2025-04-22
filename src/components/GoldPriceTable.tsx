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
  Badge,
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
} from "@chakra-ui/react";
import { fetchGoldPrices, GoldPrice } from "../services/goldService";
import { FaCalculator, FaSun, FaMoon } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

// Translations
const translations = {
  tr: {
    title: "Altın Fiyatları",
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
    transactionType: "İşlem Türü",
    buyGold: "Altın Al",
    sellGold: "Altın Sat",
    goldItems: "Altın Öğeleri",
    addItem: "Öğe Ekle",
    noItems: 'Öğe eklenmedi. Başlamak için "Öğe Ekle"ye tıklayın.',
    goldType: "Altın Türü",
    amount: "Miktar (gram)",
    cost: "Maliyet",
    value: "Değer",
    totalCost: "Toplam Maliyet",
    totalValue: "Toplam Değer",
    youWillPay: "Ödeyeceğiniz miktar",
    youWillReceive: "Alacağınız miktar",
    forYourGoldPurchase: "altın alımınız için",
    forYourGoldSale: "altın satışınız için",
    close: "Kapat",
    pricesUpdated: "Fiyatlar Güncellendi",
    goldPricesRefreshed: "Altın fiyatları yenilendi",
    error: "Hata",
    failedToFetch: "Altın fiyatları alınamadı",
  },
};

const GoldCard = ({
  price,
  t,
}: {
  price: GoldPrice;
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
  t,
}: {
  isOpen: boolean;
  onClose: () => void;
  prices: GoldPrice[];
  t: typeof translations.tr;
}) => {
  const [transactionType, setTransactionType] = useState<"buy" | "sell">("buy");
  const [selectedItems, setSelectedItems] = useState<
    Array<{ type: string; amount: number }>
  >([]);
  const [result, setResult] = useState<number | null>(null);

  // Reset calculator when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTransactionType("buy");
      setSelectedItems([]);
      setResult(null);
    }
  }, [isOpen]);

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
      <ModalContent bg={useColorModeValue("white", "gray.900")}>
        <ModalHeader color={useColorModeValue("gray.700", "white")}>
          {t.goldTransactionCalculator}
        </ModalHeader>
        <ModalCloseButton color={useColorModeValue("gray.500", "gray.300")} />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel color={useColorModeValue("gray.700", "gray.300")}>
                {t.transactionType}
              </FormLabel>
              <RadioGroup
                value={transactionType}
                onChange={(value) =>
                  setTransactionType(value as "buy" | "sell")
                }
              >
                <Stack direction="row">
                  <Radio
                    value="buy"
                    colorScheme={useColorModeValue("blue", "green")}
                  >
                    {t.buyGold}
                  </Radio>
                  <Radio
                    value="sell"
                    colorScheme={useColorModeValue("blue", "green")}
                  >
                    {t.sellGold}
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <Divider borderColor={useColorModeValue("gray.200", "gray.700")} />

            <Box>
              <Flex justify="space-between" align="center" mb={2}>
                <Text
                  fontWeight="bold"
                  color={useColorModeValue("gray.700", "white")}
                >
                  {t.goldItems}
                </Text>
                <Button
                  size="sm"
                  colorScheme={useColorModeValue("blue", "green")}
                  onClick={addItem}
                >
                  {t.addItem}
                </Button>
              </Flex>

              {selectedItems.length === 0 ? (
                <Text
                  color={useColorModeValue("gray.500", "gray.400")}
                  textAlign="center"
                  py={4}
                >
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
                      bg={useColorModeValue("white", "gray.800")}
                      borderColor={useColorModeValue("gray.200", "gray.700")}
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
                          <FormLabel
                            color={useColorModeValue("gray.700", "gray.300")}
                          >
                            {t.goldType}
                          </FormLabel>
                          <Select
                            placeholder={t.goldType}
                            value={item.type}
                            onChange={(e) =>
                              updateItem(index, "type", e.target.value)
                            }
                            bg={useColorModeValue("white", "gray.700")}
                            color={useColorModeValue("gray.800", "white")}
                            borderColor={useColorModeValue(
                              "gray.300",
                              "gray.600"
                            )}
                            _hover={{
                              borderColor: useColorModeValue(
                                "gray.400",
                                "gray.500"
                              ),
                            }}
                            _focus={{
                              borderColor: useColorModeValue(
                                "blue.500",
                                "green.500"
                              ),
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
                          <FormLabel
                            color={useColorModeValue("gray.700", "gray.300")}
                          >
                            {t.amount}
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
                              bg={useColorModeValue("white", "gray.700")}
                              color={useColorModeValue("gray.800", "white")}
                              borderColor={useColorModeValue(
                                "gray.300",
                                "gray.600"
                              )}
                              _hover={{
                                borderColor: useColorModeValue(
                                  "gray.400",
                                  "gray.500"
                                ),
                              }}
                              _focus={{
                                borderColor: useColorModeValue(
                                  "blue.500",
                                  "green.500"
                                ),
                              }}
                            />
                            <NumberInputStepper>
                              <NumberIncrementStepper
                                color={useColorModeValue(
                                  "gray.600",
                                  "gray.300"
                                )}
                              />
                              <NumberDecrementStepper
                                color={useColorModeValue(
                                  "gray.600",
                                  "gray.300"
                                )}
                              />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>
                      </SimpleGrid>

                      {item.type && item.amount > 0 && (
                        <Box
                          mt={2}
                          p={2}
                          bg={useColorModeValue("gray.50", "gray.700")}
                          borderRadius="md"
                        >
                          <Text
                            fontSize="sm"
                            color={useColorModeValue("gray.700", "gray.200")}
                          >
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

            <Divider borderColor={useColorModeValue("gray.200", "gray.700")} />

            {result !== null && result > 0 && (
              <Box
                p={4}
                bg={useColorModeValue("gray.50", "gray.700")}
                borderRadius="md"
              >
                <Text
                  fontWeight="bold"
                  mb={2}
                  color={useColorModeValue("gray.700", "white")}
                >
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
                <Text
                  fontSize="sm"
                  color={useColorModeValue("gray.500", "gray.400")}
                  mt={2}
                >
                  {transactionType === "buy"
                    ? `${t.youWillPay} ${result.toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })} ${t.forYourGoldPurchase}`
                    : `${t.youWillReceive} ${result.toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })} ${t.forYourGoldSale}`}
                </Text>
              </Box>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme={useColorModeValue("blue", "green")}
            mr={3}
            onClick={onClose}
          >
            {t.close}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const GoldPriceTable = () => {
  const [prices, setPrices] = useState<GoldPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  const t = translations.tr;

  const fetchPrices = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const data = await fetchGoldPrices();
      setPrices(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching gold prices:", error);
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
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")} py={8}>
      <Container maxW="container.xl">
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Flex justifyContent="space-between" alignItems="center" mb={8}>
            <Box>
              <Heading
                as="h1"
                size="xl"
                mb={2}
                color={useColorModeValue("gray.800", "white")}
              >
                {t.title}
              </Heading>
              <Flex alignItems="center" gap={2}>
                <Text
                  color={useColorModeValue("gray.500", "gray.400")}
                  fontSize="sm"
                >
                  {t.lastUpdated}: {lastUpdated.toLocaleString()}
                </Text>
                <Badge colorScheme="green">{t.live}</Badge>
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
                  color={useColorModeValue("gray.700", "white")}
                  borderColor={useColorModeValue("gray.300", "gray.600")}
                  _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
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
                  color={useColorModeValue("purple.600", "pink.300")}
                  borderColor={useColorModeValue("purple.300", "pink.700")}
                  _hover={{ bg: useColorModeValue("purple.50", "pink.900") }}
                >
                  {t.calculator}
                </Button>
              </Tooltip>
            </Flex>
          </Flex>
        </MotionBox>

        {isInitialLoad && loading ? (
          <Flex justify="center" align="center" minH="300px">
            <Spinner
              size="xl"
              color={useColorModeValue("blue.500", "cyan.400")}
              thickness="4px"
            />
          </Flex>
        ) : (
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={6}
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: "0.5s", delay: "0.2s" }}
          >
            {prices.map((price, index) => (
              <GoldCard key={index} price={price} t={t} />
            ))}
          </SimpleGrid>
        )}

        <CalculatorModal
          isOpen={isOpen}
          onClose={onClose}
          prices={prices}
          t={t}
        />
      </Container>
    </Box>
  );
};
