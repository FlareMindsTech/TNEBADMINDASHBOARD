import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
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
  InputRightElement,
  HStack,
  VStack,
  Tooltip,
  Textarea,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
  Divider,
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

// ========================================================
// REUSABLE PROFESSIONAL FILE UPLOAD DROPZONE
// ========================================================
function FileUploadDropzone({
  file,
  onFileSelect,
  onFileRemove,
  currentDocUrl,
  label = "Document / Reference PDF",
  helperText = "Attach a PDF or specification document (Max 25MB).",
}) {
  const fileInputRef = React.useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const dropzoneBg = useColorModeValue(
    isDragging ? "blue.50" : "#F8FAFC",
    isDragging ? "navy.700" : "gray.800"
  );
  const borderColor = useColorModeValue(
    isDragging ? "#0A3D91" : "gray.300",
    isDragging ? "#42A5F5" : "gray.600"
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <FormControl>
      <FormLabel fontSize="sm" fontWeight="700" color={useColorModeValue("gray.700", "gray.200")}>
        {label} <Text as="span" fontSize="xs" fontWeight="normal" color="gray.400">(Optional)</Text>
      </FormLabel>

      {/* If editing and has existing file */}
      {currentDocUrl && !file && (
        <Box
          mb={3}
          p={3}
          bg={useColorModeValue("blue.50", "whiteAlpha.100")}
          borderRadius="12px"
          border="1px solid"
          borderColor={useColorModeValue("blue.200", "blue.800")}
        >
          <Flex align="center" justify="space-between" flexWrap="wrap" gap={2}>
            <HStack spacing={2.5}>
              <Flex
                w="32px"
                h="32px"
                borderRadius="8px"
                bg="red.100"
                color="red.600"
                align="center"
                justify="center"
              >
                <Icon as={FaFilePdf} boxSize={4} />
              </Flex>
              <Box>
                <Text fontSize="xs" fontWeight="bold" color={useColorModeValue("blue.900", "blue.200")}>
                  Current Document Attached
                </Text>
                <Text fontSize="2xs" color="gray.500">
                  File is stored safely. Select a new file below only if you wish to replace it.
                </Text>
              </Box>
            </HStack>
            <Button
              as="a"
              href={currentDocUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="xs"
              colorScheme="blue"
              variant="outline"
              borderRadius="8px"
              leftIcon={<FaExternalLinkAlt size="10px" />}
            >
              Preview Document
            </Button>
          </Flex>
        </Box>
      )}

      {/* Styled Dropzone */}
      <Box
        p={{ base: 4, sm: 5 }}
        border="2px dashed"
        borderColor={borderColor}
        borderRadius="16px"
        bg={dropzoneBg}
        textAlign="center"
        cursor="pointer"
        transition="all 0.2s ease"
        _hover={{ borderColor: "#0A3D91", bg: useColorModeValue("blue.50", "navy.750") }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onFileSelect(e.target.files[0]);
            }
          }}
        />

        {file ? (
          <Flex align="center" justify="space-between" flexWrap="wrap" gap={3}>
            <HStack spacing={3}>
              <Flex
                w="42px"
                h="42px"
                borderRadius="12px"
                bg="red.100"
                color="red.600"
                align="center"
                justify="center"
              >
                <Icon as={FaFilePdf} boxSize={5} />
              </Flex>
              <Box textAlign="left">
                <Text fontSize="sm" fontWeight="bold" color={useColorModeValue("gray.800", "white")} noOfLines={1}>
                  {file.name}
                </Text>
                <Text fontSize="xs" color="green.600" fontWeight="600">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                </Text>
              </Box>
            </HStack>
            <Button
              size="xs"
              colorScheme="red"
              variant="ghost"
              borderRadius="8px"
              onClick={(e) => {
                e.stopPropagation();
                onFileRemove();
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              Remove
            </Button>
          </Flex>
        ) : (
          <VStack spacing={1.5} py={2}>
            <Flex
              w="44px"
              h="44px"
              borderRadius="full"
              bg={useColorModeValue("blue.100", "whiteAlpha.200")}
              color="#0A3D91"
              align="center"
              justify="center"
            >
              <Icon as={FaUpload} boxSize={4} />
            </Flex>
            <Text fontSize="sm" fontWeight="600" color={useColorModeValue("gray.700", "gray.200")}>
              Click to browse or drag & drop file here
            </Text>
            <Text fontSize="xs" color="gray.400">
              Supports PDF, DOC, DOCX (Max size: 25MB)
            </Text>
          </VStack>
        )}
      </Box>
      <FormHelperText fontSize="xs" color="gray.400" mt={1.5}>
        {helperText}
      </FormHelperText>
    </FormControl>
  );
}

// ========================================================
// REUSABLE PROFESSIONAL MULTI-TAG INPUT
// ========================================================
function MultiTagInput({
  tags = [],
  tagInput = "",
  onInputChange,
  onAddTag,
  onRemoveTag,
  label = "Tags",
  placeholder = "Type a tag and press Enter...",
  helperText = "Press Enter or comma (,) to add multiple tags (e.g. Substation, 110kV, Safety).",
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      onAddTag();
    }
  };

  return (
    <FormControl>
      <FormLabel fontSize="sm" fontWeight="700" color={useColorModeValue("gray.700", "gray.200")}>
        {label} <Text as="span" fontSize="xs" fontWeight="normal" color="gray.400">(Optional, max 30 characters each)</Text>
      </FormLabel>
      <VStack spacing={2.5} align="stretch">
        <InputGroup size="md">
          <InputLeftElement pointerEvents="none">
            <Icon as={FaTag} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder={placeholder}
            maxLength={30}
            value={tagInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            bg={useColorModeValue("#F8FAFC", "gray.800")}
            border="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.600")}
            borderRadius="12px"
            _hover={{ borderColor: "#0A3D91" }}
            _focus={{ borderColor: "#0A3D91", boxShadow: "0 0 0 1px #0A3D91", bg: "white" }}
            h="44px"
          />
        </InputGroup>

        {/* Selected Tag Badges */}
        {tags.length > 0 && (
          <Wrap spacing={2} pt={0.5}>
            {tags.map((t, idx) => (
              <WrapItem key={idx}>
                <Tag
                  size="md"
                  borderRadius="full"
                  variant="solid"
                  bg="#0A3D91"
                  color="white"
                  px={3}
                  py={1}
                  boxShadow="sm"
                >
                  <TagLabel fontWeight="600" fontSize="xs">{t}</TagLabel>
                  <TagCloseButton
                    onClick={() => onRemoveTag(idx)}
                    _hover={{ bg: "rgba(255,255,255,0.25)" }}
                  />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        )}
      </VStack>
      <FormHelperText fontSize="xs" color="gray.400" mt={1}>
        {helperText}
      </FormHelperText>
    </FormControl>
  );
}

function Technical({ initialTab = 0 }) {
  const location = useLocation();

  const getTabFromLocation = () => {
    const path = (location && location.pathname) || "";
    if (path.includes("technical-parameters") || path.includes("technical-parament")) return 1;
    if (path.includes("technical-qa")) return 0;
    if (path.includes("technical-books") || path.includes("book")) return 2;
    return initialTab;
  };

  const textColor = useColorModeValue("gray.700", "white");
  const bgCard = useColorModeValue("white", "gray.800");
  const tableBorderColor = useColorModeValue("gray.200", "gray.600");
  const customColor = "#0A3D91";
  const customHoverColor = "#1E88E5";
  const toast = useToast();

  // Active section tab index: 0 = QA, 1 = Parameters, 2 = Books
  const [activeTab, setActiveTab] = useState(getTabFromLocation());

  useEffect(() => {
    setActiveTab(getTabFromLocation());
    setCurrentView("list");
    setEditingItem(null);
  }, [location.pathname, initialTab]);

  // Data states for 3 sections
  const [qaList, setQaList] = useState([]);
  const [paramList, setParamList] = useState([]);
  const [bookList, setBookList] = useState([]);

  // Dynamic list of unique categories extracted from the database records
  const existingCategories = useMemo(() => {
    const cats = new Set();
    paramList.forEach((item) => {
      if (item.category && item.category.trim()) {
        cats.add(item.category.trim());
      }
    });
    return Array.from(cats).sort((a, b) => a.localeCompare(b));
  }, [paramList]);

  // Dynamic list of unique tags from parameters database
  const existingTags = useMemo(() => {
    const tSet = new Set();
    paramList.forEach((item) => {
      if (Array.isArray(item.tags)) {
        item.tags.forEach((t) => t && tSet.add(t.trim()));
      } else if (item.tag) {
        item.tag.split(",").forEach((t) => t && tSet.add(t.trim()));
      }
    });
    return Array.from(tSet);
  }, [paramList]);

  // Dynamic list of unique tags from books database
  const existingBookTags = useMemo(() => {
    const tSet = new Set();
    bookList.forEach((item) => {
      if (Array.isArray(item.tags)) {
        item.tags.forEach((t) => t && tSet.add(t.trim()));
      } else if (item.tag) {
        item.tag.split(",").forEach((t) => t && tSet.add(t.trim()));
      }
    });
    return Array.from(tSet);
  }, [bookList]);

  const handleAddParamTag = (explicitTag) => {
    const raw = explicitTag || paramFormData.tagInput || "";
    const val = raw.trim().replace(/^,+|,+$/g, "");
    if (!val) return;
    if (val.length > 30) {
      toast({
        title: "Tag too long",
        description: "Each tag cannot exceed 30 characters.",
        status: "warning",
        duration: 2500,
        isClosable: true,
      });
      return;
    }
    const current = paramFormData.tags || [];
    if (!current.includes(val)) {
      setParamFormData({
        ...paramFormData,
        tags: [...current, val],
        tagInput: "",
      });
    } else {
      setParamFormData({ ...paramFormData, tagInput: "" });
    }
  };

  const handleRemoveParamTag = (indexToRemove) => {
    setParamFormData({
      ...paramFormData,
      tags: (paramFormData.tags || []).filter((_, i) => i !== indexToRemove),
    });
  };

  const handleAddBookTag = (explicitTag) => {
    const raw = explicitTag || bookFormData.tagInput || "";
    const val = raw.trim().replace(/^,+|,+$/g, "");
    if (!val) return;
    if (val.length > 30) {
      toast({
        title: "Tag too long",
        description: "Each tag cannot exceed 30 characters.",
        status: "warning",
        duration: 2500,
        isClosable: true,
      });
      return;
    }
    const current = bookFormData.tags || [];
    if (!current.includes(val)) {
      setBookFormData({
        ...bookFormData,
        tags: [...current, val],
        tagInput: "",
      });
    } else {
      setBookFormData({ ...bookFormData, tagInput: "" });
    }
  };

  const handleRemoveBookTag = (indexToRemove) => {
    setBookFormData({
      ...bookFormData,
      tags: (bookFormData.tags || []).filter((_, i) => i !== indexToRemove),
    });
  };

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
    category: "",
    customCategory: "",
    tag: "",
    tags: [],
    tagInput: "",
    document: null,
  });

  const [bookFormData, setBookFormData] = useState({
    title: "",
    tag: "",
    tags: [],
    tagInput: "",
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
      setParamFormData({
        title: "",
        category: "",
        customCategory: "",
        tag: "",
        tags: [],
        tagInput: "",
        document: null,
      });
    } else {
      setBookFormData({
        title: "",
        tag: "",
        tags: [],
        tagInput: "",
        document: null,
      });
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
      const itemCat = item.category ? item.category.trim() : "";
      const isExisting = existingCategories.includes(itemCat);
      const itemTags = Array.isArray(item.tags) && item.tags.length > 0
        ? item.tags
        : item.tag
          ? item.tag.split(",").map((t) => t.trim()).filter(Boolean)
          : [];

      setParamFormData({
        title: item.title || "",
        category: isExisting ? itemCat : "__new__",
        customCategory: isExisting ? "" : itemCat,
        tag: itemTags.join(", "),
        tags: itemTags,
        tagInput: "",
        document: null,
      });
    } else {
      const itemTags = Array.isArray(item.tags) && item.tags.length > 0
        ? item.tags
        : item.tag
          ? item.tag.split(",").map((t) => t.trim()).filter(Boolean)
          : [];

      setBookFormData({
        title: item.title || "",
        tag: itemTags.join(", "),
        tags: itemTags,
        tagInput: "",
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

    let finalCategory = "";
    if (existingCategories.length > 0) {
      if (paramFormData.category === "__new__") {
        finalCategory = (paramFormData.customCategory || "").trim();
      } else if (paramFormData.category) {
        finalCategory = paramFormData.category.trim();
      }
    } else {
      finalCategory = (paramFormData.customCategory || paramFormData.category || "").trim();
    }

    if (!finalCategory) {
      toast({
        title: "Validation Error",
        description:
          paramFormData.category === "__new__"
            ? "Please type the new category name."
            : "Please select a category or choose '➕ Enter New Category Name Manually'.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    // Include any pending tag from tagInput if user typed but didn't press Enter/Add
    let finalTags = [...(paramFormData.tags || [])];
    if (paramFormData.tagInput && paramFormData.tagInput.trim()) {
      const pendingTags = paramFormData.tagInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      pendingTags.forEach((p) => {
        if (!finalTags.includes(p)) {
          finalTags.push(p);
        }
      });
    }

    for (const t of finalTags) {
      if (t.length > 30) {
        toast({
          title: "Validation Error",
          description: `Tag "${t}" cannot exceed 30 characters.`,
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("title", paramFormData.title.trim());
      data.append("category", finalCategory);
      data.append("tags", JSON.stringify(finalTags));
      data.append("tag", finalTags.join(", "));
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

    // Include any pending tag from tagInput if user typed but didn't press Enter/Add
    let finalTags = [...(bookFormData.tags || [])];
    if (bookFormData.tagInput && bookFormData.tagInput.trim()) {
      const pendingTags = bookFormData.tagInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      pendingTags.forEach((p) => {
        if (!finalTags.includes(p)) {
          finalTags.push(p);
        }
      });
    }

    for (const t of finalTags) {
      if (t.length > 30) {
        toast({
          title: "Validation Error",
          description: `Tag "${t}" cannot exceed 30 characters.`,
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("title", bookFormData.title.trim());
      data.append("tags", JSON.stringify(finalTags));
      data.append("tag", finalTags.join(", "));
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
                    {activeTab === 0
                      ? "Technical Q & A"
                      : activeTab === 1
                        ? "Technical Parameters"
                        : "Technical Books & Manuals"}
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    {activeTab === 0
                      ? "Manage frequently asked questions, answers, and technical guidelines."
                      : activeTab === 1
                        ? "Manage technical specifications, categories, and parameters."
                        : "Manage technical books, reference manuals, and documentation."}
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
                <Box
                  as="form"
                  onSubmit={handleQASubmit}
                  maxW="800px"
                  mx="auto"
                  p={{ base: 4, sm: 6, md: 8 }}
                  bg={useColorModeValue("white", "gray.800")}
                  borderRadius="20px"
                  border="1px solid"
                  borderColor={useColorModeValue("gray.200", "gray.700")}
                  boxShadow="0 10px 30px rgba(0,0,0,0.04)"
                >
                  {/* Form Header */}
                  <Flex
                    align="center"
                    justify="space-between"
                    pb={5}
                    mb={6}
                    borderBottom="1px solid"
                    borderColor={useColorModeValue("gray.100", "gray.700")}
                  >
                    <HStack spacing={3}>
                      <Flex
                        w="40px"
                        h="40px"
                        borderRadius="12px"
                        bg="blue.50"
                        color="#0A3D91"
                        align="center"
                        justify="center"
                      >
                        <Icon as={currentView === "add" ? FaPlus : FaEdit} boxSize={4} />
                      </Flex>
                      <Box>
                        <Heading size="sm" color={textColor} fontWeight="bold">
                          {currentView === "add" ? "Create New Technical Q & A" : "Edit Technical Q & A"}
                        </Heading>
                        <Text fontSize="xs" color="gray.500">
                          {currentView === "add"
                            ? "Provide question details and attach reference documentation."
                            : `Updating item ID: ${editingItem?._id || editingItem?.id || ""}`}
                        </Text>
                      </Box>
                    </HStack>
                    <Button
                      size="xs"
                      variant="outline"
                      borderRadius="8px"
                      onClick={handleBackToList}
                      leftIcon={<FaArrowLeft />}
                    >
                      Back
                    </Button>
                  </Flex>

                  <VStack spacing={5} align="stretch">
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="700" color={useColorModeValue("gray.700", "gray.200")}>
                        Question / Topic Title
                      </FormLabel>
                      <Input
                        placeholder="e.g. How to perform transformer insulation resistance test?"
                        value={qaFormData.title}
                        onChange={(e) => setQaFormData({ ...qaFormData, title: e.target.value })}
                        borderRadius="12px"
                        bg={useColorModeValue("#F8FAFC", "gray.800")}
                        border="1px solid"
                        borderColor={useColorModeValue("gray.200", "gray.600")}
                        _hover={{ borderColor: "#0A3D91" }}
                        _focus={{ borderColor: "#0A3D91", boxShadow: "0 0 0 1px #0A3D91", bg: "white" }}
                        h="44px"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="700" color={useColorModeValue("gray.700", "gray.200")}>
                        Description / Detailed Answer
                      </FormLabel>
                      <Textarea
                        placeholder="Enter detailed technical answer, instructions, or procedure notes..."
                        rows={6}
                        value={qaFormData.description}
                        onChange={(e) => setQaFormData({ ...qaFormData, description: e.target.value })}
                        borderRadius="12px"
                        bg={useColorModeValue("#F8FAFC", "gray.800")}
                        border="1px solid"
                        borderColor={useColorModeValue("gray.200", "gray.600")}
                        _hover={{ borderColor: "#0A3D91" }}
                        _focus={{ borderColor: "#0A3D91", boxShadow: "0 0 0 1px #0A3D91", bg: "white" }}
                      />
                      <FormHelperText fontSize="xs" color="gray.400">
                        Provide step-by-step guidance or comprehensive explanation.
                      </FormHelperText>
                    </FormControl>

                    <FileUploadDropzone
                      file={qaFormData.document}
                      onFileSelect={(f) => setQaFormData({ ...qaFormData, document: f })}
                      onFileRemove={() => setQaFormData({ ...qaFormData, document: null })}
                      currentDocUrl={editingItem?.docUrl}
                      label="Document / Reference PDF"
                      helperText="Attach standard operating procedure or reference PDF (Max 25MB)."
                    />

                    <Flex
                      direction={{ base: "column-reverse", sm: "row" }}
                      justify="flex-end"
                      gap={3}
                      pt={4}
                      borderTop="1px solid"
                      borderColor={useColorModeValue("gray.100", "gray.700")}
                    >
                      <Button
                        w={{ base: "100%", sm: "auto" }}
                        variant="outline"
                        borderRadius="10px"
                        onClick={handleBackToList}
                        isDisabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        w={{ base: "100%", sm: "auto" }}
                        type="submit"
                        bg={customColor}
                        color="white"
                        _hover={{ bg: customHoverColor }}
                        borderRadius="10px"
                        isLoading={isSubmitting}
                        loadingText={currentView === "add" ? "Creating..." : "Updating..."}
                        px={6}
                        boxShadow="sm"
                      >
                        {currentView === "add" ? "Create Technical Q&A" : "Update Technical Q&A"}
                      </Button>
                    </Flex>
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
                        {existingCategories.map((cat) => (
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
                <Box
                  as="form"
                  onSubmit={handleParamSubmit}
                  maxW="800px"
                  mx="auto"
                  p={{ base: 4, sm: 6, md: 8 }}
                  bg={useColorModeValue("white", "gray.800")}
                  borderRadius="20px"
                  border="1px solid"
                  borderColor={useColorModeValue("gray.200", "gray.700")}
                  boxShadow="0 10px 30px rgba(0,0,0,0.04)"
                >
                  {/* Form Header */}
                  <Flex
                    align="center"
                    justify="space-between"
                    pb={5}
                    mb={6}
                    borderBottom="1px solid"
                    borderColor={useColorModeValue("gray.100", "gray.700")}
                  >
                    <HStack spacing={3}>
                      <Flex
                        w="40px"
                        h="40px"
                        borderRadius="12px"
                        bg="teal.50"
                        color="teal.600"
                        align="center"
                        justify="center"
                      >
                        <Icon as={currentView === "add" ? FaPlus : FaEdit} boxSize={4} />
                      </Flex>
                      <Box>
                        <Heading size="sm" color={textColor} fontWeight="bold">
                          {currentView === "add" ? "Create New Technical Parameter" : "Edit Technical Parameter"}
                        </Heading>
                        <Text fontSize="xs" color="gray.500">
                          {currentView === "add"
                            ? "Define equipment specifications, category, and technical documents."
                            : `Updating parameter ID: ${editingItem?._id || editingItem?.id || ""}`}
                        </Text>
                      </Box>
                    </HStack>
                    <Button
                      size="xs"
                      variant="outline"
                      borderRadius="8px"
                      onClick={handleBackToList}
                      leftIcon={<FaArrowLeft />}
                    >
                      Back
                    </Button>
                  </Flex>

                  <VStack spacing={5} align="stretch">
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="700" color={useColorModeValue("gray.700", "gray.200")}>
                        Parameter Title
                      </FormLabel>
                      <Input
                        placeholder="e.g. Transformer Specifications 110kV/11kV"
                        value={paramFormData.title}
                        onChange={(e) => setParamFormData({ ...paramFormData, title: e.target.value })}
                        borderRadius="12px"
                        bg={useColorModeValue("#F8FAFC", "gray.800")}
                        border="1px solid"
                        borderColor={useColorModeValue("gray.200", "gray.600")}
                        _hover={{ borderColor: "#0A3D91" }}
                        _focus={{ borderColor: "#0A3D91", boxShadow: "0 0 0 1px #0A3D91", bg: "white" }}
                        h="44px"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="700" color={useColorModeValue("gray.700", "gray.200")}>
                        Category
                      </FormLabel>
                      {existingCategories.length > 0 ? (
                        <VStack spacing={2.5} align="stretch">
                          <Select
                            placeholder="-- Select From Existing Category --"
                            value={paramFormData.category}
                            onChange={(e) => {
                              const val = e.target.value;
                              setParamFormData({
                                ...paramFormData,
                                category: val,
                                customCategory: val === "__new__" ? paramFormData.customCategory : "",
                              });
                            }}
                            borderRadius="12px"
                            bg={useColorModeValue("#F8FAFC", "gray.800")}
                            border="1px solid"
                            borderColor={useColorModeValue("gray.200", "gray.600")}
                            _hover={{ borderColor: "#0A3D91" }}
                            _focus={{ borderColor: "#0A3D91", boxShadow: "0 0 0 1px #0A3D91", bg: "white" }}
                            h="44px"
                          >
                            {existingCategories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                            <option value="__new__">➕ Enter New Category Name Manually</option>
                          </Select>

                          {paramFormData.category === "__new__" && (
                            <Input
                              placeholder="Type new category name here (e.g. Substation, Transmission)..."
                              value={paramFormData.customCategory}
                              onChange={(e) =>
                                setParamFormData({ ...paramFormData, customCategory: e.target.value })
                              }
                              borderRadius="12px"
                              bg={useColorModeValue("#F8FAFC", "gray.800")}
                              border="1px solid"
                              borderColor={useColorModeValue("gray.200", "gray.600")}
                              _hover={{ borderColor: "#0A3D91" }}
                              _focus={{ borderColor: "#0A3D91", boxShadow: "0 0 0 1px #0A3D91", bg: "white" }}
                              h="44px"
                              autoFocus
                            />
                          )}
                        </VStack>
                      ) : (
                        <Input
                          placeholder="Type category name (e.g. Transformers, Switchgears, Cables)..."
                          value={paramFormData.customCategory}
                          onChange={(e) =>
                            setParamFormData({
                              ...paramFormData,
                              category: "__new__",
                              customCategory: e.target.value,
                            })
                          }
                          borderRadius="12px"
                          bg={useColorModeValue("#F8FAFC", "gray.800")}
                          border="1px solid"
                          borderColor={useColorModeValue("gray.200", "gray.600")}
                          _hover={{ borderColor: "#0A3D91" }}
                          _focus={{ borderColor: "#0A3D91", boxShadow: "0 0 0 1px #0A3D91", bg: "white" }}
                          h="44px"
                        />
                      )}
                      <FormHelperText fontSize="xs" color="gray.400">
                        {existingCategories.length > 0
                          ? "Select an existing category from the dropdown, or choose '➕ Enter New Category Name Manually' to type a new one."
                          : "No existing categories found. Type a category name manually — once saved, it will be available in the dropdown."}
                      </FormHelperText>
                    </FormControl>

                    <MultiTagInput
                      tags={paramFormData.tags || []}
                      tagInput={paramFormData.tagInput || ""}
                      onInputChange={(val) => setParamFormData({ ...paramFormData, tagInput: val })}
                      onAddTag={handleAddParamTag}
                      onRemoveTag={handleRemoveParamTag}
                      label="Tags"
                      placeholder="Type a tag and press Enter..."
                      helperText="Press Enter or comma (,) to add multiple tags (e.g. Substation, 110kV, Environment)."
                    />

                    <FileUploadDropzone
                      file={paramFormData.document}
                      onFileSelect={(f) => setParamFormData({ ...paramFormData, document: f })}
                      onFileRemove={() => setParamFormData({ ...paramFormData, document: null })}
                      currentDocUrl={editingItem?.docUrl}
                      label="Document / Technical Spec PDF"
                      helperText="Attach equipment datasheet, technical manual or spec PDF (Max 25MB)."
                    />

                    <Flex
                      direction={{ base: "column-reverse", sm: "row" }}
                      justify="flex-end"
                      gap={3}
                      pt={4}
                      borderTop="1px solid"
                      borderColor={useColorModeValue("gray.100", "gray.700")}
                    >
                      <Button
                        w={{ base: "100%", sm: "auto" }}
                        variant="outline"
                        borderRadius="10px"
                        onClick={handleBackToList}
                        isDisabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        w={{ base: "100%", sm: "auto" }}
                        type="submit"
                        bg={customColor}
                        color="white"
                        _hover={{ bg: customHoverColor }}
                        borderRadius="10px"
                        isLoading={isSubmitting}
                        loadingText={currentView === "add" ? "Creating..." : "Updating..."}
                        px={6}
                        boxShadow="sm"
                      >
                        {currentView === "add" ? "Create Technical Parameter" : "Update Technical Parameter"}
                      </Button>
                    </Flex>
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
                <Box
                  as="form"
                  onSubmit={handleBookSubmit}
                  maxW="800px"
                  mx="auto"
                  p={{ base: 4, sm: 6, md: 8 }}
                  bg={useColorModeValue("white", "gray.800")}
                  borderRadius="20px"
                  border="1px solid"
                  borderColor={useColorModeValue("gray.200", "gray.700")}
                  boxShadow="0 10px 30px rgba(0,0,0,0.04)"
                >
                  {/* Form Header */}
                  <Flex
                    align="center"
                    justify="space-between"
                    pb={5}
                    mb={6}
                    borderBottom="1px solid"
                    borderColor={useColorModeValue("gray.100", "gray.700")}
                  >
                    <HStack spacing={3}>
                      <Flex
                        w="40px"
                        h="40px"
                        borderRadius="12px"
                        bg="purple.50"
                        color="purple.600"
                        align="center"
                        justify="center"
                      >
                        <Icon as={currentView === "add" ? FaPlus : FaEdit} boxSize={4} />
                      </Flex>
                      <Box>
                        <Heading size="sm" color={textColor} fontWeight="bold">
                          {currentView === "add" ? "Create New Technical Book / Manual" : "Edit Technical Book / Manual"}
                        </Heading>
                        <Text fontSize="xs" color="gray.500">
                          {currentView === "add"
                            ? "Upload technical handbook, safety code, or guideline manual."
                            : `Updating book ID: ${editingItem?._id || editingItem?.id || ""}`}
                        </Text>
                      </Box>
                    </HStack>
                    <Button
                      size="xs"
                      variant="outline"
                      borderRadius="8px"
                      onClick={handleBackToList}
                      leftIcon={<FaArrowLeft />}
                    >
                      Back
                    </Button>
                  </Flex>

                  <VStack spacing={5} align="stretch">
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="700" color={useColorModeValue("gray.700", "gray.200")}>
                        Book / Manual Title
                      </FormLabel>
                      <Input
                        placeholder="e.g. Distribution Technical Reference Manual 2026"
                        value={bookFormData.title}
                        onChange={(e) => setBookFormData({ ...bookFormData, title: e.target.value })}
                        borderRadius="12px"
                        bg={useColorModeValue("#F8FAFC", "gray.800")}
                        border="1px solid"
                        borderColor={useColorModeValue("gray.200", "gray.600")}
                        _hover={{ borderColor: "#0A3D91" }}
                        _focus={{ borderColor: "#0A3D91", boxShadow: "0 0 0 1px #0A3D91", bg: "white" }}
                        h="44px"
                      />
                    </FormControl>

                    <MultiTagInput
                      tags={bookFormData.tags || []}
                      tagInput={bookFormData.tagInput || ""}
                      onInputChange={(val) => setBookFormData({ ...bookFormData, tagInput: val })}
                      onAddTag={handleAddBookTag}
                      onRemoveTag={handleRemoveBookTag}
                      label="Tags"
                      placeholder="Type a tag and press Enter..."
                      helperText="Press Enter or comma (,) to add multiple tags (e.g. Manual, Distribution, Handbook)."
                    />

                    <FileUploadDropzone
                      file={bookFormData.document}
                      onFileSelect={(f) => setBookFormData({ ...bookFormData, document: f })}
                      onFileRemove={() => setBookFormData({ ...bookFormData, document: null })}
                      currentDocUrl={editingItem?.docUrl}
                      label="Document / Book PDF"
                      helperText="Attach full book or manual PDF (Max 25MB)."
                    />

                    <Flex
                      direction={{ base: "column-reverse", sm: "row" }}
                      justify="flex-end"
                      gap={3}
                      pt={4}
                      borderTop="1px solid"
                      borderColor={useColorModeValue("gray.100", "gray.700")}
                    >
                      <Button
                        w={{ base: "100%", sm: "auto" }}
                        variant="outline"
                        borderRadius="10px"
                        onClick={handleBackToList}
                        isDisabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        w={{ base: "100%", sm: "auto" }}
                        type="submit"
                        bg={customColor}
                        color="white"
                        _hover={{ bg: customHoverColor }}
                        borderRadius="10px"
                        isLoading={isSubmitting}
                        loadingText={currentView === "add" ? "Creating..." : "Updating..."}
                        px={6}
                        boxShadow="sm"
                      >
                        {currentView === "add" ? "Create Book / Manual" : "Update Book / Manual"}
                      </Button>
                    </Flex>
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
