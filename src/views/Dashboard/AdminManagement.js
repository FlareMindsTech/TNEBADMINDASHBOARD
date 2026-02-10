
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
  FaImages
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
  const customColor = "#d70f18";
  const customHoverColor = "#b00c14";
  const toast = useToast();

  const [currentView, setCurrentView] = useState("list");
  const [loading, setLoading] = useState(false);
  const [galleries, setGalleries] = useState([]);
  const [editingGallery, setEditingGallery] = useState(null);

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

  const handleDeleteGallery = async (id) => {
    if (!window.confirm("Delete this gallery?")) return;
    setLoading(true);
    try {
      await deleteGallery(id);
      toast({ title: "Gallery deleted", status: "success", duration: 2000 });
      fetchGalleries();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Delete this image from the gallery?")) return;
    setLoading(true);
    try {
      await deleteGalleryImage(editingGallery._id || editingGallery.id, imageId);
      toast({ title: "Image deleted", status: "success", duration: 2000 });
      // Refresh editing gallery data
      const updatedGalleries = await getAllGalleries();
      const list = Array.isArray(updatedGalleries) ? updatedGalleries : updatedGalleries.galleries || [];
      const currentGallery = list.find(g => (g._id || g.id) === (editingGallery._id || editingGallery.id));
      setEditingGallery(currentGallery);
      setGalleries([...list].reverse());
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
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
                <Heading size="md" color="gray.700">{currentView === "add" ? "Upload Gallery" : "Edit Gallery"}</Heading>
              </Flex>
            </Flex>
          </CardHeader>
          <CardBody bg="white" flex="1" overflow="auto">
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
                        <Box key={idx} position="relative" borderRadius="md" overflow="hidden" boxShadow="sm">
                          <img src={img.url} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                          <Button
                            size="xs"
                            colorScheme="red"
                            position="absolute"
                            top="2px"
                            right="2px"
                            onClick={() => handleDeleteImage(img.public_id)}
                          >
                            <FaTrash />
                          </Button>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </FormControl>
                )}
              </SimpleGrid>
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
                  <Th color="gray.400">Title</Th>
                  <Th color="gray.400">Description</Th>
                  <Th color="gray.400" textAlign="center">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {galleries.map((g) => (
                  <Tr key={g._id || g.id}>
                    <Td><Text fontSize="md" color={textColor} fontWeight="bold">{g.title}</Text></Td>
                    <Td><Text fontSize="md" color={textColor}>{g.description}</Text></Td>
                    <Td textAlign="center">
                      <Flex justify="center">
                        <Button variant="ghost" colorScheme="orange" mr={2} onClick={() => handleEditGallery(g)}><Icon as={FaEdit} /></Button>
                        <Button variant="ghost" colorScheme="red" onClick={() => handleDeleteGallery(g._id || g.id)}><Icon as={FaTrash} /></Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
                {galleries.length === 0 && (
                  <Tr>
                    <Td colSpan={3} textAlign="center" py={4}>No galleries found.</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </Flex>
  );
}

export default AdminManagement;
