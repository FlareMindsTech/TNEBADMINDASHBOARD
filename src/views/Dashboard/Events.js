
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
    FaCalendarAlt,
    FaFilePdf,
    FaDownload
} from "react-icons/fa";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import {
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent
} from "views/utils/axiosInstance";

function Events() {
    const textColor = useColorModeValue("gray.700", "white");
    const customColor = "#d70f18";
    const customHoverColor = "#b00c14";
    const toast = useToast();

    const [currentView, setCurrentView] = useState("list");
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);

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
            toast({
                title: "Error fetching events",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
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
        if (formData.pdf) {
            data.append("pdf", formData.pdf);
        }

        try {
            if (currentView === "edit" && editingEvent) {
                await updateEvent(editingEvent._id, data);
                toast({ title: "Event updated successfully", status: "success", duration: 3000 });
            } else {
                await createEvent(data);
                toast({ title: "Event created successfully", status: "success", duration: 3000 });
            }
            fetchEvents();
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

    const handleDeleteEvent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;

        setLoading(true);
        try {
            await deleteEvent(id);
            toast({ title: "Event deleted", status: "success", duration: 2000 });
            fetchEvents();
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
                                    <FormLabel color="gray.700">Event PDF</FormLabel>
                                    <Box border={`1px dashed ${customColor}50`} p={2} borderRadius="md" _hover={{ borderColor: customColor }}>
                                        <Input type="file" name="pdf" accept=".pdf" pt={1} variant="unstyled" onChange={handleInputChange} />
                                    </Box>
                                    {currentView === "edit" && editingEvent?.pdf && (
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
        <Flex flexDirection={{ base: "column", md: "row" }} gap={4} mb={4}>
            <Card minH="83px" cursor="pointer" bg="white" w={{ base: "32%", md: "30%", lg: "25%" }} border={`1px solid ${customColor}30`} _hover={{ borderColor: customColor, transform: "translateY(-4px)" }} transition="all 0.2s">
                <CardBody>
                    <Flex align="center" justify="space-between">
                        <Stat>
                            <StatLabel color="gray.600" fontWeight="bold">Total Events</StatLabel>
                            <StatNumber fontSize="xl">{events.length}</StatNumber>
                        </Stat>
                        <Flex alignItems="center" justifyContent="center" borderRadius="12px" bg={customColor} color="white" h="45px" w="45px">
                            <Icon as={FaCalendarAlt} w="24px" h="24px" />
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
                        <Text fontSize="xl" color={textColor} fontWeight="bold">Events Table</Text>
                        <Button bg={customColor} color="white" _hover={{ bg: customHoverColor }} onClick={handleAddEvent} leftIcon={<FaPlus />}>
                            Add Event
                        </Button>
                    </Flex>
                </CardHeader>
                <CardBody>
                    {loading && events.length === 0 ? (
                        <Flex justify="center" p={8}><Spinner color={customColor} /></Flex>
                    ) : (
                        <Table variant="simple" color={textColor}>
                            <Thead>
                                <Tr my=".8rem" pl="0px" color="gray.400">
                                    <Th color="gray.400">Title</Th>
                                    <Th color="gray.400">Description</Th>
                                    <Th color="gray.400">Date</Th>
                                    <Th color="gray.400" textAlign="center">Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {events.map((event) => (
                                    <Tr key={event._id || event.id}>
                                        <Td><Text fontSize="md" color={textColor} fontWeight="bold">{event.title}</Text></Td>
                                        <Td><Text fontSize="md" color={textColor}>{event.description}</Text></Td>
                                        <Td><Text fontSize="md" color={textColor}>{event.date ? event.date.split('T')[0].split('-').reverse().join('-') : "N/A"}</Text></Td>
                                        <Td textAlign="center">
                                            <Flex justify="center">
                                                {event.pdf && (
                                                    <Button as="a" href={event.pdf} target="_blank" variant="ghost" colorScheme="orange" mr={2}>
                                                        <Icon as={FaFilePdf} />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" colorScheme="blue" mr={2} onClick={() => handleEditEvent(event)}><Icon as={FaEdit} /></Button>
                                                <Button variant="ghost" colorScheme="red" onClick={() => handleDeleteEvent(event._id || event.id)}><Icon as={FaTrash} /></Button>
                                            </Flex>
                                        </Td>
                                    </Tr>
                                ))}
                                {events.length === 0 && (
                                    <Tr>
                                        <Td colSpan={4} textAlign="center" py={4}>No events found.</Td>
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

export default Events;
