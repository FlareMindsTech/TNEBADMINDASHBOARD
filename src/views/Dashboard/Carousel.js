
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
    getCarousel,
    createCarouselImage,
    updateCarousel,
    deleteCarousel
} from "views/utils/axiosInstance";

function Carousel() {
    const textColor = useColorModeValue("gray.700", "white");
    const customColor = "#d70f18";
    const customHoverColor = "#b00c14";
    const toast = useToast();

    const [currentView, setCurrentView] = useState("list");
    const [loading, setLoading] = useState(false);
    const [slides, setSlides] = useState([]);
    const [editingSlide, setEditingSlide] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
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
        setFormData({ title: "", image: null, active: true });
    };

    const handleAddSlide = () => {
        setEditingSlide(null);
        setFormData({ title: "", image: null, active: true });
        setCurrentView("add");
    };

    const handleEditSlide = (slide) => {
        setEditingSlide(slide);
        setFormData({
            title: slide.title || "",
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
        data.append("title", formData.title);
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

    const handleDeleteSlide = async (id) => {
        if (!window.confirm("Delete this slide?")) return;
        setLoading(true);
        try {
            await deleteCarousel(id);
            toast({ title: "Slide deleted", status: "success", duration: 2000 });
            fetchSlides();
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
                                <Heading size="md" color="gray.700">{currentView === "add" ? "Add Carousel Slide" : "Edit Slide"}</Heading>
                            </Flex>
                        </Flex>
                    </CardHeader>
                    <CardBody bg="white" flex="1" overflow="auto">
                        <Box as="form" onSubmit={handleSubmit}>
                            <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4} mb={4}>
                                <FormControl isRequired>
                                    <FormLabel color="gray.700">Title</FormLabel>
                                    <Input name="title" placeholder="Slider Title" value={formData.title} onChange={handleInputChange} borderColor={`${customColor}50`} _hover={{ borderColor: customColor }} _focus={{ borderColor: customColor, boxShadow: `0 0 0 1px ${customColor}` }} />
                                </FormControl>
                                <FormControl isRequired={currentView === "add"}>
                                    <FormLabel color="gray.700">Slide Image</FormLabel>
                                    <Box border={`1px dashed ${customColor}50`} p={2} borderRadius="md" _hover={{ borderColor: customColor }}>
                                        <Input type="file" name="image" accept="image/*" pt={1} variant="unstyled" onChange={handleInputChange} />
                                    </Box>
                                    {currentView === "edit" && editingSlide?.image && (
                                        <Text fontSize="xs" mt={2} color="gray.500">Existing image exists.</Text>
                                    )}
                                </FormControl>
                                <FormControl display="flex" alignItems="center">
                                    <FormLabel htmlFor="active-toggle" mb="0" color="gray.700">Active Status</FormLabel>
                                    <Switch id="active-toggle" name="active" isChecked={formData.active} onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))} colorScheme="red" />
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
                            <StatLabel color="gray.600" fontWeight="bold">Active Slides</StatLabel>
                            <StatNumber fontSize="xl">{slides.filter(s => s.active).length}</StatNumber>
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
                        <Text fontSize="xl" color={textColor} fontWeight="bold">Carousel Table</Text>
                        <Button bg={customColor} color="white" _hover={{ bg: customHoverColor }} onClick={handleAddSlide} leftIcon={<FaPlus />}>
                            Add Slide
                        </Button>
                    </Flex>
                </CardHeader>
                <CardBody>
                    {loading && slides.length === 0 ? (
                        <Flex justify="center" p={8}><Spinner color={customColor} /></Flex>
                    ) : (
                        <Table variant="simple" color={textColor}>
                            <Thead>
                                <Tr my=".8rem" pl="0px" color="gray.400">
                                    <Th color="gray.400">Image</Th>
                                    <Th color="gray.400">Title</Th>
                                    <Th color="gray.400">Status</Th>
                                    <Th color="gray.400" textAlign="center">Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {slides.map((slide) => (
                                    <Tr key={slide._id || slide.id}>
                                        <Td>
                                            <Image src={slide.image || slide.url} alt={slide.title} w="80px" h="50px" objectFit="cover" borderRadius="md" fallbackSrc="https://via.placeholder.com/80x50" />
                                        </Td>
                                        <Td><Text fontSize="md" color={textColor} fontWeight="bold">{slide.title}</Text></Td>
                                        <Td>
                                            <Badge colorScheme={slide.active ? "green" : "red"} variant="subtle" borderRadius="md">
                                                {slide.active ? "Active" : "Inactive"}
                                            </Badge>
                                        </Td>
                                        <Td textAlign="center">
                                            <Flex justify="center">
                                                <Button variant="ghost" colorScheme="blue" mr={2} onClick={() => handleEditSlide(slide)}><Icon as={FaEdit} /></Button>
                                                <Button variant="ghost" colorScheme="red" onClick={() => handleDeleteSlide(slide._id || slide.id)}><Icon as={FaTrash} /></Button>
                                            </Flex>
                                        </Td>
                                    </Tr>
                                ))}
                                {slides.length === 0 && (
                                    <Tr>
                                        <Td colSpan={4} textAlign="center" py={4}>No slides found.</Td>
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

export default Carousel;
