
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
  FaExclamationTriangle
} from "react-icons/fa";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import {
  getAllGalleries,
  createGallery,
  updateGallery,
  deleteGallery,
  deleteGalleryImage,
  getGalleryById
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
      setGalleries([...list].reverse());
    } catch (error) {
      toast({
        title: "Error fetching galleries",
        description: error.message,
        status: "error",
        duration: 3000,
      });
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
      toast({
        title: "Error fetching details",
        description: error.message,
        status: "error",
        duration: 3000,
      });
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
      toast({
        title: "Operation failed",
        description: error.message,
        status: "error",
        duration: 3000,
      });
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
      toast({
        title: "Delete failed",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };



  if (currentView === "add" || currentView === "edit") {
    return (
      <>
        <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
          <Card bg="white" shadow="xl">
            <CardHeader bg="white">
              <Flex align="center" justify="space-between" mb={4} w="100%">
                <Flex align="center">
                  <Button variant="ghost" leftIcon={<FaArrowLeft />} onClick={handleBackToList} mr={4} color={customColor} _hover={{ bg: `${customColor}10` }}>
                    Back
                  </Button>
                  <Heading size="md" color="gray.700">{currentView === "add" ? "Upload Gallery" : "Edit Gallery"}</Heading>
                </Flex>
              </Flex>
            </CardHeader>
            <CardBody bg="white" maxH="calc(100vh - 200px)" overflow="auto">
              <Box as="form" onSubmit={handleSubmit}>
                <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4} mb={4}>
                  <FormControl isRequired>
                    <FormLabel color="gray.700">Title</FormLabel>
                    <Input name="title" placeholder="Gallery Title" value={formData.title} onChange={handleInputChange} borderColor={`${customColor}50`} _hover={{ borderColor: customColor }} _focus={{ borderColor: customColor, boxShadow: `0 0 0 1px ${customColor}` }} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel color="gray.700">Description</FormLabel>
                    <Input name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} borderColor={`${customColor}50`} _hover={{ borderColor: customColor }} _focus={{ borderColor: customColor }} />
                  </FormControl>

                  <FormControl>
                    <FormLabel color="gray.700">Caption</FormLabel>
                    <Input name="caption" placeholder="Optional Caption" value={formData.caption} onChange={handleInputChange} borderColor={`${customColor}50`} _hover={{ borderColor: customColor }} _focus={{ borderColor: customColor }} />
                  </FormControl>
                  <FormControl isRequired={currentView === "add"}>
                    <FormLabel color="gray.700">Gallery Images</FormLabel>
                    <Box border={`1px dashed ${customColor}50`} p={2} borderRadius="md" _hover={{ borderColor: customColor }}>
                      <Input type="file" name="images" accept="image/*" multiple pt={1} variant="unstyled" onChange={handleInputChange} />
                    </Box>
                  </FormControl>

                  {currentView === "edit" && editingGallery?.images?.length > 0 && (
                    <FormControl>
                      <FormLabel color="gray.700">Existing Images</FormLabel>
                      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                        {editingGallery.images.map((img, idx) => (
                          <Box key={img._id} position="relative" borderRadius="md" overflow="hidden" boxShadow="sm">
                            <img src={img.url} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                            <Button
                              type="button"
                              size="xs"
                              colorScheme="red"
                              position="absolute"
                              top="2px"
                              right="2px"
                              onClick={() => openDeleteModal(String(img._id), "image")}
                            >
                              <FaTrash />
                            </Button>
                          </Box>
                        ))}
                      </SimpleGrid>
                    </FormControl>
                  )}
                </SimpleGrid>
                <Button type="submit" isLoading={loading} bg={customColor} color="white" _hover={{ bg: customHoverColor }} mt={4} mb={4} width="100%">
                  {currentView === "add" ? "Create Gallery" : "Update Gallery"}
                </Button>
              </Box>
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

  const renderStats = () => (
    <Flex flexDirection={{ base: "column", md: "row" }} gap={4} mb={4}>
      <Card minH="83px" cursor="pointer" bg="white" w={{ base: "32%", md: "30%", lg: "25%" }} border={`1px solid ${customColor}30`} _hover={{ borderColor: customColor, transform: "translateY(-4px)" }} transition="all 0.2s">
        <CardBody>
          <Flex align="center" justify="space-between">
            <Stat>
              <StatLabel color="gray.600" fontWeight="bold">Total Galleries</StatLabel>
              <StatNumber fontSize="xl">{galleries.length}</StatNumber>
            </Stat>
            <Flex alignItems="center" justifyContent="center" borderRadius="12px" bg={customColor} color="white" h="45px" w="45px">
              <Icon as={FaImages} w="24px" h="24px" />
            </Flex>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );

  return (
    <>
      <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
        {renderStats()}
        <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
          <CardHeader p="6px 0px 22px 0px">
            <Flex justify="space-between" align="center" w="100%">
              <Text fontSize="xl" color={textColor} fontWeight="bold">Gallery Table</Text>
              <Button bg={customColor} color="white" _hover={{ bg: customHoverColor }} onClick={handleAddGallery} leftIcon={<FaPlus />}>
                Upload Gallery
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            {loading && galleries.length === 0 ? (
              <Flex justify="center" p={8}><Spinner color={customColor} /></Flex>
            ) : (
              <Table variant="simple" color={textColor}>
                <Thead>
                  <Tr my=".8rem" pl="0px" color="gray.400">
                    <Th color="gray.400">S.No</Th>
                    <Th color="gray.400">Title</Th>
                    <Th color="gray.400">Description</Th>
                    <Th color="gray.400" textAlign="center">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {galleries.map((g, index) => (
                    <Tr key={g._id || g.id}>
                      <Td><Text fontSize="md" color={textColor} fontWeight="bold">{index + 1}</Text></Td>
                      <Td><Text fontSize="md" color={textColor} fontWeight="bold">{g.title}</Text></Td>
                      <Td><Text fontSize="md" color={textColor}>{g.description}</Text></Td>
                      <Td textAlign="center">
                        <Flex justify="center">
                          <Button variant="ghost" colorScheme="orange" mr={2} onClick={() => handleEditGallery(g)}><Icon as={FaEdit} /></Button>
                          <Button variant="ghost" colorScheme="red" onClick={() => openDeleteModal(g._id || g.id, "gallery")}><Icon as={FaTrash} /></Button>
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
