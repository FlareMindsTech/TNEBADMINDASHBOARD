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
    Switch,
    Tooltip,
    HStack,
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
    FaFilePdf,
    FaFileAlt,
    FaBullhorn,
    FaCalendarAlt,
    FaChevronLeft,
    FaChevronRight,
    FaExclamationTriangle
} from "react-icons/fa";
import {
    getAllNotices,
    createNotice,
    updateNotice,
    deleteNotice,
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    showErrorToast
} from "views/utils/axiosInstance";

function ImportantNotice() {
    const textColor = useColorModeValue("gray.700", "white");
    const customColor = "#0A3D91";
    const customHoverColor = "#1E88E5";
    const toast = useToast();

    const [currentView, setCurrentView] = useState("list");
    const [loading, setLoading] = useState(false);
    const [notices, setNotices] = useState([]);
    const [events, setEvents] = useState([]);
    const [editingNotice, setEditingNotice] = useState(null);
    const [togglingEventId, setTogglingEventId] = useState(null);

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
    const currentNotices = notices.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(notices.length / itemsPerPage);

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
        Notice_title: "",
        Type: "",
        date: "",
        document: null,
        showInEvents: false
    });

    useEffect(() => {
        fetchNotices();
    }, []);

    const getMatchedEvent = (notice, eventsList = events) => {
        if (!notice || !Array.isArray(eventsList) || eventsList.length === 0) return null;
        const nTitle = (notice.Notice_title || "").trim().toLowerCase();
        return eventsList.find((evt) => {
            const eTitle = (evt.title || "").trim().toLowerCase();
            if (eTitle && nTitle && eTitle === nTitle) return true;
            if (notice.docUrl && evt.pdfUrl && evt.pdfUrl === notice.docUrl) return true;
            return false;
        });
    };

    const fetchNotices = async () => {
        setLoading(true);
        try {
            const [noticesData, eventsData] = await Promise.all([
                getAllNotices(),
                getAllEvents().catch(() => [])
            ]);

            const noticesList = Array.isArray(noticesData) ? noticesData : [];
            const eventsList = Array.isArray(eventsData) ? eventsData : [];
            setEvents(eventsList);

            // Sort descending (newest notices first)
            const sortedNotices = [...noticesList].sort((a, b) => {
                const dateA = new Date(a.date || a.createdAt || a.updatedAt || 0).getTime();
                const dateB = new Date(b.date || b.createdAt || b.updatedAt || 0).getTime();
                if (dateA && dateB && dateA !== dateB && !isNaN(dateA) && !isNaN(dateB)) {
                    return dateB - dateA;
                }
                return String(b._id || b.id || "").localeCompare(String(a._id || a.id || ""));
            });

            setNotices(sortedNotices);
        } catch (error) {
            showErrorToast(toast, error, { title: "Failed to load notices" });
        } finally {
            setLoading(false);
        }
    };

    const handleBackToList = () => {
        setCurrentView("list");
        setEditingNotice(null);
        setFormData({ Notice_title: "", Type: "", date: "", document: null, showInEvents: false });
    };

    const handleAddNotice = () => {
        setEditingNotice(null);
        setFormData({
            Notice_title: "",
            Type: "",
            date: new Date().toISOString().split("T")[0],
            document: null,
            showInEvents: false
        });
        setCurrentView("add");
    };

    const handleEditNotice = (notice) => {
        setEditingNotice(notice);
        const matched = getMatchedEvent(notice);
        setFormData({
            Notice_title: notice.Notice_title || "",
            Type: notice.Type || "",
            date: notice.date ? notice.date.split("T")[0] : "",
            document: null, // Cannot pre-fill file input
            showInEvents: !!matched || !!notice.showInEvents
        });
        setCurrentView("edit");
    };

    const handleInputChange = (e) => {
        const { name, value, files, type, checked } = e.target;
        if (type === "checkbox") {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (name === "document") {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else if (name === "Type") {
            if (value.length > 120) {
                toast({
                    title: "Character Limit Reached",
                    description: "Category cannot exceed 120 characters.",
                    status: "warning",
                    duration: 2500,
                    isClosable: true
                });
                setFormData(prev => ({ ...prev, [name]: value.slice(0, 120) }));
            } else {
                setFormData(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const getFileBlobFromUrl = async (url) => {
        if (!url) return null;
        try {
            const response = await fetch(url);
            if (!response.ok) return null;
            const blob = await response.blob();
            const cleanName = url.split("/").pop().split("?")[0] || "document.pdf";
            return new File([blob], cleanName.endsWith(".pdf") ? cleanName : `${cleanName}.pdf`, {
                type: blob.type || "application/pdf"
            });
        } catch (e) {
            console.warn("Could not convert docUrl to file blob:", e);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append("Notice_title", formData.Notice_title);
        data.append("Type", formData.Type);
        if (formData.date) {
            data.append("date", formData.date);
        }
        if (formData.document) {
            data.append("document", formData.document);
        }
        data.append("showInEvents", formData.showInEvents);

        try {
            if (currentView === "edit" && editingNotice) {
                const updatedNotice = await updateNotice(editingNotice._id, data);

                // Synchronize with Events collection
                const matched = getMatchedEvent(editingNotice);
                if (formData.showInEvents) {
                    const eventData = new FormData();
                    eventData.append("title", formData.Notice_title);
                    eventData.append("date", formData.date || new Date().toISOString());
                    eventData.append("category", formData.Type || "Important Notice");
                    const docUrlToUse = (typeof formData.document === 'string' ? formData.document : null) || updatedNotice?.docUrl || editingNotice?.docUrl;
                    if (formData.document instanceof File || formData.document instanceof Blob) {
                        eventData.append("pdf", formData.document);
                    }
                    if (docUrlToUse) {
                        eventData.append("pdfUrl", docUrlToUse);
                        eventData.append("docUrl", docUrlToUse);
                        eventData.append("link", docUrlToUse);
                    }
                    if (matched) {
                        await updateEvent(matched._id || matched.id, eventData).catch(() => {});
                    } else {
                        await createEvent(eventData).catch(() => {});
                    }
                } else if (matched) {
                    await deleteEvent(matched._id || matched.id).catch(() => {});
                }

                toast({ title: "Notice updated successfully", status: "success", duration: 3000 });
            } else {
                const createdNotice = await createNotice(data);

                // If "Show in Events" is checked on create, create matching Event entry
                if (formData.showInEvents) {
                    const eventData = new FormData();
                    eventData.append("title", formData.Notice_title);
                    eventData.append("date", formData.date || new Date().toISOString());
                    eventData.append("category", formData.Type || "Important Notice");
                    const docUrlToUse = (typeof formData.document === 'string' ? formData.document : null) || createdNotice?.docUrl;
                    if (formData.document instanceof File || formData.document instanceof Blob) {
                        eventData.append("pdf", formData.document);
                    }
                    if (docUrlToUse) {
                        eventData.append("pdfUrl", docUrlToUse);
                        eventData.append("docUrl", docUrlToUse);
                        eventData.append("link", docUrlToUse);
                    }
                    await createEvent(eventData).catch(() => {});
                }

                toast({ title: "Notice created successfully", status: "success", duration: 3000 });
            }
            fetchNotices();
            handleBackToList();
        } catch (error) {
            showErrorToast(toast, error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleInEvents = async (notice, e) => {
        if (e) e.stopPropagation();
        const matched = getMatchedEvent(notice);
        const willBeInEvents = !matched;
        setTogglingEventId(notice._id);

        try {
            if (willBeInEvents) {
                const eventData = new FormData();
                eventData.append("title", notice.Notice_title);
                eventData.append("date", notice.date || new Date().toISOString());
                eventData.append("category", notice.Type || "Important Notice");
                if (notice.docUrl) {
                    eventData.append("pdfUrl", notice.docUrl);
                    eventData.append("docUrl", notice.docUrl);
                    eventData.append("link", notice.docUrl);
                }
                await createEvent(eventData);
                toast({
                    title: "Added to Events",
                    description: `"${notice.Notice_title}" with PDF is now live in Latest Events.`,
                    status: "success",
                    duration: 2500,
                    isClosable: true
                });
            } else if (matched) {
                await deleteEvent(matched._id || matched.id);
                toast({
                    title: "Removed from Events",
                    description: `"${notice.Notice_title}" removed from Events.`,
                    status: "info",
                    duration: 2500,
                    isClosable: true
                });
            }
            await fetchNotices();
        } catch (err) {
            showErrorToast(toast, err, { title: "Failed to update event status" });
        } finally {
            setTogglingEventId(null);
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
            const targetNotice = notices.find(n => n._id === deleteTarget);
            const matched = getMatchedEvent(targetNotice);
            if (matched) {
                await deleteEvent(matched._id || matched.id).catch(() => {});
            }

            await deleteNotice(deleteTarget);
            toast({ title: "Notice deleted successfully", status: "success", duration: 2000 });
            fetchNotices();
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
                                <Heading size="md" color="gray.700">{currentView === "add" ? "Create Important Notice" : "Edit Important Notice"}</Heading>
                            </Flex>
                        </Flex>
                    </CardHeader>
                    <CardBody bg="white" flex="1" overflow="auto">
                        <Box as="form" onSubmit={handleSubmit}>
                            <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4} mb={4}>
                                <FormControl isRequired>
                                    <FormLabel color="gray.700">Notice Title</FormLabel>
                                    <Input name="Notice_title" placeholder="Notice Title" value={formData.Notice_title} onChange={handleInputChange} borderColor={`${customColor}50`} _hover={{ borderColor: customColor }} _focus={{ borderColor: customColor, boxShadow: `0 0 0 1px ${customColor}` }} />
                                </FormControl>
                                <FormControl isRequired isInvalid={(formData.Type || "").length >= 120}>
                                    <Flex justify="space-between" align="center" mb={1}>
                                        <FormLabel color="gray.700" mb={0}>Category / Type</FormLabel>
                                        <Text
                                            fontSize="xs"
                                            fontWeight="bold"
                                            color={(formData.Type || "").length >= 120 ? "red.500" : (formData.Type || "").length > 100 ? "orange.500" : "gray.500"}
                                        >
                                            {(formData.Type || "").length}/120 characters
                                        </Text>
                                    </Flex>
                                    <Input
                                        name="Type"
                                        placeholder="Notice Category / Type (Max 120 characters)"
                                        value={formData.Type}
                                        maxLength={120}
                                        onChange={handleInputChange}
                                        borderColor={(formData.Type || "").length >= 120 ? "red.400" : `${customColor}50`}
                                        _hover={{ borderColor: (formData.Type || "").length >= 120 ? "red.500" : customColor }}
                                        _focus={{
                                             borderColor: (formData.Type || "").length >= 120 ? "red.500" : customColor,
                                             boxShadow: (formData.Type || "").length >= 120 ? "0 0 0 1px red" : `0 0 0 1px ${customColor}`
                                        }}
                                    />
                                    {(formData.Type || "").length >= 120 ? (
                                        <Text fontSize="xs" color="red.500" mt={1} fontWeight="600">
                                            ⚠️ Maximum limit reached (120 characters allowed).
                                        </Text>
                                    ) : (
                                        <Text fontSize="xs" color="gray.500" mt={1}>
                                            Maximum 120 characters allowed ({120 - (formData.Type || "").length} remaining).
                                        </Text>
                                    )}
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel color="gray.700">Date</FormLabel>
                                    <Input name="date" type="date" value={formData.date} onChange={handleInputChange} borderColor={`${customColor}50`} _hover={{ borderColor: customColor }} _focus={{ borderColor: customColor }} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel color="gray.700">Document File (Optional)</FormLabel>
                                    <Box border={`1px dashed ${customColor}50`} p={2} borderRadius="md" _hover={{ borderColor: customColor }}>
                                        <Input type="file" name="document" accept=".pdf,.doc,.docx" pt={1} variant="unstyled" onChange={handleInputChange} />
                                    </Box>
                                    {currentView === "edit" && editingNotice?.docUrl && (
                                        <Text fontSize="xs" mt={2} color="gray.500">Current file exists. Upload new to replace.</Text>
                                    )}
                                </FormControl>

                                {/* Professional Show in Events Checkbox / Switch Option */}
                                <Box
                                    p={4}
                                    borderRadius="xl"
                                    bg="blue.50"
                                    border="1.5px solid"
                                    borderColor="blue.200"
                                    transition="all 0.2s ease"
                                    _hover={{ borderColor: customColor, boxShadow: "0 2px 10px rgba(10, 61, 145, 0.08)" }}
                                >
                                    <Flex align="center" justify="space-between" wrap="nowrap" gap={3}>
                                        <Flex align="center" gap={3}>
                                            <Flex
                                                alignItems="center"
                                                justifyContent="center"
                                                borderRadius="10px"
                                                bg="linear-gradient(135deg, #0A3D91 0%, #1557bf 100%)"
                                                color="white"
                                                h="42px"
                                                w="42px"
                                                flexShrink={0}
                                                boxShadow="0 3px 8px rgba(10, 61, 145, 0.25)"
                                            >
                                                <Icon as={FaBullhorn} w="18px" h="18px" />
                                            </Flex>
                                            <Box>
                                                <Text fontWeight="700" fontSize="sm" color="gray.800" letterSpacing="0.2px">
                                                    Show in Events / Latest Updates
                                                </Text>
                                                <Text fontSize="xs" color="gray.600" mt="1px">
                                                    Feature this notice in the homepage Latest News & Events ticker automatically.
                                                </Text>
                                            </Box>
                                        </Flex>
                                        <Switch
                                            size="lg"
                                            colorScheme="blue"
                                            isChecked={formData.showInEvents}
                                            onChange={(e) => setFormData(prev => ({ ...prev, showInEvents: e.target.checked }))}
                                        />
                                    </Flex>
                                </Box>
                            </SimpleGrid>
                            <Button type="submit" isLoading={loading} bg={customColor} color="white" _hover={{ bg: customHoverColor }} mt={4} width="100%">
                                {currentView === "add" ? "Create Notice" : "Update Notice"}
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
                            <StatLabel color="gray.600" fontWeight="bold">Total Notices</StatLabel>
                            <StatNumber fontSize="xl">{notices.length}</StatNumber>
                        </Stat>
                        <Flex alignItems="center" justifyContent="center" borderRadius="12px" bg={customColor} color="white" h="45px" w="45px" flexShrink={0}>
                            <Icon as={FaBullhorn} w="22px" h="22px" />
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
                        <Text fontSize={{ base: "lg", md: "xl" }} color={textColor} fontWeight="bold">Important Notices Table</Text>
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
                            onClick={handleAddNotice}
                        >
                            <Flex align="center" gap="8px">
                                <Icon as={FaPlus} boxSize="13px" />
                                <Text fontSize="sm" fontWeight="600" letterSpacing="0.2px">
                                    Add Notice
                                </Text>
                            </Flex>
                        </Button>
                    </Flex>
                </CardHeader>
                <CardBody display="flex" flexDirection="column" flex="1" overflow="hidden" p={0}>
                    {loading && notices.length === 0 ? (
                        <Flex justify="center" align="center" flex="1" p={8}><Spinner color={customColor} /></Flex>
                    ) : (
                        <Box overflowY="auto" overflowX="auto" flex="1" px={{ base: 2, md: 4 }}>
                            <Table variant="simple" color={textColor} minW={{ base: "650px", md: "100%" }}>
                                <Thead>
                                    <Tr my=".8rem" pl="0px" color="gray.400">
                                        <Th color="gray.400">S.No</Th>
                                        <Th color="gray.400">Title</Th>
                                        <Th color="gray.400">Type</Th>
                                        <Th color="gray.400">Notice Date</Th>
                                        <Th color="gray.400" textAlign="center">Show in Events</Th>
                                        <Th color="gray.400" textAlign="center">Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {currentNotices.map((notice, index) => {
                                        const isInEvents = !!getMatchedEvent(notice);
                                        const isToggling = togglingEventId === notice._id;
                                        return (
                                            <Tr key={notice._id} _hover={{ bg: "gray.50" }} transition="background-color 0.15s">
                                                <Td><Text fontSize="sm" color={textColor} fontWeight="bold">{indexOfFirstItem + index + 1}</Text></Td>
                                                <Td>
                                                    {notice.docUrl ? (
                                                        <Text
                                                            as="a"
                                                            href={notice.docUrl}
                                                            target="_blank"
                                                            fontSize="sm"
                                                            color={customColor}
                                                            fontWeight="bold"
                                                            cursor="pointer"
                                                            _hover={{ textDecoration: "underline", color: customHoverColor }}
                                                        >
                                                            {notice.Notice_title}
                                                        </Text>
                                                    ) : (
                                                        <Text fontSize="sm" color={textColor} fontWeight="bold">
                                                            {notice.Notice_title}
                                                        </Text>
                                                    )}
                                                </Td>
                                                <Td>
                                                    <Badge colorScheme="purple">
                                                        {notice.Type ? notice.Type.toUpperCase() : "GENERAL"}
                                                    </Badge>
                                                </Td>
                                                <Td><Text fontSize="sm" color={textColor} whiteSpace="nowrap">{notice.date ? notice.date.split("T")[0].split("-").reverse().join("-") : "N/A"}</Text></Td>
                                                
                                                {/* Show in Events quick-toggle switch / badge */}
                                                <Td textAlign="center">
                                                    <Tooltip label={isInEvents ? "Visible in Homepage Events. Click to remove." : "Not in Events. Click to add to Events."} placement="top" hasArrow>
                                                        <Box display="inline-flex" alignItems="center" gap={2} cursor="pointer" onClick={(e) => handleToggleInEvents(notice, e)}>
                                                            <Switch
                                                                size="sm"
                                                                colorScheme="blue"
                                                                isChecked={isInEvents}
                                                                isDisabled={isToggling}
                                                                onChange={() => {}}
                                                            />
                                                            <Badge
                                                                colorScheme={isInEvents ? "green" : "gray"}
                                                                variant="subtle"
                                                                fontSize="10px"
                                                                px={2}
                                                                py={0.5}
                                                                borderRadius="full"
                                                                textTransform="none"
                                                                fontWeight="600"
                                                            >
                                                                {isInEvents ? "Active" : "Off"}
                                                            </Badge>
                                                        </Box>
                                                    </Tooltip>
                                                </Td>

                                                <Td textAlign="center">
                                                    <Flex justify="center">
                                                        {notice.docUrl && (
                                                            <Button as="a" href={notice.docUrl} target="_blank" variant="ghost" colorScheme="orange" size="sm" mr={1}>
                                                                <Icon as={FaFilePdf} />
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" colorScheme="blue" size="sm" mr={1} onClick={() => handleEditNotice(notice)}><Icon as={FaEdit} /></Button>
                                                        <Button variant="ghost" colorScheme="red" size="sm" onClick={() => openDeleteModal(notice._id)}><Icon as={FaTrash} /></Button>
                                                    </Flex>
                                                </Td>
                                            </Tr>
                                        );
                                    })}
                                    {notices.length === 0 && (
                                        <Tr>
                                            <Td colSpan={6} textAlign="center" py={4}>No notices found.</Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </Table>
                        </Box>
                    )}
                    {/* Fixed Pagination Controls */}
                    {notices.length > 0 && (
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
                                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, notices.length)} of {notices.length}
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

            <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} isCentered>
                <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
                <ModalContent borderRadius="xl" mx={4}>
                    <ModalHeader pb={2}>
                        <Flex align="center" gap={3}>
                            <Flex alignItems="center" justifyContent="center" borderRadius="full" bg="red.50" color="red.500" h="40px" w="40px">
                                <Icon as={FaExclamationTriangle} w="18px" h="18px" />
                            </Flex>
                            <Text fontSize="lg" fontWeight="bold" color="gray.700">Confirm Delete</Text>
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text color="gray.600">Are you sure you want to delete this notice? This action cannot be undone.</Text>
                    </ModalBody>
                    <ModalFooter gap={3}>
                        <Button variant="outline" onClick={closeDeleteModal} borderColor="gray.300" color="gray.600" _hover={{ bg: "gray.50" }}>Cancel</Button>
                        <Button bg={customColor} color="white" _hover={{ bg: customHoverColor }} onClick={handleConfirmDelete} isLoading={isDeleting} loadingText="Deleting..." leftIcon={<Icon as={FaTrash} />}>Delete</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default ImportantNotice;
