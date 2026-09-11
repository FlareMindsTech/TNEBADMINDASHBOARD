import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
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
  VStack,
  Tooltip,
  Textarea,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import {
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaEdit,
  FaFilePdf,
  FaQuestionCircle,
  FaSlidersH,
  FaBook,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaSearch,
  FaFolderOpen,
  FaExternalLinkAlt,
  FaTag,
  FaLayerGroup,
  FaCogs,
  FaUpload,
  FaCheckCircle,
} from "react-icons/fa";
import {
  getAllTechnicalQA,
  createTechnicalQA,
  updateTechnicalQA,
  deleteTechnicalQA,
  getAllTechnicalParameters,
  createTechnicalParameter,
  updateTechnicalParameter,
  deleteTechnicalParameter,
  getAllTechnicalBooks,
  createTechnicalBook,
  updateTechnicalBook,
  deleteTechnicalBook,
  showErrorToast,
} from "views/utils/axiosInstance";

const PARAMETER_CATEGORIES = [
  "General",
  "Electrical",
  "Mechanical",
  "Transmission",
  "Distribution",
  "Safety",
  "Substation",
  "Renewable Energy",
  "Tariff & Billing",
  "Standards & Codes",
];

function Technical() {
  const textColor = useColorModeValue("gray.700", "white");
  const bgCard = useColorModeValue("white", "gray.800");
  const tableBorderColor = useColorModeValue("gray.200", "gray.600");
  const customColor = "#0A3D91";
  const customHoverColor = "#1E88E5";
  const toast = useToast();

  // Active section tab index: 0 = QA, 1 = Parameters, 2 = Books
  const [activeTab, setActiveTab] = useState(0);

  // Data states for 3 sections
  const [qaList, setQaList] = useState([]);
  const [paramList, setParamList] = useState([]);
  const [bookList, setBookList] = useState([]);

  // Loading states
  const [loadingQA, setLoadingQA] = useState(false);
  const [loadingParams, setLoadingParams] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // View state per section: "list" | "add" | "edit"
  const [currentView, setCurrentView] = useState("list");
  const [editingItem, setEditingItem] = useState(null);

  // Search & Filter states
  const [qaSearch, setQaSearch] = useState("");
  const [paramSearch, setParamSearch] = useState("");
  const [paramCategoryFilter, setParamCategoryFilter] = useState("ALL");
  const [bookSearch, setBookSearch] = useState("");

  // Pagination states
  const [qaPage, setQaPage] = useState(1);
  const [qaPerPage, setQaPerPage] = useState(5);

  const [paramPage, setParamPage] = useState(1);
  const [paramPerPage, setParamPerPage] = useState(5);

  const [bookPage, setBookPage] = useState(1);
  const [bookPerPage, setBookPerPage] = useState(5);

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title, type: 'qa' | 'param' | 'book' }
  const [isDeleting, setIsDeleting] = useState(false);

  // Form States
  const [qaFormData, setQaFormData] = useState({
    title: "",
    description: "",
    document: null,
  });

  const [paramFormData, setParamFormData] = useState({
    title: "",
    category: "General",
    customCategory: "",
    tag: "",
    document: null,
  });

  const [bookFormData, setBookFormData] = useState({
    title: "",
    tag: "",
    document: null,
  });

  // Fetch all sections on mount
  useEffect(() => {
    fetchQA();
    fetchParameters();
    fetchBooks();
  }, []);

  // Reset view to "list" when tab changes
  const handleTabChange = (index) => {
    setActiveTab(index);
    setCurrentView("list");
    setEditingItem(null);
  };

  // --- API FETCH HANDLERS ---
  const fetchQA = async () => {
    setLoadingQA(true);
    try {
      const data = await getAllTechnicalQA();
      const list = Array.isArray(data) ? data : [];
      const sorted = [...list].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return (dateB || 0) - (dateA || 0);
      });
      setQaList(sorted);
    } catch (error) {
      showErrorToast(toast, error, { title: "Failed to load Technical Q&A" });
    } finally {
      setLoadingQA(false);
    }
  };

  const fetchParameters = async () => {
    setLoadingParams(true);
    try {
      const data = await getAllTechnicalParameters();
      const list = Array.isArray(data) ? data : [];
      const sorted = [...list].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return (dateB || 0) - (dateA || 0);
      });
      setParamList(sorted);
    } catch (error) {
      showErrorToast(toast, error, { title: "Failed to load Technical Parameters" });
    } finally {
      setLoadingParams(false);
    }
  };

  const fetchBooks = async () => {
    setLoadingBooks(true);
    try {
      const data = await getAllTechnicalBooks();
      const list = Array.isArray(data) ? data : [];
      const sorted = [...list].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return (dateB || 0) - (dateA || 0);
      });
      setBookList(sorted);
    } catch (error) {
      showErrorToast(toast, error, { title: "Failed to load Technical Books & Manuals" });
    } finally {
      setLoadingBooks(false);
    }
  };

  // --- FILTERED DATA MEMOS ---
  const filteredQA = useMemo(() => {
    return qaList.filter((item) => {
      const q = qaSearch.trim().toLowerCase();
      if (!q) return true;
      const titleMatch = item.title && item.title.toLowerCase().includes(q);
      const descMatch = item.description && item.description.toLowerCase().includes(q);
      return titleMatch || descMatch;
    });
  }, [qaList, qaSearch]);

  const filteredParams = useMemo(() => {
    return paramList.filter((item) => {
      const catMatch =
        paramCategoryFilter === "ALL" ||
        (item.category && item.category.trim().toLowerCase() === paramCategoryFilter.trim().toLowerCase());
      const q = paramSearch.trim().toLowerCase();
      const titleMatch = !q || (item.title && item.title.toLowerCase().includes(q));
      const catSearch = !q || (item.category && item.category.toLowerCase().includes(q));
      const tagSearch =
        !q ||
        (item.tag && item.tag.toLowerCase().includes(q)) ||
        (Array.isArray(item.tags) && item.tags.some((t) => t.toLowerCase().includes(q)));
      return catMatch && (titleMatch || catSearch || tagSearch);
    });
  }, [paramList, paramSearch, paramCategoryFilter]);

  const filteredBooks = useMemo(() => {
    return bookList.filter((item) => {
      const q = bookSearch.trim().toLowerCase();
      if (!q) return true;
      const titleMatch = item.title && item.title.toLowerCase().includes(q);
      const tagMatch =
        (item.tag && item.tag.toLowerCase().includes(q)) ||
        (Array.isArray(item.tags) && item.tags.some((t) => t.toLowerCase().includes(q)));
      return titleMatch || tagMatch;
    });
  }, [bookList, bookSearch]);

  // --- PAGINATION DATA ---
  const qaTotalPages = Math.max(1, Math.ceil(filteredQA.length / qaPerPage));
  const currentQAPageItems = filteredQA.slice((qaPage - 1) * qaPerPage, qaPage * qaPerPage);

  const paramTotalPages = Math.max(1, Math.ceil(filteredParams.length / paramPerPage));
  const currentParamPageItems = filteredParams.slice((paramPage - 1) * paramPerPage, paramPage * paramPerPage);

  const bookTotalPages = Math.max(1, Math.ceil(filteredBooks.length / bookPerPage));
  const currentBookPageItems = filteredBooks.slice((bookPage - 1) * bookPerPage, bookPage * bookPerPage);

  // --- NAVIGATION ACTIONS ---
  const handleAddNew = () => {
    setEditingItem(null);
    if (activeTab === 0) {
      setQaFormData({ title: "", description: "", document: null });
    } else if (activeTab === 1) {
      setParamFormData({ title: "", category: "General", customCategory: "", tag: "", document: null });
    } else {
      setBookFormData({ title: "", tag: "", document: null });
    }
    setCurrentView("add");
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    if (activeTab === 0) {
      setQaFormData({
        title: item.title || "",
        description: item.description || "",
        document: null,
      });
    } else if (activeTab === 1) {
      const isPredefined = PARAMETER_CATEGORIES.includes(item.category);
      setParamFormData({
        title: item.title || "",
        category: isPredefined ? item.category : "Other",
        customCategory: isPredefined ? "" : item.category || "",
        tag: item.tag || (Array.isArray(item.tags) ? item.tags.join(", ") : ""),
        document: null,
      });
    } else {
      setBookFormData({
        title: item.title || "",
        tag: item.tag || (Array.isArray(item.tags) ? item.tags.join(", ") : ""),
        document: null,
      });
    }
    setCurrentView("edit");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setEditingItem(null);
  };

  // --- DELETE MODAL HANDLERS ---
  const openDeleteModal = (item, type) => {
    setDeleteTarget({
      id: item._id || item.id,
      title: item.title || "Untitled",
      type: type,
    });
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
      if (deleteTarget.type === "qa") {
        await deleteTechnicalQA(deleteTarget.id);
        toast({
          title: "Deleted!",
          description: "Technical Q&A item deleted successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        fetchQA();
      } else if (deleteTarget.type === "param") {
        await deleteTechnicalParameter(deleteTarget.id);
        toast({
          title: "Deleted!",
          description: "Technical Parameter deleted successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        fetchParameters();
      } else if (deleteTarget.type === "book") {
        await deleteTechnicalBook(deleteTarget.id);
        toast({
          title: "Deleted!",
          description: "Technical Book/Manual deleted successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        fetchBooks();
      }
      closeDeleteModal();
    } catch (error) {
      showErrorToast(toast, error, { title: "Failed to delete item" });
    } finally {
      setIsDeleting(false);
    }
  };

  // --- SUBMIT HANDLERS ---
  const handleQASubmit = async (e) => {
    e.preventDefault();
    if (!qaFormData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("title", qaFormData.title.trim());
      data.append("description", qaFormData.description.trim());
      if (qaFormData.document) {
        data.append("document", qaFormData.document);
      }

      if (currentView === "edit" && editingItem) {
        await updateTechnicalQA(editingItem._id || editingItem.id, data);
        toast({
          title: "Success",
          description: "Technical Q&A updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        await createTechnicalQA(data);
        toast({
          title: "Success",
          description: "Technical Q&A created successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
      fetchQA();
      handleBackToList();
    } catch (error) {
      showErrorToast(toast, error, { title: "Failed to save Technical Q&A" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleParamSubmit = async (e) => {
    e.preventDefault();
    if (!paramFormData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    const finalCategory =
      paramFormData.category === "Other"
        ? paramFormData.customCategory.trim()
        : paramFormData.category.trim();

    if (!finalCategory) {
      toast({
        title: "Validation Error",
        description: "Please specify a category.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    if (paramFormData.tag && paramFormData.tag.length > 30) {
      toast({
        title: "Validation Error",
        description: "Tag cannot exceed 30 characters.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("title", paramFormData.title.trim());
      data.append("category", finalCategory);
      if (paramFormData.tag) {
        data.append("tag", paramFormData.tag.trim());
      }
      if (paramFormData.document) {
        data.append("document", paramFormData.document);
      }

      if (currentView === "edit" && editingItem) {
        await updateTechnicalParameter(editingItem._id || editingItem.id, data);
        toast({
          title: "Success",
          description: "Technical Parameter updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        await createTechnicalParameter(data);
        toast({
          title: "Success",
          description: "Technical Parameter created successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
      fetchParameters();
      handleBackToList();
    } catch (error) {
      showErrorToast(toast, error, { title: "Failed to save Technical Parameter" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!bookFormData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    if (bookFormData.tag && bookFormData.tag.length > 30) {
      toast({
        title: "Validation Error",
        description: "Tag cannot exceed 30 characters.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("title", bookFormData.title.trim());
      if (bookFormData.tag) {
        data.append("tag", bookFormData.tag.trim());
      }
      if (bookFormData.document) {
        data.append("document", bookFormData.document);
      }

      if (currentView === "edit" && editingItem) {
        await updateTechnicalBook(editingItem._id || editingItem.id, data);
        toast({
          title: "Success",
          description: "Technical Book updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        await createTechnicalBook(data);
        toast({
          title: "Success",
          description: "Technical Book created successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
      fetchBooks();
      handleBackToList();
    } catch (error) {
      showErrorToast(toast, error, { title: "Failed to save Technical Book" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for document action badge
  const renderDocBadge = (url) => {
    if (!url) {
      return (
        <Badge colorScheme="gray" variant="subtle" px={2} py={1} borderRadius="md">
          No File
        </Badge>
      );
    }
    return (
      <Button
        as="a"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        size="xs"
        colorScheme="red"
        variant="solid"
        leftIcon={<FaFilePdf />}
        rightIcon={<FaExternalLinkAlt size="10px" />}
        _hover={{ transform: "translateY(-1px)", boxShadow: "sm" }}
      >
        View PDF
      </Button>
    );
  };

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }} gap="24px">
      {/* ================= TOP STATS OVERVIEW ================= */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing="20px">
        <Card
          cursor="pointer"
          onClick={() => handleTabChange(0)}
          transition="all 0.2s"
          _hover={{ transform: "translateY(-3px)", boxShadow: "lg" }}
          borderTop={activeTab === 0 ? `4px solid ${customColor}` : "4px solid transparent"}
        >
          <CardBody>
            <Flex align="center" justify="space-between" w="100%">
              <Stat>
                <StatLabel fontSize="sm" color="gray.500" fontWeight="bold">
                  Technical Q & A
                </StatLabel>
                <StatNumber fontSize="2xl" color={customColor} fontWeight="bold">
                  {loadingQA ? <Spinner size="sm" /> : qaList.length}
                </StatNumber>
                <Text fontSize="xs" color="gray.400" mt={1}>
                  Total Questions & Answers
                </Text>
              </Stat>
              <Flex
                w="50px"
                h="50px"
                bg="blue.50"
                color={customColor}
                borderRadius="14px"
                align="center"
                justify="center"
              >
                <Icon as={FaQuestionCircle} w={6} h={6} />
              </Flex>
            </Flex>
          </CardBody>
        </Card>

        <Card
          cursor="pointer"
          onClick={() => handleTabChange(1)}
          transition="all 0.2s"
          _hover={{ transform: "translateY(-3px)", boxShadow: "lg" }}
          borderTop={activeTab === 1 ? `4px solid ${customColor}` : "4px solid transparent"}
        >
          <CardBody>
            <Flex align="center" justify="space-between" w="100%">
              <Stat>
                <StatLabel fontSize="sm" color="gray.500" fontWeight="bold">
                  Technical Parameters
                </StatLabel>
                <StatNumber fontSize="2xl" color={customColor} fontWeight="bold">
                  {loadingParams ? <Spinner size="sm" /> : paramList.length}
                </StatNumber>
                <Text fontSize="xs" color="gray.400" mt={1}>
                  Categories & Technical Specs
                </Text>
              </Stat>
              <Flex
                w="50px"
                h="50px"
                bg="teal.50"
                color="teal.600"
                borderRadius="14px"
                align="center"
                justify="center"
              >
                <Icon as={FaSlidersH} w={6} h={6} />
              </Flex>
            </Flex>
          </CardBody>
        </Card>

        <Card
          cursor="pointer"
          onClick={() => handleTabChange(2)}
          transition="all 0.2s"
          _hover={{ transform: "translateY(-3px)", boxShadow: "lg" }}
          borderTop={activeTab === 2 ? `4px solid ${customColor}` : "4px solid transparent"}
        >
          <CardBody>
            <Flex align="center" justify="space-between" w="100%">
              <Stat>
                <StatLabel fontSize="sm" color="gray.500" fontWeight="bold">
                  Technical Books & Manuals
                </StatLabel>
                <StatNumber fontSize="2xl" color={customColor} fontWeight="bold">
                  {loadingBooks ? <Spinner size="sm" /> : bookList.length}
                </StatNumber>
                <Text fontSize="xs" color="gray.400" mt={1}>
                  Manuals, Handbooks & Guides
                </Text>
              </Stat>
              <Flex
                w="50px"
                h="50px"
                bg="purple.50"
                color="purple.600"
                borderRadius="14px"
                align="center"
                justify="center"
              >
                <Icon as={FaBook} w={6} h={6} />
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* ================= MAIN CONTENT CARD ================= */}
      <Card bg={bgCard} p={{ base: "16px", md: "24px" }} borderRadius="16px" boxShadow="sm">
        <CardHeader mb="20px">
          <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "flex-start", md: "center" }} gap={4}>
            <Box>
              <Flex align="center" gap={3}>
                <Flex
                  w="42px"
                  h="42px"
                  bg="blue.50"
                  color={customColor}
                  borderRadius="12px"
                  align="center"
                  justify="center"
                >
                  <Icon as={FaCogs} w={5} h={5} />
                </Flex>
                <Box>
                  <Heading size="md" color={textColor} fontWeight="bold">
                    Technical Management
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    Manage Technical Q&A, Technical Parameters, and Books & Manuals in one unified dashboard.
                  </Text>
                </Box>
              </Flex>
            </Box>

            {currentView === "list" && (
              <Button
                leftIcon={<FaPlus />}
                bg={customColor}
                color="white"
                _hover={{ bg: customHoverColor }}
                size="md"
                borderRadius="10px"
                onClick={handleAddNew}
                boxShadow="sm"
              >
                {activeTab === 0
                  ? "Add Q & A"
                  : activeTab === 1
                  ? "Add Parameter"
                  : "Add Book / Manual"}
              </Button>
            )}

            {currentView !== "list" && (
              <Button
                leftIcon={<FaArrowLeft />}
                variant="outline"
                colorScheme="blue"
                size="md"
                borderRadius="10px"
                onClick={handleBackToList}
              >
                Back to List
              </Button>
            )}
          </Flex>
        </CardHeader>

        <CardBody>
          {/* SECTION SWITCHER TABS (Only shown in list view) */}
          {currentView === "list" && (
            <Tabs
              index={activeTab}
              onChange={handleTabChange}
              variant="soft-rounded"
              colorScheme="blue"
              mb="24px"
            >
              <TabList
                bg={useColorModeValue("gray.100", "gray.700")}
                p="4px"
                borderRadius="12px"
                overflowX="auto"
                w="fit-content"
                maxW="100%"
              >
                <Tab
                  fontSize="sm"
                  fontWeight="600"
                  borderRadius="8px"
                  _selected={{ color: "white", bg: customColor, boxShadow: "sm" }}
                >
                  <Icon as={FaQuestionCircle} mr={2} /> Technical Q & A
                  <Badge ml={2} colorScheme={activeTab === 0 ? "blue" : "gray"} borderRadius="full">
                    {qaList.length}
                  </Badge>
                </Tab>
                <Tab
                  fontSize="sm"
                  fontWeight="600"
                  borderRadius="8px"
                  _selected={{ color: "white", bg: customColor, boxShadow: "sm" }}
                >
                  <Icon as={FaSlidersH} mr={2} /> Technical Parameters
                  <Badge ml={2} colorScheme={activeTab === 1 ? "blue" : "gray"} borderRadius="full">
                    {paramList.length}
                  </Badge>
                </Tab>
                <Tab
                  fontSize="sm"
                  fontWeight="600"
                  borderRadius="8px"
                  _selected={{ color: "white", bg: customColor, boxShadow: "sm" }}
                >
                  <Icon as={FaBook} mr={2} /> Technical Books & Manuals
                  <Badge ml={2} colorScheme={activeTab === 2 ? "blue" : "gray"} borderRadius="full">
                    {bookList.length}
                  </Badge>
                </Tab>
              </TabList>
            </Tabs>
          )}

          {/* ======================================================== */}
          {/* SECTION 1: TECHNICAL Q&A                                  */}
          {/* ======================================================== */}
          {activeTab === 0 && (
            <Box>
              {currentView === "list" && (
                <Box>
                  {/* Search and Filters */}
                  <Flex
                    direction={{ base: "column", sm: "row" }}
                    justify="space-between"
                    align="center"
                    mb="16px"
                    gap={3}
                  >
                    <InputGroup maxW={{ base: "100%", sm: "360px" }}>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FaSearch} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        placeholder="Search Q&A by title or description..."
                        value={qaSearch}
                        onChange={(e) => {
                          setQaSearch(e.target.value);
                          setQaPage(1);
                        }}
                        borderRadius="10px"
                      />
                    </InputGroup>

                    <HStack spacing={2} alignSelf={{ base: "flex-end", sm: "center" }}>
                      <Text fontSize="xs" color="gray.500">
                        Per page:
                      </Text>
                      <Select
                        size="sm"
                        w="75px"
                        borderRadius="8px"
                        value={qaPerPage}
                        onChange={(e) => {
                          setQaPerPage(Number(e.target.value));
                          setQaPage(1);
                        }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </Select>
                    </HStack>
                  </Flex>

                  {/* Table View */}
                  {loadingQA ? (
                    <Flex justify="center" align="center" py="60px" direction="column" gap={3}>
                      <Spinner size="xl" color={customColor} thickness="4px" />
                      <Text color="gray.500" fontSize="sm">Loading Technical Q&A...</Text>
                    </Flex>
                  ) : filteredQA.length === 0 ? (
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      py="50px"
                      bg={useColorModeValue("gray.50", "gray.700")}
                      borderRadius="12px"
                    >
                      <Icon as={FaFolderOpen} w={12} h={12} color="gray.400" mb={3} />
                      <Text fontWeight="bold" color="gray.600" fontSize="md">
                        {qaSearch ? "No matching Technical Q&A found." : "No Technical Q&A entries available."}
                      </Text>
                      <Text fontSize="xs" color="gray.400" mb={4}>
                        {qaSearch ? "Try adjusting your search query." : "Start by adding your first Question & Answer item."}
                      </Text>
                      {!qaSearch && (
                        <Button
                          size="sm"
                          leftIcon={<FaPlus />}
                          bg={customColor}
                          color="white"
                          _hover={{ bg: customHoverColor }}
                          onClick={handleAddNew}
                        >
                          Add Q&A
                        </Button>
                      )}
                    </Flex>
                  ) : (
                    <Box overflowX="auto" border="1px solid" borderColor={tableBorderColor} borderRadius="12px">
                      <Table variant="simple" size="md">
                        <Thead bg={useColorModeValue("gray.50", "gray.700")}>
                          <Tr>
                            <Th color="gray.500" width="60px">#</Th>
                            <Th color="gray.500" minW="220px">Title</Th>
                            <Th color="gray.500" minW="250px">Description / Answer</Th>
                            <Th color="gray.500" width="130px">Document</Th>
                            <Th color="gray.500" width="120px">Date</Th>
                            <Th color="gray.500" width="120px" textAlign="right">Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {currentQAPageItems.map((item, index) => {
                            const serial = (qaPage - 1) * qaPerPage + index + 1;
                            const createdDate = item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—";

                            return (
                              <Tr key={item._id || item.id} _hover={{ bg: useColorModeValue("gray.50", "gray.750") }}>
                                <Td fontWeight="600" color="gray.500">{serial}</Td>
                                <Td fontWeight="600" color={textColor}>
                                  {item.title}
                                </Td>
                                <Td color="gray.600">
                                  <Text noOfLines={2} fontSize="sm">
                                    {item.description || "—"}
                                  </Text>
                                </Td>
                                <Td>{renderDocBadge(item.docUrl)}</Td>
                                <Td fontSize="sm" color="gray.500">{createdDate}</Td>
                                <Td textAlign="right">
                                  <HStack spacing={2} justify="flex-end">
                                    <Tooltip label="Edit Q&A">
                                      <Button
                                        size="sm"
                                        colorScheme="blue"
                                        variant="ghost"
                                        onClick={() => handleEdit(item)}
                                      >
                                        <FaEdit />
                                      </Button>
                                    </Tooltip>
                                    <Tooltip label="Delete Q&A">
                                      <Button
                                        size="sm"
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => openDeleteModal(item, "qa")}
                                      >
                                        <FaTrash />
                                      </Button>
                                    </Tooltip>
                                  </HStack>
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </Box>
                  )}

                  {/* Pagination */}
                  {!loadingQA && filteredQA.length > 0 && (
                    <Flex justify="space-between" align="center" mt={4} flexWrap="wrap" gap={2}>
                      <Text fontSize="xs" color="gray.500">
                        Showing {(qaPage - 1) * qaPerPage + 1} to{" "}
                        {Math.min(qaPage * qaPerPage, filteredQA.length)} of {filteredQA.length} entries
                      </Text>
                      <HStack spacing={2}>
                        <Button
                          size="sm"
                          leftIcon={<FaChevronLeft />}
                          onClick={() => setQaPage((p) => Math.max(1, p - 1))}
                          isDisabled={qaPage === 1}
                        >
                          Prev
                        </Button>
                        <Text fontSize="sm" fontWeight="bold">
                          Page {qaPage} of {qaTotalPages}
                        </Text>
                        <Button
                          size="sm"
                          rightIcon={<FaChevronRight />}
                          onClick={() => setQaPage((p) => Math.min(qaTotalPages, p + 1))}
                          isDisabled={qaPage === qaTotalPages}
                        >
                          Next
                        </Button>
                      </HStack>
                    </Flex>
                  )}
                </Box>
              )}

              {/* Form View (Add / Edit Q&A) */}
              {currentView !== "list" && (
                <Box as="form" onSubmit={handleQASubmit} maxW="700px" mx="auto" py={4}>
                  <Heading size="sm" mb={4} color={textColor}>
                    {currentView === "add" ? "Create New Technical Q & A" : "Edit Technical Q & A"}
                  </Heading>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="bold">
                        Title / Question
                      </FormLabel>
                      <Input
                        placeholder="Enter question or topic title..."
                        value={qaFormData.title}
                        onChange={(e) => setQaFormData({ ...qaFormData, title: e.target.value })}
                        borderRadius="10px"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="bold">
                        Description / Answer
                      </FormLabel>
                      <Textarea
                        placeholder="Enter detailed description or answer..."
                        rows={5}
                        value={qaFormData.description}
                        onChange={(e) => setQaFormData({ ...qaFormData, description: e.target.value })}
                        borderRadius="10px"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="bold">
                        Document / Reference PDF (Optional)
                      </FormLabel>
                      {currentView === "edit" && editingItem?.docUrl && (
                        <Box mb={2} p={3} bg="blue.50" borderRadius="8px">
                          <Text fontSize="xs" color="blue.800" fontWeight="bold" mb={1}>
                            Current Document:
                          </Text>
                          <Button
                            as="a"
                            href={editingItem.docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="xs"
                            colorScheme="blue"
                            leftIcon={<FaFilePdf />}
                          >
                            View Attached Document
                          </Button>
                        </Box>
                      )}
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        p={1}
                        onChange={(e) => setQaFormData({ ...qaFormData, document: e.target.files[0] })}
                        borderRadius="10px"
                      />
                      <FormHelperText fontSize="xs">
                        Attach a supporting PDF or document (Max 25MB).
                      </FormHelperText>
                    </FormControl>

                    <HStack spacing={3} pt={4} justify="flex-end">
                      <Button variant="ghost" onClick={handleBackToList} isDisabled={isSubmitting}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        bg={customColor}
                        color="white"
                        _hover={{ bg: customHoverColor }}
                        isLoading={isSubmitting}
                        loadingText={currentView === "add" ? "Creating..." : "Updating..."}
                      >
                        {currentView === "add" ? "Create Q&A" : "Update Q&A"}
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              )}
            </Box>
          )}

          {/* ======================================================== */}
          {/* SECTION 2: TECHNICAL PARAMETERS                          */}
          {/* ======================================================== */}
          {activeTab === 1 && (
            <Box>
              {currentView === "list" && (
                <Box>
                  {/* Search, Category Filter, and Controls */}
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align={{ base: "stretch", md: "center" }}
                    mb="16px"
                    gap={3}
                  >
                    <Flex direction={{ base: "column", sm: "row" }} gap={3} flex="1">
                      <InputGroup maxW={{ base: "100%", sm: "300px" }}>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FaSearch} color="gray.400" />
                        </InputLeftElement>
                        <Input
                          placeholder="Search parameters or tags..."
                          value={paramSearch}
                          onChange={(e) => {
                            setParamSearch(e.target.value);
                            setParamPage(1);
                          }}
                          borderRadius="10px"
                        />
                      </InputGroup>

                      <Select
                        maxW={{ base: "100%", sm: "220px" }}
                        borderRadius="10px"
                        value={paramCategoryFilter}
                        onChange={(e) => {
                          setParamCategoryFilter(e.target.value);
                          setParamPage(1);
                        }}
                      >
                        <option value="ALL">All Categories</option>
                        {PARAMETER_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </Select>
                    </Flex>

                    <HStack spacing={2} alignSelf={{ base: "flex-end", md: "center" }}>
                      <Text fontSize="xs" color="gray.500">
                        Per page:
                      </Text>
                      <Select
                        size="sm"
                        w="75px"
                        borderRadius="8px"
                        value={paramPerPage}
                        onChange={(e) => {
                          setParamPerPage(Number(e.target.value));
                          setParamPage(1);
                        }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </Select>
                    </HStack>
                  </Flex>

                  {/* Table View */}
                  {loadingParams ? (
                    <Flex justify="center" align="center" py="60px" direction="column" gap={3}>
                      <Spinner size="xl" color={customColor} thickness="4px" />
                      <Text color="gray.500" fontSize="sm">Loading Technical Parameters...</Text>
                    </Flex>
                  ) : filteredParams.length === 0 ? (
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      py="50px"
                      bg={useColorModeValue("gray.50", "gray.700")}
                      borderRadius="12px"
                    >
                      <Icon as={FaFolderOpen} w={12} h={12} color="gray.400" mb={3} />
                      <Text fontWeight="bold" color="gray.600" fontSize="md">
                        {paramSearch || paramCategoryFilter !== "ALL"
                          ? "No matching Technical Parameters found."
                          : "No Technical Parameters available."}
                      </Text>
                      <Text fontSize="xs" color="gray.400" mb={4}>
                        {paramSearch || paramCategoryFilter !== "ALL"
                          ? "Try changing your search term or category filter."
                          : "Start by adding your first parameter specifications."}
                      </Text>
                      {!paramSearch && paramCategoryFilter === "ALL" && (
                        <Button
                          size="sm"
                          leftIcon={<FaPlus />}
                          bg={customColor}
                          color="white"
                          _hover={{ bg: customHoverColor }}
                          onClick={handleAddNew}
                        >
                          Add Parameter
                        </Button>
                      )}
                    </Flex>
                  ) : (
                    <Box overflowX="auto" border="1px solid" borderColor={tableBorderColor} borderRadius="12px">
                      <Table variant="simple" size="md">
                        <Thead bg={useColorModeValue("gray.50", "gray.700")}>
                          <Tr>
                            <Th color="gray.500" width="60px">#</Th>
                            <Th color="gray.500" minW="220px">Title</Th>
                            <Th color="gray.500" width="160px">Category</Th>
                            <Th color="gray.500" width="160px">Tags</Th>
                            <Th color="gray.500" width="130px">Document</Th>
                            <Th color="gray.500" width="120px">Date</Th>
                            <Th color="gray.500" width="120px" textAlign="right">Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {currentParamPageItems.map((item, index) => {
                            const serial = (paramPage - 1) * paramPerPage + index + 1;
                            const createdDate = item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—";

                            const displayTags = Array.isArray(item.tags) && item.tags.length > 0
                              ? item.tags
                              : item.tag
                              ? [item.tag]
                              : [];

                            return (
                              <Tr key={item._id || item.id} _hover={{ bg: useColorModeValue("gray.50", "gray.750") }}>
                                <Td fontWeight="600" color="gray.500">{serial}</Td>
                                <Td fontWeight="600" color={textColor}>
                                  {item.title}
                                </Td>
                                <Td>
                                  <Badge colorScheme="teal" variant="subtle" px={2} py={1} borderRadius="md">
                                    {item.category || "General"}
                                  </Badge>
                                </Td>
                                <Td>
                                  <Wrap spacing={1}>
                                    {displayTags.length > 0 ? (
                                      displayTags.map((t, idx) => (
                                        <WrapItem key={idx}>
                                          <Tag size="sm" colorScheme="blue" variant="outline">
                                            <TagLabel>{t}</TagLabel>
                                          </Tag>
                                        </WrapItem>
                                      ))
                                    ) : (
                                      <Text fontSize="xs" color="gray.400">—</Text>
                                    )}
                                  </Wrap>
                                </Td>
                                <Td>{renderDocBadge(item.docUrl)}</Td>
                                <Td fontSize="sm" color="gray.500">{createdDate}</Td>
                                <Td textAlign="right">
                                  <HStack spacing={2} justify="flex-end">
                                    <Tooltip label="Edit Parameter">
                                      <Button
                                        size="sm"
                                        colorScheme="blue"
                                        variant="ghost"
                                        onClick={() => handleEdit(item)}
                                      >
                                        <FaEdit />
                                      </Button>
                                    </Tooltip>
                                    <Tooltip label="Delete Parameter">
                                      <Button
                                        size="sm"
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => openDeleteModal(item, "param")}
                                      >
                                        <FaTrash />
                                      </Button>
                                    </Tooltip>
                                  </HStack>
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </Box>
                  )}

                  {/* Pagination */}
                  {!loadingParams && filteredParams.length > 0 && (
                    <Flex justify="space-between" align="center" mt={4} flexWrap="wrap" gap={2}>
                      <Text fontSize="xs" color="gray.500">
                        Showing {(paramPage - 1) * paramPerPage + 1} to{" "}
                        {Math.min(paramPage * paramPerPage, filteredParams.length)} of {filteredParams.length} entries
                      </Text>
                      <HStack spacing={2}>
                        <Button
                          size="sm"
                          leftIcon={<FaChevronLeft />}
                          onClick={() => setParamPage((p) => Math.max(1, p - 1))}
                          isDisabled={paramPage === 1}
                        >
                          Prev
                        </Button>
                        <Text fontSize="sm" fontWeight="bold">
                          Page {paramPage} of {paramTotalPages}
                        </Text>
                        <Button
                          size="sm"
                          rightIcon={<FaChevronRight />}
                          onClick={() => setParamPage((p) => Math.min(paramTotalPages, p + 1))}
                          isDisabled={paramPage === paramTotalPages}
                        >
                          Next
                        </Button>
                      </HStack>
                    </Flex>
                  )}
                </Box>
              )}

              {/* Form View (Add / Edit Parameter) */}
              {currentView !== "list" && (
                <Box as="form" onSubmit={handleParamSubmit} maxW="700px" mx="auto" py={4}>
                  <Heading size="sm" mb={4} color={textColor}>
                    {currentView === "add" ? "Create New Technical Parameter" : "Edit Technical Parameter"}
                  </Heading>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="bold">
                        Parameter Title
                      </FormLabel>
                      <Input
                        placeholder="e.g. Transformer Specifications 110kV/11kV"
                        value={paramFormData.title}
                        onChange={(e) => setParamFormData({ ...paramFormData, title: e.target.value })}
                        borderRadius="10px"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="bold">
                        Category
                      </FormLabel>
                      <Select
                        value={paramFormData.category}
                        onChange={(e) => setParamFormData({ ...paramFormData, category: e.target.value })}
                        borderRadius="10px"
                      >
                        {PARAMETER_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="Other">Other (Custom Category)</option>
                      </Select>
                    </FormControl>

                    {paramFormData.category === "Other" && (
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="bold">
                          Specify Custom Category
                        </FormLabel>
                        <Input
                          placeholder="Enter custom category name..."
                          value={paramFormData.customCategory}
                          onChange={(e) => setParamFormData({ ...paramFormData, customCategory: e.target.value })}
                          borderRadius="10px"
                        />
                      </FormControl>
                    )}

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="bold">
                        Tag (Optional, max 30 characters)
                      </FormLabel>
                      <Input
                        placeholder="e.g. Substation, 110kV"
                        maxLength={30}
                        value={paramFormData.tag}
                        onChange={(e) => setParamFormData({ ...paramFormData, tag: e.target.value })}
                        borderRadius="10px"
                      />
                      <FormHelperText fontSize="xs">
                        Short tag to group or filter this parameter (Max 30 chars).
                      </FormHelperText>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="bold">
                        Document / Technical Spec PDF (Optional)
                      </FormLabel>
                      {currentView === "edit" && editingItem?.docUrl && (
                        <Box mb={2} p={3} bg="blue.50" borderRadius="8px">
                          <Text fontSize="xs" color="blue.800" fontWeight="bold" mb={1}>
                            Current Document:
                          </Text>
                          <Button
                            as="a"
                            href={editingItem.docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="xs"
                            colorScheme="blue"
                            leftIcon={<FaFilePdf />}
                          >
                            View Attached Document
                          </Button>
                        </Box>
                      )}
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        p={1}
                        onChange={(e) => setParamFormData({ ...paramFormData, document: e.target.files[0] })}
                        borderRadius="10px"
                      />
                      <FormHelperText fontSize="xs">
                        Attach a specification PDF (Max 25MB).
                      </FormHelperText>
                    </FormControl>

                    <HStack spacing={3} pt={4} justify="flex-end">
                      <Button variant="ghost" onClick={handleBackToList} isDisabled={isSubmitting}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        bg={customColor}
                        color="white"
                        _hover={{ bg: customHoverColor }}
                        isLoading={isSubmitting}
                        loadingText={currentView === "add" ? "Creating..." : "Updating..."}
                      >
                        {currentView === "add" ? "Create Parameter" : "Update Parameter"}
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              )}
            </Box>
          )}

          {/* ======================================================== */}
          {/* SECTION 3: TECHNICAL BOOKS & MANUALS                     */}
          {/* ======================================================== */}
          {activeTab === 2 && (
            <Box>
              {currentView === "list" && (
                <Box>
                  {/* Search and Filters */}
                  <Flex
                    direction={{ base: "column", sm: "row" }}
                    justify="space-between"
                    align="center"
                    mb="16px"
                    gap={3}
                  >
                    <InputGroup maxW={{ base: "100%", sm: "360px" }}>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FaSearch} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        placeholder="Search books, manuals or tags..."
                        value={bookSearch}
                        onChange={(e) => {
                          setBookSearch(e.target.value);
                          setBookPage(1);
                        }}
                        borderRadius="10px"
                      />
                    </InputGroup>

                    <HStack spacing={2} alignSelf={{ base: "flex-end", sm: "center" }}>
                      <Text fontSize="xs" color="gray.500">
                        Per page:
                      </Text>
                      <Select
                        size="sm"
                        w="75px"
                        borderRadius="8px"
                        value={bookPerPage}
                        onChange={(e) => {
                          setBookPerPage(Number(e.target.value));
                          setBookPage(1);
                        }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </Select>
                    </HStack>
                  </Flex>

                  {/* Table View */}
                  {loadingBooks ? (
                    <Flex justify="center" align="center" py="60px" direction="column" gap={3}>
                      <Spinner size="xl" color={customColor} thickness="4px" />
                      <Text color="gray.500" fontSize="sm">Loading Technical Books & Manuals...</Text>
                    </Flex>
                  ) : filteredBooks.length === 0 ? (
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      py="50px"
                      bg={useColorModeValue("gray.50", "gray.700")}
                      borderRadius="12px"
                    >
                      <Icon as={FaFolderOpen} w={12} h={12} color="gray.400" mb={3} />
                      <Text fontWeight="bold" color="gray.600" fontSize="md">
                        {bookSearch ? "No matching Books & Manuals found." : "No Books & Manuals available."}
                      </Text>
                      <Text fontSize="xs" color="gray.400" mb={4}>
                        {bookSearch ? "Try adjusting your search query." : "Start by adding your first technical book or manual."}
                      </Text>
                      {!bookSearch && (
                        <Button
                          size="sm"
                          leftIcon={<FaPlus />}
                          bg={customColor}
                          color="white"
                          _hover={{ bg: customHoverColor }}
                          onClick={handleAddNew}
                        >
                          Add Book / Manual
                        </Button>
                      )}
                    </Flex>
                  ) : (
                    <Box overflowX="auto" border="1px solid" borderColor={tableBorderColor} borderRadius="12px">
                      <Table variant="simple" size="md">
                        <Thead bg={useColorModeValue("gray.50", "gray.700")}>
                          <Tr>
                            <Th color="gray.500" width="60px">#</Th>
                            <Th color="gray.500" minW="260px">Book / Manual Title</Th>
                            <Th color="gray.500" width="160px">Tags</Th>
                            <Th color="gray.500" width="130px">Document</Th>
                            <Th color="gray.500" width="120px">Date</Th>
                            <Th color="gray.500" width="120px" textAlign="right">Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {currentBookPageItems.map((item, index) => {
                            const serial = (bookPage - 1) * bookPerPage + index + 1;
                            const createdDate = item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—";

                            const displayTags = Array.isArray(item.tags) && item.tags.length > 0
                              ? item.tags
                              : item.tag
                              ? [item.tag]
                              : [];

                            return (
                              <Tr key={item._id || item.id} _hover={{ bg: useColorModeValue("gray.50", "gray.750") }}>
                                <Td fontWeight="600" color="gray.500">{serial}</Td>
                                <Td fontWeight="600" color={textColor}>
                                  {item.title}
                                </Td>
                                <Td>
                                  <Wrap spacing={1}>
                                    {displayTags.length > 0 ? (
                                      displayTags.map((t, idx) => (
                                        <WrapItem key={idx}>
                                          <Tag size="sm" colorScheme="purple" variant="subtle">
                                            <TagLabel>{t}</TagLabel>
                                          </Tag>
                                        </WrapItem>
                                      ))
                                    ) : (
                                      <Text fontSize="xs" color="gray.400">—</Text>
                                    )}
                                  </Wrap>
                                </Td>
                                <Td>{renderDocBadge(item.docUrl)}</Td>
                                <Td fontSize="sm" color="gray.500">{createdDate}</Td>
                                <Td textAlign="right">
                                  <HStack spacing={2} justify="flex-end">
                                    <Tooltip label="Edit Book/Manual">
                                      <Button
                                        size="sm"
                                        colorScheme="blue"
                                        variant="ghost"
                                        onClick={() => handleEdit(item)}
                                      >
                                        <FaEdit />
                                      </Button>
                                    </Tooltip>
                                    <Tooltip label="Delete Book/Manual">
                                      <Button
                                        size="sm"
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => openDeleteModal(item, "book")}
                                      >
                                        <FaTrash />
                                      </Button>
                                    </Tooltip>
                                  </HStack>
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </Box>
                  )}

                  {/* Pagination */}
                  {!loadingBooks && filteredBooks.length > 0 && (
                    <Flex justify="space-between" align="center" mt={4} flexWrap="wrap" gap={2}>
                      <Text fontSize="xs" color="gray.500">
                        Showing {(bookPage - 1) * bookPerPage + 1} to{" "}
                        {Math.min(bookPage * bookPerPage, filteredBooks.length)} of {filteredBooks.length} entries
                      </Text>
                      <HStack spacing={2}>
                        <Button
                          size="sm"
                          leftIcon={<FaChevronLeft />}
                          onClick={() => setBookPage((p) => Math.max(1, p - 1))}
                          isDisabled={bookPage === 1}
                        >
                          Prev
                        </Button>
                        <Text fontSize="sm" fontWeight="bold">
                          Page {bookPage} of {bookTotalPages}
                        </Text>
                        <Button
                          size="sm"
                          rightIcon={<FaChevronRight />}
                          onClick={() => setBookPage((p) => Math.min(bookTotalPages, p + 1))}
                          isDisabled={bookPage === bookTotalPages}
                        >
                          Next
                        </Button>
                      </HStack>
                    </Flex>
                  )}
                </Box>
              )}

              {/* Form View (Add / Edit Book) */}
              {currentView !== "list" && (
                <Box as="form" onSubmit={handleBookSubmit} maxW="700px" mx="auto" py={4}>
                  <Heading size="sm" mb={4} color={textColor}>
                    {currentView === "add" ? "Create New Technical Book / Manual" : "Edit Technical Book / Manual"}
                  </Heading>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="bold">
                        Book / Manual Title
                      </FormLabel>
                      <Input
                        placeholder="e.g. Distribution Technical Reference Manual 2026"
                        value={bookFormData.title}
                        onChange={(e) => setBookFormData({ ...bookFormData, title: e.target.value })}
                        borderRadius="10px"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="bold">
                        Tag (Optional, max 30 characters)
                      </FormLabel>
                      <Input
                        placeholder="e.g. Manual, Distribution, Handbook"
                        maxLength={30}
                        value={bookFormData.tag}
                        onChange={(e) => setBookFormData({ ...bookFormData, tag: e.target.value })}
                        borderRadius="10px"
                      />
                      <FormHelperText fontSize="xs">
                        Short tag to categorize this book/manual (Max 30 chars).
                      </FormHelperText>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="bold">
                        Document / Manual PDF (Optional)
                      </FormLabel>
                      {currentView === "edit" && editingItem?.docUrl && (
                        <Box mb={2} p={3} bg="blue.50" borderRadius="8px">
                          <Text fontSize="xs" color="blue.800" fontWeight="bold" mb={1}>
                            Current Document:
                          </Text>
                          <Button
                            as="a"
                            href={editingItem.docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="xs"
                            colorScheme="blue"
                            leftIcon={<FaFilePdf />}
                          >
                            View Attached Document
                          </Button>
                        </Box>
                      )}
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        p={1}
                        onChange={(e) => setBookFormData({ ...bookFormData, document: e.target.files[0] })}
                        borderRadius="10px"
                      />
                      <FormHelperText fontSize="xs">
                        Attach a book or manual PDF (Max 25MB).
                      </FormHelperText>
                    </FormControl>

                    <HStack spacing={3} pt={4} justify="flex-end">
                      <Button variant="ghost" onClick={handleBackToList} isDisabled={isSubmitting}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        bg={customColor}
                        color="white"
                        _hover={{ bg: customHoverColor }}
                        isLoading={isSubmitting}
                        loadingText={currentView === "add" ? "Creating..." : "Updating..."}
                      >
                        {currentView === "add" ? "Create Book" : "Update Book"}
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              )}
            </Box>
          )}
        </CardBody>
      </Card>

      {/* ================= CONFIRM DELETE MODAL ================= */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="14px">
          <ModalHeader color={textColor}>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex align="center" gap={3} mb={3}>
              <Icon as={FaExclamationTriangle} color="red.500" w={6} h={6} />
              <Text fontSize="md" fontWeight="bold">
                Are you sure you want to delete this item?
              </Text>
            </Flex>
            <Text fontSize="sm" color="gray.600" bg={useColorModeValue("gray.100", "gray.700")} p={3} borderRadius="8px">
              "{deleteTarget?.title}"
            </Text>
            <Text fontSize="xs" color="gray.500" mt={2}>
              This action cannot be undone and will also remove any uploaded PDF files from Cloudinary storage.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeDeleteModal} isDisabled={isDeleting}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
              loadingText="Deleting..."
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Technical;
