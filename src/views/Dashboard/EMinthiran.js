
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
    Spinner,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    HStack,
    IconButton,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useState, useEffect } from "react";
import {
    FaArrowLeft,
    FaFilePdf,
    FaPlus,
    FaTrash,
    FaEdit,
    FaDownload,
    FaChevronLeft,
    FaChevronRight
} from "react-icons/fa";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import {
    getAllMinthiran,
    createMinthiran,
    updateMinthiran,
    deleteMinthiran
} from "views/utils/axiosInstance";

function EMinthiran() {
    const textColor = useColorModeValue("gray.700", "white");
    const customColor = "#0A3D91";
    const customHoverColor = "#1E88E5";
    const toast = useToast();

    const [currentView, setCurrentView] = useState("list");
    const [loading, setLoading] = useState(false);
    const [pdfs, setPdfs] = useState([]);
    const [editingPdf, setEditingPdf] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [deleteId, setDeleteId] = useState(null);

    // Pagination & Filters
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [filterYear, setFilterYear] = useState("");
    const [filterMonth, setFilterMonth] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Calculate Unique Years for Filter
    const uniqueYears = [...new Set(pdfs.map(pdf => pdf.year))].sort((a, b) => b - a);

    // Filter Logic
    const filteredItems = pdfs.filter(pdf => {
        let matchesYear = true;
        let matchesMonth = true;
        let matchesDate = true;

        if (filterYear) {
            matchesYear = pdf.year.toString() === filterYear;
        }

        if (filterMonth) {
            matchesMonth = pdf.month === filterMonth;
        }

        if (startDate && endDate) {
            const pdfDate = new Date(pdf.createdAt);
            const start = new Date(startDate);
            const end = new Date(endDate);
            // set end date to end of day
            end.setHours(23, 59, 59, 999);
            matchesDate = pdfDate >= start && pdfDate <= end;
        } else if (startDate) {
            const pdfDate = new Date(pdf.createdAt);
            const start = new Date(startDate);
            matchesDate = pdfDate >= start;
        } else if (endDate) {
            const pdfDate = new Date(pdf.createdAt);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            matchesDate = pdfDate <= end;
        }

        return matchesYear && matchesMonth && matchesDate;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const [formData, setFormData] = useState({
        year: new Date().getFullYear().toString(),
        month: "January",
        pdf: null
    });

    useEffect(() => {
        fetchMagazines();
    }, []);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterYear, filterMonth, startDate, endDate]);

    const fetchMagazines = async () => {
        setLoading(true);
        try {
            const data = await getAllMinthiran();
            let list = [];

            if (Array.isArray(data)) {
                list = data;
            } else if (data.minthiran && Array.isArray(data.minthiran)) {
                list = data.minthiran;
            } else {
                // Handle year-wise grouped object response
                list = Object.values(data).reduce((acc, curr) => {
                    if (Array.isArray(curr)) {
                        return acc.concat(curr);
                    }
                    return acc;
                }, []);
            }

            setPdfs([...list].reverse());
        } catch (error) {
            toast({
                title: "Error fetching magazines",
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
        setEditingPdf(null);
        setFormData({ year: new Date().getFullYear().toString(), month: "January", pdf: null });
    };

    const handleAddMagazine = () => {
        setEditingPdf(null);
        setFormData({ year: new Date().getFullYear().toString(), month: "January", pdf: null });
        setCurrentView("add");
    };

    const handleEditMagazine = (pdf) => {
        setEditingPdf(pdf);
        setFormData({
            year: pdf.year || "",
            month: pdf.month || "January",
            pdf: null
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
        data.append("year", formData.year);
        data.append("month", formData.month);
        if (formData.pdf) {
            data.append("pdf", formData.pdf);
        }

        try {
            if (currentView === "edit" && editingPdf) {
                await updateMinthiran(editingPdf._id || editingPdf.id, data);
                toast({ title: "Magazine updated", status: "success", duration: 3000 });
            } else {
                await createMinthiran(data);
                toast({ title: "Magazine created", status: "success", duration: 3000 });
            }
            fetchMagazines();
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

    const handleDeleteMagazine = (id) => {
        setDeleteId(id);
        onOpen();
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setLoading(true);
        try {
            await deleteMinthiran(deleteId);
            toast({ title: "Magazine deleted", status: "success", duration: 2000 });
            fetchMagazines();
            onClose();
        } catch (error) {
            toast({
                title: "Delete failed",
                description: error.message,
                status: "error",
                duration: 3000,
            });
        } finally {
            setLoading(false);
            setDeleteId(null);
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
                                <Heading size="md" color="gray.700">{currentView === "add" ? "Upload Magazine" : "Edit Magazine"}</Heading>
                            </Flex>
                        </Flex>
                    </CardHeader>
                    <CardBody bg="white" flex="1" overflow="auto">
                        <Box as="form" onSubmit={handleSubmit}>
                            <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4} mb={4}>
                                <FormControl isRequired>
                                    <FormLabel color="gray.700">Year</FormLabel>
                                    <Input name="year" placeholder="2025" value={formData.year} onChange={handleInputChange} borderColor={`${customColor}50`} _hover={{ borderColor: customColor }} _focus={{ borderColor: customColor, boxShadow: `0 0 0 1px ${customColor}` }} />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel color="gray.700">Month</FormLabel>
                                    <Select name="month" value={formData.month} onChange={handleInputChange} borderColor={`${customColor}50`} _hover={{ borderColor: customColor }}>
                                        <option value="January">January</option>
                                        <option value="February">February</option>
                                        <option value="March">March</option>
                                        <option value="April">April</option>
                                        <option value="May">May</option>
                                        <option value="June">June</option>
                                        <option value="July">July</option>
                                        <option value="August">August</option>
                                        <option value="September">September</option>
                                        <option value="October">October</option>
                                        <option value="November">November</option>
                                        <option value="December">December</option>
                                    </Select>
                                </FormControl>
                                <FormControl isRequired={currentView === "add"}>
                                    <FormLabel color="gray.700">PDF File</FormLabel>
                                    <Box border={`1px dashed ${customColor}50`} p={2} borderRadius="md" _hover={{ borderColor: customColor }}>
                                        <Input type="file" name="pdf" accept=".pdf" pt={1} variant="unstyled" onChange={handleInputChange} />
                                    </Box>
                                    {currentView === "edit" && editingPdf?.pdf && (
                                        <Text fontSize="xs" mt={2} color="gray.500">Existing PDF exists.</Text>
                                    )}
                                </FormControl>
                            </SimpleGrid>
                            <Button type="submit" isLoading={loading} bg={customColor} color="white" _hover={{ bg: customHoverColor }} mt={4} width="100%">
                                {currentView === "add" ? "Create Minthiran" : "Update Minthiran"}
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
                            <StatLabel color="gray.600" fontWeight="bold">Total Magazines</StatLabel>
                            <StatNumber fontSize="xl">{pdfs.length}</StatNumber>
                        </Stat>
                        <Flex alignItems="center" justifyContent="center" borderRadius="12px" bg={customColor} color="white" h="45px" w="45px">
                            <Icon as={IoCheckmarkDoneCircleSharp} w="24px" h="24px" />
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
                        <Text fontSize="xl" color={textColor} fontWeight="bold">e-Minthiran Table</Text>
                        <Button bg={customColor} color="white" _hover={{ bg: customHoverColor }} onClick={handleAddMagazine} leftIcon={<FaPlus />}>
                            Upload Magazine
                        </Button>
                    </Flex>
                </CardHeader>
                <CardBody>
                    {/* Filters */}
                    <Flex mb={4} gap={4} wrap="wrap" alignItems="flex-end">
                        <FormControl w={{ base: "100%", md: "200px" }}>
                            <FormLabel fontSize="sm" color="gray.500">Filter by Year</FormLabel>
                            <Select placeholder="All Years" value={filterYear} onChange={(e) => setFilterYear(e.target.value)} size="sm">
                                {uniqueYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl w={{ base: "100%", md: "200px" }}>
                            <FormLabel fontSize="sm" color="gray.500">Filter by Month</FormLabel>
                            <Select placeholder="All Months" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} size="sm">
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                            </Select>
                        </FormControl>
                        <FormControl w={{ base: "100%", md: "200px" }}>
                            <FormLabel fontSize="sm" color="gray.500">Start Date</FormLabel>
                            <Input type="date" size="sm" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </FormControl>
                        <FormControl w={{ base: "100%", md: "200px" }}>
                            <FormLabel fontSize="sm" color="gray.500">End Date</FormLabel>
                            <Input type="date" size="sm" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </FormControl>
                        <Button size="sm" onClick={() => { setFilterYear(""); setFilterMonth(""); setStartDate(""); setEndDate(""); }} colorScheme="gray">Clear</Button>
                    </Flex>

                    {loading && pdfs.length === 0 ? (
                        <Flex justify="center" p={8}><Spinner color={customColor} /></Flex>
                    ) : (
                        <Box>
                            <Table variant="simple" color={textColor} mb={4}>
                                <Thead>
                                    <Tr my=".8rem" pl="0px" color="gray.400">
                                        <Th color="gray.400">Title / File</Th>
                                        <Th color="gray.400">Year</Th>
                                        <Th color="gray.400">Month</Th>
                                        <Th color="gray.400" textAlign="center">Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {currentItems.map((pdf) => (
                                        <Tr key={pdf._id || pdf.id}>
                                            <Td>
                                                <Flex align="center">
                                                    <Icon as={FaFilePdf} color="red.500" mr={2} />
                                                    <Text fontSize="md" color={textColor} fontWeight="bold">{pdf.title || `Minthiran ${pdf.month} ${pdf.year}`}</Text>
                                                </Flex>
                                            </Td>
                                            <Td><Text fontSize="md" color={textColor}>{pdf.year}</Text></Td>
                                            <Td><Text fontSize="md" color={textColor}>{pdf.month}</Text></Td>
                                            <Td textAlign="center">
                                                <Flex justify="center">
                                                    {pdf.pdf?.url && (
                                                        <Button as="a" href={pdf.pdf.url} target="_blank" variant="ghost" colorScheme="blue" mr={2}><Icon as={FaDownload} /></Button>
                                                    )}
                                                    <Button variant="ghost" colorScheme="orange" mr={2} onClick={() => handleEditMagazine(pdf)}><Icon as={FaEdit} /></Button>
                                                    <Button variant="ghost" colorScheme="red" onClick={() => handleDeleteMagazine(pdf._id || pdf.id)}><Icon as={FaTrash} /></Button>
                                                </Flex>
                                            </Td>
                                        </Tr>
                                    ))}
                                    {currentItems.length === 0 && (
                                        <Tr>
                                            <Td colSpan={4} textAlign="center" py={4}>No magazines found.</Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </Table>
                            {/* Pagination */}
                            <Flex justify="flex-end" align="center" mt={4}>
                                <HStack spacing={2}>
                                    <IconButton
                                        icon={<FaChevronLeft />}
                                        onClick={() => paginate(currentPage - 1)}
                                        isDisabled={currentPage === 1}
                                        aria-label="Previous Page"
                                        size="sm"
                                    />
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <Button
                                            key={i + 1}
                                            size="sm"
                                            onClick={() => paginate(i + 1)}
                                            bg={currentPage === i + 1 ? customColor : "gray.200"}
                                            color={currentPage === i + 1 ? "white" : "gray.700"}
                                            _hover={{ bg: currentPage === i + 1 ? customHoverColor : "gray.300" }}
                                        >
                                            {i + 1}
                                        </Button>
                                    ))}
                                    <IconButton
                                        icon={<FaChevronRight />}
                                        onClick={() => paginate(currentPage + 1)}
                                        isDisabled={currentPage === totalPages}
                                        aria-label="Next Page"
                                        size="sm"
                                    />
                                </HStack>
                            </Flex>
                        </Box>
                    )}
                </CardBody>
            </Card>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Deletion</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are you sure you want to delete this magazine? This action cannot be undone.
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="red" onClick={confirmDelete} isLoading={loading}>
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex >
    );
}

export default EMinthiran;
