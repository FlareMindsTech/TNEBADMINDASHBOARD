
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
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
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaEdit,
  FaImages,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import {
  getAllGalleries,
  createGallery,
  updateGallery,
  deleteGallery,
  deleteGalleryImage,
  getGalleryById,
  showErrorToast
} from "views/utils/axiosInstance";

function AdminManagement() {
  const textColor = useColorModeValue("gray.700", "white");
  const customColor = "#0A3D91";
  const customHoverColor = "#1E88E5";
  const toast = useToast();

  const [currentView, setCurrentView] = useState("list");
  const [loading, setLoading] = useState(false);
  const [galleries, setGalleries] = useState([]);
  const [editingGallery, setEditingGallery] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGalleries = galleries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(galleries.length / itemsPerPage) || 1;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // "gallery" or "image"
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    caption: "",
    images: []
  });

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const data = await getAllGalleries();
      const list = Array.isArray(data) ? data : data.galleries || [];

      // Sort descending (newest first)
      const sortedGalleries = [...list].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.date || b.updatedAt || 0).getTime();
        if (dateA && dateB && dateA !== dateB && !isNaN(dateA) && !isNaN(dateB)) {
          return dateB - dateA;
        }
        return String(b._id || b.id || '').localeCompare(String(a._id || a.id || ''));
      });

      setGalleries(sortedGalleries);
    } catch (error) {
      showErrorToast(toast, error, { title: "Failed to load galleries" });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setEditingGallery(null);
    setFormData({ title: "", description: "", caption: "", images: [] });
  };

  const handleAddGallery = () => {
    setEditingGallery(null);
    setFormData({ title: "", description: "", caption: "", images: [] });
    setCurrentView("add");
  };

  const handleEditGallery = async (gallery) => {
    setLoading(true);
    try {
      const g = await getGalleryById(gallery._id || gallery.id);
      setEditingGallery(g);
      setFormData({
        title: g.title || "",
        description: g.description || "",
        caption: g.caption || "",
        images: []
      });
      setCurrentView("edit");
    } catch (error) {
      showErrorToast(toast, error, { title: "Failed to load gallery details" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setFormData(prev => ({ ...prev, [name]: files }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("caption", formData.caption);
    if (formData.images && formData.images.length > 0) {
      for (let i = 0; i < formData.images.length; i++) {
        data.append("images", formData.images[i]);
      }
    }

    try {
      if (currentView === "edit" && editingGallery) {
        await updateGallery(editingGallery._id || editingGallery.id, data);
        toast({ title: "Gallery updated", status: "success", duration: 3000 });
      } else {
        await createGallery(data);
        toast({ title: "Gallery created", status: "success", duration: 3000 });
      }
      fetchGalleries();
      handleBackToList();
    } catch (error) {
      showErrorToast(toast, error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (target, type) => {
    setDeleteTarget(target);
    setDeleteType(type);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
    setDeleteType("");
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteType === "gallery") {
        await deleteGallery(deleteTarget);
        toast({ title: "Gallery deleted successfully", status: "success", duration: 2000 });
        fetchGalleries();
      } else if (deleteType === "image") {
        await deleteGalleryImage(editingGallery._id || editingGallery.id, deleteTarget);
        toast({ title: "Image deleted successfully", status: "success", duration: 2000 });
        // Refresh editing gallery data
        const updatedGallery = await getGalleryById(
          editingGallery._id || editingGallery.id
        );

        setEditingGallery(updatedGallery);

      }
      closeDeleteModal();
    } catch (error) {
      showErrorToast(toast, error, { title: "Delete Failed" });
    } finally {
      setIsDeleting(false);
    }
  };



  if (currentView === "add" || currentView === "edit") {
    return (
      <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }} height="100vh" overflow="auto">
        <Card bg="white" shadow="xl" height="100%" display="flex" flexDirection="column">
          <CardHeader bg="white" flexShrink={0}>
            <Flex align="center" justify="space-between" mb={4} w="100%">
              <Flex align="center">
                <Button variant="ghost" leftIcon={<FaArrowLeft />} onClick={handleBackToList} mr={4} color={customColor} _hover={{ bg: `${customColor}10` }}>
                  Back
                </Button>
                <Heading size="md" color="gray.700">{currentView === "add" ? "Create Gallery Album" : "Edit Gallery Album"}</Heading>
              </Flex>
            </Flex>
          </CardHeader>
          <CardBody bg="white" flex="1" overflow="auto">
            <Box as="form" onSubmit={handleSubmit}>
              <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4} mb={4}>
                <FormControl isRequired>
                  <FormLabel color="gray.700">Album Title</FormLabel>
                  <Input name="title" placeholder="Annual Meeting 2025" value={formData.title} onChange={handleInputChange} borderColor={`${customColor}50`} _hover={{ borderColor: customColor }} _focus={{ borderColor: customColor, boxShadow: `0 0 0 1px ${customColor}` }} />
                </FormControl>
                <FormControl>
                  <FormLabel color="gray.700">Description</FormLabel>
                  <Input name="description" placeholder="Brief details about this event album" value={formData.description} onChange={handleInputChange} borderColor={`${customColor}50`} _hover={{ borderColor: customColor }} _focus={{ borderColor: customColor, boxShadow: `0 0 0 1px ${customColor}` }} />
                </FormControl>
                <FormControl>
                  <FormLabel color="gray.700">Caption</FormLabel>
                  <Input name="caption" placeholder="Highlights / Category" value={formData.caption} onChange={handleInputChange} borderColor={`${customColor}50`} _hover={{ borderColor: customColor }} _focus={{ borderColor: customColor, boxShadow: `0 0 0 1px ${customColor}` }} />
                </FormControl>
                <FormControl isRequired={currentView === "add"}>
                  <FormLabel color="gray.700">Select Images (Multiple supported)</FormLabel>
                  <Box border={`1px dashed ${customColor}50`} p={2} borderRadius="md" _hover={{ borderColor: customColor }}>
                    <Input type="file" name="images" multiple accept="image/*" pt={1} variant="unstyled" onChange={handleInputChange} />
                  </Box>
                </FormControl>
              </SimpleGrid>

              {currentView === "edit" && editingGallery?.images && editingGallery.images.length > 0 && (
                <Box mb={6}>
                  <Text fontWeight="bold" mb={2} color="gray.700">Current Gallery Photos ({editingGallery.images.length})</Text>
                  <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} spacing={3}>
                    {editingGallery.images.map((img) => (
                      <Box key={img._id || img.id} position="relative" borderRadius="md" overflow="hidden" boxShadow="sm" border="1px solid" borderColor="gray.200">
                        <img src={img.url} alt="Gallery item" style={{ width: "100%", height: "90px", objectFit: "cover" }} />
                        <Button
                          size="xs"
                          colorScheme="red"
                          position="absolute"
                          top="4px"
                          right="4px"
                          onClick={() => openDeleteModal(img._id || img.id, "image")}
                        >
                          <Icon as={FaTrash} />
                        </Button>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              )}

              <Button type="submit" isLoading={loading} bg={customColor} color="white" _hover={{ bg: customHoverColor }} mt={4} width="100%">
                {currentView === "add" ? "Create Gallery" : "Update Gallery"}
              </Button>
            </Box>
          </CardBody>
        </Card>
      </Flex>
    );
  }

  const renderStats = () => (
    <Flex flexDirection={{ base: "column", sm: "row" }} gap={4} mb={4} w="100%">
      <Card minH="83px" cursor="pointer" bg="white" w={{ base: "100%", sm: "240px", md: "30%", lg: "25%" }} border={`1px solid ${customColor}30`} _hover={{ borderColor: customColor, transform: "translateY(-4px)" }} transition="all 0.2s">
        <CardBody>
          <Flex align="center" justify="space-between">
            <Stat>
              <StatLabel color="gray.600" fontWeight="bold">Total Galleries</StatLabel>
              <StatNumber fontSize="xl">{galleries.length}</StatNumber>
            </Stat>
            <Flex alignItems="center" justifyContent="center" borderRadius="12px" bg={customColor} color="white" h="45px" w="45px" flexShrink={0}>
              <Icon as={FaImages} w="22px" h="22px" />
            </Flex>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );

  return (
    <>
      <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }} h="calc(100vh - 20px)">
        {renderStats()}
        <Card overflowX={{ sm: "scroll", xl: "hidden" }} flex="1" display="flex" flexDirection="column" overflow="hidden" mb={4}>
          <CardHeader p={{ base: "14px 16px", md: "18px 24px" }} flexShrink={0}>
            <Flex justify="space-between" align={{ base: "stretch", sm: "center" }} direction={{ base: "column", sm: "row" }} gap={3} w="100%">
              <Text fontSize={{ base: "lg", md: "xl" }} color={textColor} fontWeight="bold">Gallery Table</Text>
              <Button
                bg="linear-gradient(135deg, #0A3D91 0%, #1557bf 100%)"
                color="white"
                px={{ base: "20px", md: "24px" }}
                py="10px"
                minH="42px"
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
                onClick={handleAddGallery}
              >
                <Flex align="center" gap="8px">
                  <Icon as={FaPlus} boxSize="13px" />
                  <Text fontSize="sm" fontWeight="600" letterSpacing="0.2px">
                    Upload Gallery
                  </Text>
                </Flex>
              </Button>
            </Flex>
          </CardHeader>
          <CardBody display="flex" flexDirection="column" flex="1" overflow="hidden" p={0}>
            {loading && galleries.length === 0 ? (
              <Flex justify="center" align="center" flex="1" p={8}><Spinner color={customColor} /></Flex>
            ) : (
              <Box overflowY="auto" overflowX="auto" flex="1" px={{ base: 2, md: 4 }}>
                <Table variant="simple" color={textColor} minW={{ base: "550px", md: "100%" }}>
                  <Thead>
                    <Tr my=".8rem" pl="0px" color="gray.400">
                      <Th color="gray.400">S.No</Th>
                      <Th color="gray.400">Title</Th>
                      <Th color="gray.400">Description</Th>
                      <Th color="gray.400" textAlign="center">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentGalleries.map((g, index) => (
                      <Tr key={g._id || g.id}>
                        <Td><Text fontSize="sm" color={textColor} fontWeight="bold">{indexOfFirstItem + index + 1}</Text></Td>
                        <Td><Text fontSize="sm" color={textColor} fontWeight="bold">{g.title}</Text></Td>
                        <Td><Text fontSize="sm" color={textColor}>{g.description}</Text></Td>
                        <Td textAlign="center">
                          <Flex justify="center">
                            <Button variant="ghost" colorScheme="orange" size="sm" mr={1} onClick={() => handleEditGallery(g)}><Icon as={FaEdit} /></Button>
                            <Button variant="ghost" colorScheme="red" size="sm" onClick={() => openDeleteModal(g._id || g.id, "gallery")}><Icon as={FaTrash} /></Button>
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                    {galleries.length === 0 && (
                      <Tr>
                        <Td colSpan={4} textAlign="center" py={4}>No galleries found.</Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>
            )}
            {/* Fixed Pagination Controls */}
            {galleries.length > 0 && (
              <Box flexShrink={0} px={{ base: "12px", md: "20px" }} py="10px" borderTop="1px solid" borderColor="gray.100" bg="white">
                <Flex justify="space-between" align="center" direction={{ base: "column", sm: "row" }} gap={2}>
                  <Flex align="center" justify={{ base: "space-between", sm: "flex-start" }} w={{ base: "100%", sm: "auto" }}>
                    <Flex align="center">
                      <Text fontSize="xs" mr={1} color="gray.500" whiteSpace="nowrap">Rows:</Text>
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
                      Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, galleries.length)} of {galleries.length}
                    </Text>
                  </Flex>

                  <Flex align="center" justify={{ base: "center", sm: "flex-end" }} w={{ base: "100%", sm: "auto" }} gap={1}>
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
                        borderColor: "gray.300"
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
                        borderColor: "gray.300"
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
      </Flex>

      {/* Professional Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="xl" mx={4}>
          <ModalHeader bg={customColor} color="white" borderTopRadius="xl">
            <Flex align="center" gap={3}>
              <Icon as={FaExclamationTriangle} boxSize={6} />
              <Text fontSize="lg" fontWeight="bold">Confirm Deletion</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color="white" _hover={{ bg: "whiteAlpha.300" }} />
          <ModalBody py={6}>
            <Flex direction="column" align="center" textAlign="center">
              <Box bg="red.50" p={4} borderRadius="full" mb={4}>
                <Icon as={FaTrash} boxSize={8} color="red.500" />
              </Box>
              <Text fontSize="lg" fontWeight="bold" color="gray.700" mb={2}>
                Are you sure you want to delete this {deleteType}?
              </Text>
              <Text fontSize="sm" color="gray.600">
                This action cannot be undone. {deleteType === "gallery" ? "All images in this gallery will be permanently removed." : "This image will be permanently removed from the gallery."}
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter bg="gray.50" borderBottomRadius="xl">
            <Button
              variant="ghost"
              mr={3}
              onClick={closeDeleteModal}
              isDisabled={isDeleting}
              _hover={{ bg: "gray.200" }}
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
              leftIcon={<FaTrash />}
            >
              Delete {deleteType === "gallery" ? "Gallery" : "Image"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AdminManagement;
