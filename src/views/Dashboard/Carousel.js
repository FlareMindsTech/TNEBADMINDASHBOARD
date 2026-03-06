
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
    Image,
    Badge,
    Switch,
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
    getCarousel,
    createCarouselImage,
    updateCarousel,
    deleteCarousel
} from "views/utils/axiosInstance";

function Carousel() {
    const textColor = useColorModeValue("gray.700", "white");
    const customColor = "#0A3D91";
    const customHoverColor = "#1E88E5";
    const toast = useToast();

    const [currentView, setCurrentView] = useState("list");
    const [loading, setLoading] = useState(false);
    const [slides, setSlides] = useState([]);
    const [editingSlide, setEditingSlide] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Delete modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [formData, setFormData] = useState({
        image: null,
        active: true
    });

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        setLoading(true);
        try {
            const data = await getCarousel();
            const list = Array.isArray(data) ? data : data.carousel || [];
            setSlides([...list].reverse());
        } catch (error) {
            toast({
                title: "Error fetching carousel",
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
        setEditingSlide(null);
        setFormData({ image: null, active: true });
    };

    const handleAddSlide = () => {
        setEditingSlide(null);
        setFormData({ image: null, active: true });
        setCurrentView("add");
    };

    const handleEditSlide = (slide) => {
        setEditingSlide(slide);
        setFormData({
            image: null,
            active: slide.active !== undefined ? slide.active : true
        });
        setCurrentView("edit");
    };

    const handleInputChange = (e) => {
        const { name, value, files, type, checked } = e.target;
        if (name === 'image') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append("active", formData.active);
        if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            if (currentView === "edit" && editingSlide) {
                await updateCarousel(editingSlide._id || editingSlide.id, data);
                toast({ title: "Slide updated", status: "success", duration: 3000 });
            } else {
                await createCarouselImage(data);
                toast({ title: "Slide created", status: "success", duration: 3000 });
            }
            fetchSlides();
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

    // Delete modal functions
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
            await deleteCarousel(deleteTarget);
            toast({ title: "Slide deleted successfully", status: "success", duration: 2000 });
            fetchSlides();
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
            <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }} height="100vh" overflow="auto">
                <Card bg="white" shadow="xl" height="100%" display="flex" flexDirection="column">
                    <CardHeader bg="white" flexShrink={0}>
                        <Flex align="center" justify="space-between" mb={4} w="100%">
                            <Flex align="center">
                                <Button variant="ghost" leftIcon={<FaArrowLeft />} onClick={handleBackToList} mr={4} color={customColor} _hover={{ bg: `${customColor}10` }}>
                                    Back
                                </Button>
                                <Heading size="md" color="gray.700">{currentView === "add" ? "Add Carousel Slide" : "Edit Slide"}</Heading>
                            </Flex>
                        </Flex>
                    </CardHeader>
                    <CardBody bg="white" flex="1" overflow="auto">
                        <Box as="form" onSubmit={handleSubmit}>
                            <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4} mb={4}>

                                <FormControl isRequired={currentView === "add"}>
                                    <FormLabel color="gray.700">Slide Image</FormLabel>
                                    <Box border={`1px dashed ${customColor}50`} p={2} borderRadius="md" _hover={{ borderColor: customColor }}>
                                        <Input type="file" name="image" accept="image/*" pt={1} variant="unstyled" onChange={handleInputChange} />
                                    </Box>
                                    {currentView === "edit" && editingSlide?.image && (
                                        <Text fontSize="xs" mt={2} color="gray.500">Existing image exists.</Text>
                                    )}
                                </FormControl>

                            </SimpleGrid>
                            <Button type="submit" isLoading={loading} bg={customColor} color="white" _hover={{ bg: customHoverColor }} mt={4} width="100%">
                                {currentView === "add" ? "Add Slide" : "Update Slide"}
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
                            <StatLabel color="gray.600" fontWeight="bold">Total Images</StatLabel>
                            <StatNumber fontSize="xl">{slides.length}</StatNumber>
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
        <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }} h="calc(100vh - 20px)">
            {renderStats()}
            <Card overflowX={{ sm: "scroll", xl: "hidden" }} flex="1" display="flex" flexDirection="column" overflow="hidden" mb={4}>
                <CardHeader p="6px 0px 22px 0px">
                    <Flex justify="space-between" align="center" w="100%">
                        <Text fontSize="xl" color={textColor} fontWeight="bold">Carousel Table</Text>
                        <Button bg={customColor} color="white" _hover={{ bg: customHoverColor }} onClick={handleAddSlide} leftIcon={<FaPlus />}>
                            Add Slide
                        </Button>
                    </Flex>
                </CardHeader>
                <CardBody display="flex" flexDirection="column" flex="1" overflow="hidden">
                    {loading && slides.length === 0 ? (
                        <Flex justify="center" p={8}><Spinner color={customColor} /></Flex>
                    ) : (
                        <Box overflowY="auto" flex="1">
                            <Table variant="simple" color={textColor}>
                                <Thead>
                                    <Tr my=".8rem" pl="0px" color="gray.400">
                                        <Th color="gray.400">S.No</Th>
                                        <Th color="gray.400">Image</Th>


                                        <Th color="gray.400" textAlign="center">Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {slides
                                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                        .map((slide, index) => (
                                            <Tr key={slide._id || slide.id}>
                                                <Td><Text fontSize="md" color={textColor} fontWeight="bold">{(currentPage - 1) * itemsPerPage + index + 1}</Text></Td>
                                                <Td>
                                                    <Image src={slide.imageUrl || slide.url} alt={slide.title} w="80px" h="50px" objectFit="cover" borderRadius="md" fallbackSrc="https://via.placeholder.com/80x50" />
                                                </Td>


                                                <Td textAlign="center">
                                                    <Flex justify="center">

                                                        <Button variant="ghost" colorScheme="red" onClick={() => openDeleteModal(slide._id || slide.id)}><Icon as={FaTrash} /></Button>
                                                    </Flex>
                                                </Td>
                                            </Tr>
                                        ))}
                                    {slides.length === 0 && (
                                        <Tr>
                                            <Td colSpan={3} textAlign="center" py={4}>No slides found.</Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </Table>
                        </Box>
                    )}
                    {/* Pagination Controls */}
                    {/* Pagination Controls */}
                    {slides.length > 0 && (
                        <Flex justify="space-between" mt={4} align="center" wrap="wrap">
                            <Flex align="center">
                                <Text fontSize="sm" mr={2} color="gray.500">Rows per page:</Text>
                                <Select
                                    w="70px"
                                    size="sm"
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

                            <Flex align="center">
                                <Button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    isDisabled={currentPage === 1}
                                    mr={2}
                                    size="sm"
                                >
                                    Previous
                                </Button>
                                <Text fontSize="sm" mx={2}>
                                    Page {currentPage} of {Math.ceil(slides.length / itemsPerPage)}
                                </Text>
                                <Button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(slides.length / itemsPerPage)))}
                                    isDisabled={currentPage === Math.ceil(slides.length / itemsPerPage)}
                                    ml={2}
                                    size="sm"
                                >
                                    Next
                                </Button>
                            </Flex>
                        </Flex>
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
                        <Text color="gray.600">
                            Are you sure you want to delete this slide? This action cannot be undone.
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

export default Carousel;
