import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Select,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
  Heading,
  Text,
  Badge,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  InputGroup,
  InputLeftElement,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useState, useEffect, useMemo } from "react";
import {
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaEdit,
  FaFilePdf,
  FaClipboardList,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaSearch,
  FaFolderOpen,
  FaAward,
  FaFileAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";
import {
  getAllBoardProceedings,
  createBoardProceeding,
  updateBoardProceeding,
  deleteBoardProceeding,
  showErrorToast,
} from "views/utils/axiosInstance";

const CATEGORIES = [
  { value: "BP's & Orders", label: "BP's & Orders" },
  { value: "Panels & Promotion", label: "Panels & Promotion" },
];

function BoardProceedings() {
  const textColor = useColorModeValue("gray.700", "white");
  const customColor = "#0A3D91";
  const customHoverColor = "#1E88E5";
  const toast = useToast();

  const [currentView, setCurrentView] = useState("list"); // "list" | "add" | "edit"
  const [loading, setLoading] = useState(false);
  const [proceedings, setProceedings] = useState([]);
  const [editingProceeding, setEditingProceeding] = useState(null);

  // Filter & Search states
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "BP's & Orders",
    document: null,
  });

  useEffect(() => {
    fetchProceedings();
  }, []);

  const fetchProceedings = async () => {
    setLoading(true);
    try {
      const data = await getAllBoardProceedings();
      const list = Array.isArray(data) ? data : [];

      // Sort descending by date/createdAt
      const sorted = [...list].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        if (dateA && dateB && dateA !== dateB && !isNaN(dateA) && !isNaN(dateB)) {
          return dateB - dateA;
        }
        return String(b._id || b.id || "").localeCompare(String(a._id || a.id || ""));
      });

      setProceedings(sorted);
    } catch (error) {
      showErrorToast(toast, error, { title: "Failed to load board proceedings" });
    } finally {
      setLoading(false);
    }
  };

  // Filtered & Searched Data
  const filteredProceedings = useMemo(() => {
    return proceedings.filter((item) => {
      // Category filter
      const matchesCategory =
        selectedCategoryFilter === "ALL" ||
        (item.category && item.category.trim().toLowerCase() === selectedCategoryFilter.trim().toLowerCase());

      // Search query filter (title or category)
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [proceedings, selectedCategoryFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProceedings.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProceedings.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setEditingProceeding(null);
    setFormData({
      title: "",
      category: "BP's & Orders",
      document: null,
    });
  };

  const handleAddProceeding = () => {
    setEditingProceeding(null);
    setFormData({
      title: "",
      category: "BP's & Orders",
      document: null,
    });
    setCurrentView("add");
  };

  const handleEditProceeding = (item) => {
    setEditingProceeding(item);
    setFormData({
      title: item.title || "",
      category: item.category || "BP's & Orders",
      document: null, // Reset file input, keep existing unless replaced
    });
    setCurrentView("edit");
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "document") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title.trim());
    data.append("category", formData.category);
    if (formData.document) {
      data.append("document", formData.document);
    }

    try {
      if (currentView === "edit" && editingProceeding) {
        await updateBoardProceeding(editingProceeding._id, data);
        toast({
          title: "Success",
          description: "Board Proceeding updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await createBoardProceeding(data);
        toast({
          title: "Success",
          description: "Board Proceeding created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      fetchProceedings();
      handleBackToList();
    } catch (error) {
      showErrorToast(toast, error, {
        title: currentView === "edit" ? "Update Failed" : "Creation Failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteTarget(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteBoardProceeding(deleteTarget);
      toast({
        title: "Deleted",
        description: "Board Proceeding deleted successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      fetchProceedings();
      closeDeleteModal();
    } catch (error) {
      showErrorToast(toast, error, { title: "Delete Failed" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Stats calculation
  const totalCount = proceedings.length;
  const bpOrdersCount = proceedings.filter(
    (p) => p.category && p.category.toLowerCase().includes("bp")
  ).length;
  const panelsPromotionCount = proceedings.filter(
    (p) => p.category && p.category.toLowerCase().includes("panel")
  ).length;

  const renderStats = () => (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4} mb={4} w="100%">
      {/* Total Card */}
      <Card
        minH="85px"
        cursor="pointer"
        bg="white"
        border={`1px solid ${selectedCategoryFilter === "ALL" ? customColor : `${customColor}30`}`}
        boxShadow={selectedCategoryFilter === "ALL" ? `0 4px 12px ${customColor}25` : "none"}
        _hover={{ borderColor: customColor, transform: "translateY(-2px)" }}
        transition="all 0.2s"
        onClick={() => {
          setSelectedCategoryFilter("ALL");
          setCurrentPage(1);
        }}
      >
        <CardBody p="16px">
          <Flex align="center" justify="space-between">
            <Stat>
              <StatLabel color="gray.500" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                Total Proceedings
              </StatLabel>
              <StatNumber fontSize="2xl" color={textColor} fontWeight="bold">
                {totalCount}
              </StatNumber>
            </Stat>
            <Flex
              alignItems="center"
              justifyContent="center"
              borderRadius="12px"
              bg={customColor}
              color="white"
              h="45px"
              w="45px"
              flexShrink={0}
            >
              <Icon as={FaClipboardList} w="20px" h="20px" />
            </Flex>
          </Flex>
        </CardBody>
      </Card>

      {/* BP's & Orders Card */}
      <Card
        minH="85px"
        cursor="pointer"
        bg="white"
        border={`1px solid ${
          selectedCategoryFilter === "BP's & Orders" ? customColor : `${customColor}30`
        }`}
        boxShadow={
          selectedCategoryFilter === "BP's & Orders" ? `0 4px 12px ${customColor}25` : "none"
        }
        _hover={{ borderColor: customColor, transform: "translateY(-2px)" }}
        transition="all 0.2s"
        onClick={() => {
          setSelectedCategoryFilter("BP's & Orders");
          setCurrentPage(1);
        }}
      >
        <CardBody p="16px">
          <Flex align="center" justify="space-between">
            <Stat>
              <StatLabel color="gray.500" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                BP's & Orders
              </StatLabel>
              <StatNumber fontSize="2xl" color="blue.600" fontWeight="bold">
                {bpOrdersCount}
              </StatNumber>
            </Stat>
            <Flex
              alignItems="center"
              justifyContent="center"
              borderRadius="12px"
              bg="blue.500"
              color="white"
              h="45px"
              w="45px"
              flexShrink={0}
            >
              <Icon as={FaFolderOpen} w="20px" h="20px" />
            </Flex>
          </Flex>
        </CardBody>
      </Card>

      {/* Panels & Promotion Card */}
      <Card
        minH="85px"
        cursor="pointer"
        bg="white"
        border={`1px solid ${
          selectedCategoryFilter === "Panels & Promotion" ? customColor : `${customColor}30`
        }`}
        boxShadow={
          selectedCategoryFilter === "Panels & Promotion" ? `0 4px 12px ${customColor}25` : "none"
        }
        _hover={{ borderColor: customColor, transform: "translateY(-2px)" }}
        transition="all 0.2s"
        onClick={() => {
          setSelectedCategoryFilter("Panels & Promotion");
          setCurrentPage(1);
        }}
      >
        <CardBody p="16px">
          <Flex align="center" justify="space-between">
            <Stat>
              <StatLabel color="gray.500" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                Panels & Promotion
              </StatLabel>
              <StatNumber fontSize="2xl" color="teal.600" fontWeight="bold">
                {panelsPromotionCount}
              </StatNumber>
            </Stat>
            <Flex
              alignItems="center"
              justifyContent="center"
              borderRadius="12px"
              bg="teal.500"
              color="white"
              h="45px"
              w="45px"
              flexShrink={0}
            >
              <Icon as={FaAward} w="20px" h="20px" />
            </Flex>
          </Flex>
        </CardBody>
      </Card>
    </SimpleGrid>
  );

  // Form View (Create / Update)
  if (currentView === "add" || currentView === "edit") {
    return (
      <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }} height="100vh" overflow="auto">
        <Card bg="white" shadow="xl" height="100%" display="flex" flexDirection="column">
          <CardHeader bg="white" flexShrink={0} pb={2}>
            <Flex align="center" justify="space-between" w="100%">
              <Flex align="center">
                <Button
                  variant="ghost"
                  leftIcon={<FaArrowLeft />}
                  onClick={handleBackToList}
                  mr={4}
                  color={customColor}
                  _hover={{ bg: `${customColor}10` }}
                >
                  Back
                </Button>
                <Box>
                  <Heading size="md" color="gray.700">
                    {currentView === "add" ? "Create Board Proceeding" : "Edit Board Proceeding"}
                  </Heading>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Fill in the details and attach any relevant PDF / document
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </CardHeader>
          <CardBody bg="white" flex="1" overflow="auto" pt={4}>
            <Box as="form" onSubmit={handleSubmit} maxW="800px">
              <SimpleGrid columns={{ base: 1, md: 1 }} spacing={5} mb={4}>
                {/* Title */}
                <FormControl isRequired>
                  <FormLabel color="gray.700" fontWeight="600" fontSize="sm">
                    Proceeding Title
                  </FormLabel>
                  <Input
                    name="title"
                    placeholder="Enter board proceeding title (e.g. B.P. (Ch) No. 123...)"
                    value={formData.title}
                    onChange={handleInputChange}
                    borderColor={`${customColor}50`}
                    _hover={{ borderColor: customColor }}
                    _focus={{ borderColor: customColor, boxShadow: `0 0 0 1px ${customColor}` }}
                  />
                </FormControl>

                {/* Category */}
                <FormControl isRequired>
                  <FormLabel color="gray.700" fontWeight="600" fontSize="sm">
                    Category
                  </FormLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    borderColor={`${customColor}50`}
                    _hover={{ borderColor: customColor }}
                    _focus={{ borderColor: customColor }}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                {/* Document File */}
                <FormControl>
                  <FormLabel color="gray.700" fontWeight="600" fontSize="sm">
                    Document File (.pdf, .doc, .docx)
                  </FormLabel>
                  <Box
                    border={`1px dashed ${customColor}50`}
                    p={4}
                    borderRadius="md"
                    _hover={{ borderColor: customColor }}
                    bg="gray.50"
                  >
                    <Input
                      type="file"
                      name="document"
                      accept=".pdf,.doc,.docx"
                      pt={1}
                      variant="unstyled"
                      onChange={handleInputChange}
                    />
                    <Text fontSize="xs" color="gray.500" mt={2}>
                      Supported formats: PDF, DOC, DOCX. Uploaded directly to secure cloud storage.
                    </Text>
                  </Box>
                  {currentView === "edit" && editingProceeding?.docUrl && (
                    <Flex align="center" mt={2} gap={2}>
                      <Icon as={FaFilePdf} color="red.500" />
                      <Text fontSize="xs" color="gray.600">
                        Current document attached.
                      </Text>
                      <Button
                        as="a"
                        href={editingProceeding.docUrl}
                        target="_blank"
                        rel="noreferrer"
                        size="xs"
                        variant="link"
                        color={customColor}
                        rightIcon={<FaExternalLinkAlt />}
                      >
                        View current file
                      </Button>
                    </Flex>
                  )}
                </FormControl>
              </SimpleGrid>

              <Flex gap={3} mt={6}>
                <Button
                  variant="outline"
                  borderColor="gray.300"
                  onClick={handleBackToList}
                  flex="1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={loading}
                  bg={customColor}
                  color="white"
                  _hover={{ bg: customHoverColor }}
                  flex="2"
                  loadingText={currentView === "add" ? "Creating..." : "Updating..."}
                >
                  {currentView === "add" ? "Create Board Proceeding" : "Update Board Proceeding"}
                </Button>
              </Flex>
            </Box>
          </CardBody>
        </Card>
      </Flex>
    );
  }

  // List View
  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }} h="calc(100vh - 20px)">
      {renderStats()}

      <Card
        overflowX={{ sm: "scroll", xl: "hidden" }}
        flex="1"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        mb={4}
      >
        <CardHeader p={{ base: "14px 16px", md: "18px 24px" }} flexShrink={0} pb={3}>
          <Flex
            justify="space-between"
            align={{ base: "stretch", md: "center" }}
            direction={{ base: "column", md: "row" }}
            gap={3}
            w="100%"
          >
            <Box>
              <Text fontSize={{ base: "lg", md: "xl" }} color={textColor} fontWeight="bold">
                Board Proceedings Management
              </Text>
              <Text fontSize="xs" color="gray.500">
                Manage all official board proceedings, orders, and promotion panels
              </Text>
            </Box>

            <Flex
              gap={2}
              align="center"
              direction={{ base: "column", sm: "row" }}
              w={{ base: "100%", md: "auto" }}
            >
              {/* Search Bar */}
              <InputGroup size="sm" maxW={{ base: "100%", sm: "220px" }}>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search title..."
                  borderRadius="8px"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </InputGroup>

              {/* Category Filter Dropdown */}
              <Select
                size="sm"
                borderRadius="8px"
                maxW={{ base: "100%", sm: "180px" }}
                value={selectedCategoryFilter}
                onChange={(e) => {
                  setSelectedCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="ALL">All Categories</option>
                <option value="BP's & Orders">BP's & Orders</option>
                <option value="Panels & Promotion">Panels & Promotion</option>
              </Select>

              {/* Add Button */}
              <Button
                bg="linear-gradient(135deg, #0A3D91 0%, #1557bf 100%)"
                color="white"
                px={{ base: "16px", md: "20px" }}
                py="8px"
                size="sm"
                minH="36px"
                minW="fit-content"
                borderRadius="8px"
                boxShadow="0 4px 12px rgba(10, 61, 145, 0.25)"
                _hover={{
                  bg: "linear-gradient(135deg, #083075 0%, #0A3D91 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 18px rgba(10, 61, 145, 0.35)",
                }}
                _active={{
                  transform: "translateY(0)",
                  boxShadow: "0 2px 6px rgba(10, 61, 145, 0.2)",
                }}
                transition="all 0.2s ease"
                onClick={handleAddProceeding}
              >
                <Flex align="center" gap="6px">
                  <Icon as={FaPlus} boxSize="11px" />
                  <Text fontSize="sm" fontWeight="600">
                    Add Proceeding
                  </Text>
                </Flex>
              </Button>
            </Flex>
          </Flex>
        </CardHeader>

        <CardBody display="flex" flexDirection="column" flex="1" overflow="hidden" p={0}>
          {loading && proceedings.length === 0 ? (
            <Flex justify="center" align="center" flex="1" p={8}>
              <Spinner color={customColor} size="xl" thickness="3px" />
            </Flex>
          ) : (
            <Box overflowY="auto" overflowX="auto" flex="1" px={{ base: 2, md: 4 }}>
              <Table variant="simple" color={textColor} minW={{ base: "650px", md: "100%" }}>
                <Thead bg="gray.50" position="sticky" top={0} zIndex={1}>
                  <Tr my=".8rem" pl="0px" color="gray.500">
                    <Th color="gray.500" w="60px">
                      S.No
                    </Th>
                    <Th color="gray.500" minW="260px">
                      Title
                    </Th>
                    <Th color="gray.500" w="180px">
                      Category
                    </Th>
                    <Th color="gray.500" w="140px">
                      Date
                    </Th>
                    <Th color="gray.500" w="90px" textAlign="center">
                      Doc
                    </Th>
                    <Th color="gray.500" w="110px" textAlign="center">
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {currentItems.map((item, index) => {
                    const isBP =
                      item.category && item.category.toLowerCase().includes("bp");
                    return (
                      <Tr
                        key={item._id}
                        _hover={{ bg: "gray.50" }}
                        transition="background-color 0.15s"
                      >
                        <Td>
                          <Text fontSize="sm" color={textColor} fontWeight="bold">
                            {indexOfFirstItem + index + 1}
                          </Text>
                        </Td>
                        <Td>
                          <Box>
                            {item.docUrl ? (
                              <Text
                                as="a"
                                href={item.docUrl}
                                target="_blank"
                                rel="noreferrer"
                                fontSize="sm"
                                color={customColor}
                                fontWeight="bold"
                                cursor="pointer"
                                _hover={{ textDecoration: "underline", color: customHoverColor }}
                              >
                                {item.title}
                              </Text>
                            ) : (
                              <Text fontSize="sm" color={textColor} fontWeight="bold">
                                {item.title}
                              </Text>
                            )}
                          </Box>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={isBP ? "blue" : "teal"}
                            borderRadius="6px"
                            px="8px"
                            py="3px"
                            fontSize="xs"
                            fontWeight="bold"
                          >
                            {item.category || "BP's & Orders"}
                          </Badge>
                        </Td>
                        <Td>
                          <Text fontSize="xs" color="gray.600" whiteSpace="nowrap">
                            {item.createdAt
                              ? item.createdAt.split("T")[0].split("-").reverse().join("-")
                              : "N/A"}
                          </Text>
                        </Td>
                        <Td textAlign="center">
                          {item.docUrl ? (
                            <Tooltip label="View Attached Document" placement="top">
                              <Button
                                as="a"
                                href={item.docUrl}
                                target="_blank"
                                rel="noreferrer"
                                variant="ghost"
                                colorScheme="red"
                                size="sm"
                              >
                                <Icon as={FaFilePdf} />
                              </Button>
                            </Tooltip>
                          ) : (
                            <Text fontSize="xs" color="gray.400">
                              -
                            </Text>
                          )}
                        </Td>
                        <Td textAlign="center">
                          <HStack spacing={1} justify="center">
                            <Tooltip label="Edit Proceeding" placement="top">
                              <Button
                                variant="ghost"
                                colorScheme="blue"
                                size="sm"
                                onClick={() => handleEditProceeding(item)}
                              >
                                <Icon as={FaEdit} />
                              </Button>
                            </Tooltip>
                            <Tooltip label="Delete Proceeding" placement="top">
                              <Button
                                variant="ghost"
                                colorScheme="red"
                                size="sm"
                                onClick={() => openDeleteModal(item._id)}
                              >
                                <Icon as={FaTrash} />
                              </Button>
                            </Tooltip>
                          </HStack>
                        </Td>
                      </Tr>
                    );
                  })}
                  {filteredProceedings.length === 0 && (
                    <Tr>
                      <Td colSpan={6} textAlign="center" py={10}>
                        <Flex direction="column" align="center" justify="center" gap={2}>
                          <Icon as={FaFileAlt} color="gray.300" w={10} h={10} />
                          <Text fontSize="md" color="gray.500" fontWeight="medium">
                            No board proceedings found.
                          </Text>
                          {searchQuery || selectedCategoryFilter !== "ALL" ? (
                            <Button
                              size="xs"
                              variant="link"
                              color={customColor}
                              onClick={() => {
                                setSearchQuery("");
                                setSelectedCategoryFilter("ALL");
                              }}
                            >
                              Reset filters
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              bg={customColor}
                              color="white"
                              _hover={{ bg: customHoverColor }}
                              onClick={handleAddProceeding}
                              mt={2}
                            >
                              Add your first Board Proceeding
                            </Button>
                          )}
                        </Flex>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          )}

          {/* Pagination Controls */}
          {filteredProceedings.length > 0 && (
            <Box
              flexShrink={0}
              px={{ base: "12px", md: "20px" }}
              py="10px"
              borderTop="1px solid"
              borderColor="gray.100"
              bg="white"
            >
              <Flex
                justify="space-between"
                align="center"
                direction={{ base: "column", sm: "row" }}
                gap={2}
              >
                <Flex
                  align="center"
                  justify={{ base: "space-between", sm: "flex-start" }}
                  w={{ base: "100%", sm: "auto" }}
                >
                  <Flex align="center">
                    <Text fontSize="xs" mr={1} color="gray.500" whiteSpace="nowrap">
                      Rows:
                    </Text>
                    <Select
                      w="65px"
                      size="xs"
                      borderRadius="6px"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </Select>
                  </Flex>
                  <Text fontSize="xs" color="gray.600" ml={3} whiteSpace="nowrap">
                    Showing {indexOfFirstItem + 1}-
                    {Math.min(indexOfLastItem, filteredProceedings.length)} of{" "}
                    {filteredProceedings.length}
                  </Text>
                </Flex>

                <Flex
                  align="center"
                  justify={{ base: "center", sm: "flex-end" }}
                  w={{ base: "100%", sm: "auto" }}
                  gap={1}
                >
                  <Button
                    size="xs"
                    onClick={handlePrevPage}
                    isDisabled={currentPage === 1}
                    leftIcon={<FaChevronLeft />}
                    bg="white"
                    color={customColor}
                    border="1px"
                    borderColor={customColor}
                    _hover={{ bg: customColor, color: "white" }}
                    _disabled={{
                      opacity: 0.5,
                      cursor: "not-allowed",
                      bg: "gray.100",
                      color: "gray.400",
                      borderColor: "gray.300",
                    }}
                  >
                    Previous
                  </Button>
                  <Text fontSize="xs" mx={2} color="gray.600" whiteSpace="nowrap">
                    Page {currentPage} of {totalPages}
                  </Text>
                  <Button
                    size="xs"
                    onClick={handleNextPage}
                    isDisabled={currentPage === totalPages}
                    rightIcon={<FaChevronRight />}
                    bg="white"
                    color={customColor}
                    border="1px"
                    borderColor={customColor}
                    _hover={{ bg: customColor, color: "white" }}
                    _disabled={{
                      opacity: 0.5,
                      cursor: "not-allowed",
                      bg: "gray.100",
                      color: "gray.400",
                      borderColor: "gray.300",
                    }}
                  >
                    Next
                  </Button>
                </Flex>
              </Flex>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="xl" mx={4}>
          <ModalHeader pb={2}>
            <Flex align="center" gap={3}>
              <Flex
                alignItems="center"
                justifyContent="center"
                borderRadius="full"
                bg="red.50"
                color="red.500"
                h="40px"
                w="40px"
              >
                <Icon as={FaExclamationTriangle} w="18px" h="18px" />
              </Flex>
              <Text fontSize="lg" fontWeight="bold" color="gray.700">
                Confirm Delete
              </Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="gray.600" fontSize="sm">
              Are you sure you want to delete this Board Proceeding and its associated document? This action cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button
              variant="outline"
              onClick={closeDeleteModal}
              borderColor="gray.300"
              color="gray.600"
              _hover={{ bg: "gray.50" }}
            >
              Cancel
            </Button>
            <Button
              bg="red.600"
              color="white"
              _hover={{ bg: "red.700" }}
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
              loadingText="Deleting..."
              leftIcon={<Icon as={FaTrash} />}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default BoardProceedings;
