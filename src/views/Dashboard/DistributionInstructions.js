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
  FaExternalLinkAlt,
} from "react-icons/fa";
import {
  getAllDistributionInstructions,
  createDistributionInstruction,
  updateDistributionInstruction,
  deleteDistributionInstruction,
  showErrorToast,
} from "views/utils/axiosInstance";

function DistributionInstructions() {
  const textColor = useColorModeValue("gray.700", "white");
  const customColor = "#0A3D91";
  const customHoverColor = "#1E88E5";
  const toast = useToast();

  const [currentView, setCurrentView] = useState("list"); // "list" | "add" | "edit"
  const [loading, setLoading] = useState(false);
  const [instructions, setInstructions] = useState([]);
  const [editingInstruction, setEditingInstruction] = useState(null);

  // Search state
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
    document: null,
  });

  useEffect(() => {
    fetchInstructions();
  }, []);

  const fetchInstructions = async () => {
    setLoading(true);
    try {
      const data = await getAllDistributionInstructions();
      const list = Array.isArray(data) ? data : [];

      // Sort descending by createdAt
      const sorted = [...list].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        if (dateA && dateB && dateA !== dateB && !isNaN(dateA) && !isNaN(dateB)) {
          return dateB - dateA;
        }
        return String(b._id || b.id || "").localeCompare(String(a._id || a.id || ""));
      });

      setInstructions(sorted);
    } catch (error) {
      showErrorToast(toast, error, { title: "Failed to load Distribution Instructions" });
    } finally {
      setLoading(false);
    }
  };

  // Filtered & Searched Data
  const filteredInstructions = useMemo(() => {
    return instructions.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      return !q || (item.title && item.title.toLowerCase().includes(q));
    });
  }, [instructions, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredInstructions.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInstructions.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setEditingInstruction(null);
    setFormData({ title: "", document: null });
  };

  const handleAddInstruction = () => {
    setEditingInstruction(null);
    setFormData({ title: "", document: null });
    setCurrentView("add");
  };

  const handleEditInstruction = (item) => {
    setEditingInstruction(item);
    setFormData({
      title: item.title || "",
      document: null,
    });
    setCurrentView("edit");
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "document") {
      setFormData((prev) => ({ ...prev, document: files[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    const payload = new FormData();
    payload.append("title", formData.title.trim());
    if (formData.document) {
      payload.append("document", formData.document);
    }

    try {
      if (currentView === "edit" && editingInstruction) {
        await updateDistributionInstruction(editingInstruction._id, payload);
        toast({
          title: "Success",
          description: "Distribution Instruction updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await createDistributionInstruction(payload);
        toast({
          title: "Success",
          description: "Distribution Instruction created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      await fetchInstructions();
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
      await deleteDistributionInstruction(deleteTarget);
      toast({
        title: "Deleted",
        description: "Distribution Instruction deleted successfully",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
      await fetchInstructions();
      closeDeleteModal();
    } catch (error) {
      showErrorToast(toast, error, { title: "Delete Failed" });
    } finally {
      setIsDeleting(false);
    }
  };

  // --- ADD / EDIT VIEW ---
  if (currentView === "add" || currentView === "edit") {
    return (
      <Flex
        flexDirection="column"
        pt={{ base: "120px", md: "75px" }}
        height="100vh"
        overflow="auto"
      >
        <Card bg="white" shadow="xl" height="100%" display="flex" flexDirection="column">
          <CardHeader bg="white" flexShrink={0}>
            <Flex align="center" justify="space-between" mb={2} w="100%">
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
                <Heading size="md" color="gray.700">
                  {currentView === "add"
                    ? "Add Distribution Instruction"
                    : "Edit Distribution Instruction"}
                </Heading>
              </Flex>
            </Flex>
          </CardHeader>
          <CardBody bg="white" flex="1" overflow="auto">
            <Box as="form" onSubmit={handleSubmit}>
              <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4} mb={4}>
                <FormControl isRequired>
                  <FormLabel color="gray.700" fontWeight="600">
                    Title
                  </FormLabel>
                  <Input
                    name="title"
                    placeholder="Enter distribution instruction title"
                    value={formData.title}
                    onChange={handleInputChange}
                    borderColor={`${customColor}50`}
                    _hover={{ borderColor: customColor }}
                    _focus={{
                      borderColor: customColor,
                      boxShadow: `0 0 0 1px ${customColor}`,
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.700" fontWeight="600">
                    Document File (PDF / DOC / DOCX)
                  </FormLabel>
                  <Box
                    border={`1px dashed ${customColor}50`}
                    p={3}
                    borderRadius="md"
                    _hover={{ borderColor: customColor }}
                  >
                    <Input
                      type="file"
                      name="document"
                      accept=".pdf,.doc,.docx"
                      pt={1}
                      variant="unstyled"
                      onChange={handleInputChange}
                    />
                  </Box>
                  {currentView === "edit" && editingInstruction?.docUrl && (
                    <Flex align="center" gap={2} mt={2}>
                      <Text fontSize="xs" color="gray.500">
                        Current document uploaded:
                      </Text>
                      <Button
                        as="a"
                        href={editingInstruction.docUrl}
                        target="_blank"
                        size="xs"
                        variant="link"
                        color={customColor}
                        rightIcon={<FaExternalLinkAlt />}
                      >
                        View File
                      </Button>
                    </Flex>
                  )}
                </FormControl>
              </SimpleGrid>

              <Button
                type="submit"
                isLoading={loading}
                loadingText={currentView === "add" ? "Creating..." : "Updating..."}
                bg={customColor}
                color="white"
                _hover={{ bg: customHoverColor }}
                mt={4}
                width="100%"
                h="45px"
                fontWeight="bold"
                boxShadow="0 4px 12px rgba(10, 61, 145, 0.25)"
              >
                {currentView === "add" ? "Create Distribution Instruction" : "Update Distribution Instruction"}
              </Button>
            </Box>
          </CardBody>
        </Card>
      </Flex>
    );
  }

  // --- STATS CARDS ---
  const renderStats = () => (
    <Flex
      flexDirection={{ base: "column", sm: "row" }}
      gap={4}
      mb={4}
      w="100%"
      flexWrap="wrap"
    >
      <Card
        minH="83px"
        bg="white"
        w={{ base: "100%", sm: "240px", md: "260px" }}
        border={`1px solid ${customColor}30`}
        _hover={{ borderColor: customColor, transform: "translateY(-4px)" }}
        transition="all 0.2s"
      >
        <CardBody>
          <Flex align="center" justify="space-between">
            <Stat>
              <StatLabel color="gray.600" fontWeight="bold">
                Total Documents
              </StatLabel>
              <StatNumber fontSize="2xl" color={customColor} fontWeight="bold">
                {instructions.length}
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
              <Icon as={FaClipboardList} w="22px" h="22px" />
            </Flex>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );

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
        <CardHeader p={{ base: "14px 16px", md: "18px 24px" }} flexShrink={0}>
          <Flex
            justify="space-between"
            align={{ base: "stretch", md: "center" }}
            direction={{ base: "column", md: "row" }}
            gap={3}
            w="100%"
          >
            <Box>
              <Text fontSize={{ base: "lg", md: "xl" }} color={textColor} fontWeight="bold">
                Distribution Instructions Management
              </Text>
              <Text fontSize="xs" color="gray.500">
                Manage all official Distribution Instruction documents
              </Text>
            </Box>

            <Flex
              align={{ base: "stretch", sm: "center" }}
              direction={{ base: "column", sm: "row" }}
              gap={3}
            >
              {/* Search Bar */}
              <InputGroup size="sm" maxW={{ base: "100%", sm: "240px" }}>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  borderRadius="8px"
                />
              </InputGroup>

              {/* Add Button */}
              <Button
                bg="linear-gradient(135deg, #0A3D91 0%, #1557bf 100%)"
                color="white"
                px={{ base: "16px", md: "20px" }}
                py="8px"
                minH="38px"
                minW="fit-content"
                borderRadius="10px"
                boxShadow="0 4px 12px rgba(10, 61, 145, 0.25)"
                _hover={{
                  bg: "linear-gradient(135deg, #083075 0%, #0A3D91 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 18px rgba(10, 61, 145, 0.35)",
                }}
                _active={{
                  transform: "translateY(0)",
                  boxShadow: "0 2px 6px rgba(10, 61, 145, 0.2)",
                }}
                transition="all 0.2s ease"
                onClick={handleAddInstruction}
              >
                <Flex align="center" gap="8px">
                  <Icon as={FaPlus} boxSize="12px" />
                  <Text fontSize="sm" fontWeight="600">
                    Add Instruction
                  </Text>
                </Flex>
              </Button>
            </Flex>
          </Flex>
        </CardHeader>

        <CardBody display="flex" flexDirection="column" flex="1" overflow="hidden" p={0}>
          {loading && instructions.length === 0 ? (
            <Flex justify="center" align="center" flex="1" p={8}>
              <Spinner color={customColor} size="xl" thickness="3px" />
            </Flex>
          ) : (
            <Box overflowY="auto" overflowX="auto" flex="1" px={{ base: 2, md: 4 }}>
              <Table variant="simple" color={textColor} minW={{ base: "650px", md: "100%" }}>
                <Thead>
                  <Tr my=".8rem" pl="0px" color="gray.400">
                    <Th color="gray.400" w="60px">S.No</Th>
                    <Th color="gray.400">Title</Th>
                    <Th color="gray.400" w="120px" textAlign="center">Document</Th>
                    <Th color="gray.400" w="140px">Created Date</Th>
                    <Th color="gray.400" w="120px" textAlign="center">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {currentItems.map((item, index) => (
                    <Tr key={item._id} _hover={{ bg: "gray.50" }} transition="background 0.15s">
                      <Td>
                        <Text fontSize="sm" color={textColor} fontWeight="bold">
                          {indexOfFirstItem + index + 1}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color={textColor} fontWeight="600">
                          {item.title}
                        </Text>
                      </Td>
                      <Td textAlign="center">
                        {item.docUrl ? (
                          <Tooltip label="View PDF / Document" hasArrow>
                            <Button
                              as="a"
                              href={item.docUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="ghost"
                              colorScheme="red"
                              size="sm"
                              borderRadius="full"
                            >
                              <Icon as={FaFilePdf} boxSize="18px" />
                            </Button>
                          </Tooltip>
                        ) : (
                          <Text fontSize="xs" color="gray.400" fontStyle="italic">
                            No file
                          </Text>
                        )}
                      </Td>
                      <Td>
                        <Text fontSize="sm" color={textColor} whiteSpace="nowrap">
                          {item.createdAt
                            ? item.createdAt.split("T")[0].split("-").reverse().join("-")
                            : "N/A"}
                        </Text>
                      </Td>
                      <Td textAlign="center">
                        <HStack spacing={1} justify="center">
                          <Tooltip label="Edit" hasArrow>
                            <Button
                              variant="ghost"
                              colorScheme="blue"
                              size="sm"
                              onClick={() => handleEditInstruction(item)}
                            >
                              <Icon as={FaEdit} />
                            </Button>
                          </Tooltip>
                          <Tooltip label="Delete" hasArrow>
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
                  ))}
                  {filteredInstructions.length === 0 && (
                    <Tr>
                      <Td colSpan={5} textAlign="center" py={12}>
                        <Flex direction="column" align="center" justify="center" gap={2}>
                          <Icon as={FaFolderOpen} boxSize="36px" color="gray.300" />
                          <Text color="gray.500" fontWeight="500">
                            {searchQuery ? "No matching Distribution Instructions found." : "No Distribution Instructions available."}
                          </Text>
                        </Flex>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          )}

          {/* Pagination Footer */}
          {filteredInstructions.length > 0 && (
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
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredInstructions.length)} of {filteredInstructions.length}
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

      {/* DELETE MODAL */}
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
            <Text color="gray.600">
              Are you sure you want to delete this Distribution Instruction document? This action cannot be undone.
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
              bg={customColor}
              color="white"
              _hover={{ bg: customHoverColor }}
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

export default DistributionInstructions;
