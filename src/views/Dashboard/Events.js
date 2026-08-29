
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
    FaCalendarAlt,
    FaFilePdf,
    FaFileImage,
    FaDownload,
    FaChevronLeft,
    FaChevronRight,
    FaExclamationTriangle
} from "react-icons/fa";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import {
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    showErrorToast
} from "views/utils/axiosInstance";

function Events() {
    const textColor = useColorModeValue("gray.700", "white");
    const customColor = "#0A3D91";
    const customHoverColor = "#1E88E5";
    const toast = useToast();

    const [currentView, setCurrentView] = useState("list");
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Delete modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEvents = events.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(events.length / itemsPerPage);

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

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        pdf: null
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const data = await getAllEvents();
            let eventsList = Array.isArray(data) ? data : data.events || [];

            // Sort by date descending (latest first)
            eventsList.sort((a, b) => new Date(b.date) - new Date(a.date));

            setEvents(eventsList);
        } catch (error) {
            showErrorToast(toast, error, { title: "Failed to load events" });
        } finally {
            setLoading(false);
        }
    };

    const handleBackToList = () => {
        setCurrentView("list");
        setEditingEvent(null);
        setFormData({ title: "", description: "", date: "", pdf: null });
    };

    const handleAddEvent = () => {
        setEditingEvent(null);
        setFormData({ title: "", description: "", date: "", pdf: null });
        setCurrentView("add");
    };

    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title || "",
            description: event.description || "",
            date: event.date ? event.date.split('T')[0] : "",
            pdf: null // Cannot pre-fill file input
        });
        setCurrentView("edit");
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'pdf') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
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
        data.append("date", formData.date);
        data.append("category", "new_event");
        if (formData.pdf) {
            data.append("pdf", formData.pdf);
        }

        try {
            if (currentView === "edit" && editingEvent) {
                await updateEvent(editingEvent._id || editingEvent.id, data);
                toast({ title: "Event updated successfully", status: "success", duration: 3000 });
            } else {
                await createEvent(data);
                toast({ title: "Event created successfully", status: "success", duration: 3000 });
            }
            fetchEvents();
            handleBackToList();
        } catch (error) {
            showErrorToast(toast, error);
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
            await deleteEvent(deleteTarget);
            toast({ title: "Event deleted successfully", status: "success", duration: 2000 });
            fetchEvents();
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
                                <Heading size="md" color="gray.700">{currentView === "add" ? "Create Event" : "Edit Event"}</Heading>
                            </Flex>
                        </Flex>
                    </CardHeader>
                    <CardBody bg="white" flex="1" overflow="auto">
                        <Box as="form" onSubmit={handleSubmit}>
                            <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4} mb={4}>
                                <FormControl isRequired>
                                    <FormLabel color="gray.700">Event Title</FormLabel>
                                    <Input name="title" placeholder="Event Title" value={formData.title} onChange={handleInputChange} borderColor={`${customColor}50`} _hover={{ borderColor: customColor }} _focus={{ borderColor: customColor, boxShadow: `0 0 0 1px ${customColor}` }} />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel color="gray.700">Description</FormLabel>
                                    <Input name="description" placeholder="Event Description" value={formData.description} onChange={handleInputChange} borderColor={`${customColor}50`} _hover={{ borderColor: customColor }} _focus={{ borderColor: customColor }} />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel color="gray.700">Date</FormLabel>
                                    <Input name="date" type="date" value={formData.date} onChange={handleInputChange} borderColor={`${customColor}50`} _hover={{ borderColor: customColor }} _focus={{ borderColor: customColor }} />
                                </FormControl>
                                <FormControl isRequired={currentView === "add"}>
                                    <FormLabel color="gray.700">Event File (PDF/Image)</FormLabel>
                                    <Box border={`1px dashed ${customColor}50`} p={2} borderRadius="md" _hover={{ borderColor: customColor }}>
                                        <Input type="file" name="pdf" accept=".pdf,image/*" pt={1} variant="unstyled" onChange={handleInputChange} />
                                    </Box>
                                    {currentView === "edit" && (editingEvent?.pdf || editingEvent?.pdfUrl) && (
                                        <Text fontSize="xs" mt={2} color="gray.500">Current file exists. Upload new to replace.</Text>
                                    )}
                                </FormControl>
                            </SimpleGrid>
                            <Button type="submit" isLoading={loading} bg={customColor} color="white" _hover={{ bg: customHoverColor }} mt={4} width="100%">
                                {currentView === "add" ? "Create Event" : "Update Event"}
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
                            <StatLabel color="gray.600" fontWeight="bold">Total Events</StatLabel>
                            <StatNumber fontSize="xl">{events.length}</StatNumber>
                        </Stat>
                        <Flex alignItems="center" justifyContent="center" borderRadius="12px" bg={customColor} color="white" h="45px" w="45px" flexShrink={0}>
                            <Icon as={FaCalendarAlt} w="22px" h="22px" />
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
                <CardHeader p={{ base: "14px 16px", md: "18px 24px" }} flexShrink={0}>
                    <Flex justify="space-between" align={{ base: "stretch", sm: "center" }} direction={{ base: "column", sm: "row" }} gap={3} w="100%">
                        <Text fontSize={{ base: "lg", md: "xl" }} color={textColor} fontWeight="bold">Events Table</Text>
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
                            onClick={handleAddEvent}
                        >
                            <Flex align="center" gap="8px">
                                <Icon as={FaPlus} boxSize="13px" />
                                <Text fontSize="sm" fontWeight="600" letterSpacing="0.2px">
                                    Add Event
                                </Text>
                            </Flex>
                        </Button>
                    </Flex>
                </CardHeader>
                <CardBody display="flex" flexDirection="column" flex="1" overflow="hidden" p={0}>
                    {loading && events.length === 0 ? (
                        <Flex justify="center" align="center" flex="1" p={8}><Spinner color={customColor} /></Flex>
                    ) : (
                        <Box overflowY="auto" overflowX="auto" flex="1" px={{ base: 2, md: 4 }}>
                            <Table variant="simple" color={textColor} minW={{ base: "550px", md: "100%" }}>
                                <Thead>
                                    <Tr my=".8rem" pl="0px" color="gray.400">
                                        <Th color="gray.400">S.No</Th>
                                        <Th color="gray.400">Title</Th>
                                        <Th color="gray.400">Description</Th>
                                        <Th color="gray.400">Date</Th>
                                        <Th color="gray.400" textAlign="center">Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {currentEvents.map((event, index) => {
                                        const fileUrl = event.pdfUrl || event.pdf;
                                        return (
                                            <Tr key={event._id || event.id}>
                                                <Td><Text fontSize="sm" color={textColor} fontWeight="bold">{indexOfFirstItem + index + 1}</Text></Td>
                                                <Td><Text fontSize="sm" color={textColor} fontWeight="bold">{event.title}</Text></Td>
                                                <Td><Text fontSize="sm" color={textColor}>{event.description}</Text></Td>
                                                <Td><Text fontSize="sm" color={textColor} whiteSpace="nowrap">{event.date ? event.date.split('T')[0].split('-').reverse().join('-') : "N/A"}</Text></Td>
                                                <Td textAlign="center">
                                                    <Flex justify="center">
                                                        {fileUrl && (
                                                            <Button as="a" href={fileUrl} target="_blank" variant="ghost" colorScheme="orange" size="sm" mr={1}>
                                                                <Icon as={fileUrl.toLowerCase().endsWith('.pdf') ? FaFilePdf : FaFileImage} />
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" colorScheme="blue" size="sm" mr={1} onClick={() => handleEditEvent(event)}><Icon as={FaEdit} /></Button>
                                                        <Button variant="ghost" colorScheme="red" size="sm" onClick={() => openDeleteModal(event._id || event.id)}><Icon as={FaTrash} /></Button>
                                                    </Flex>
                                                </Td>
                                            </Tr>
                                        );
                                    })}
                                    {events.length === 0 && (
                                        <Tr>
                                            <Td colSpan={5} textAlign="center" py={4}>No events found.</Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </Table>
                        </Box>
                    )}
                    {/* Fixed Pagination Controls */}
                    {events.length > 0 && (
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
                                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, events.length)} of {events.length}
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
                            Are you sure you want to delete this event? This action cannot be undone.
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

export default Events;
